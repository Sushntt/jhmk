import { NextResponse } from "next/server"
import {
  isAirtableConfigured,
  getOrders,
  decrementStock,
  markStockDeducted,
  resolveProductIdsByName,
} from "@/lib/airtable"

export const dynamic = "force-dynamic"

/**
 * Takes stock off for orders that have been CONFIRMED, and only those.
 *
 * Reaching WhatsApp is not an order - shoppers abandon there constantly - so
 * nothing is deducted at checkout. Once the client sets an order's Status to
 * "confirmed" in Airtable, this route deducts its items and ticks the
 * "Stock Deducted" checkbox so the same order can never be counted twice.
 *
 * Trigger it either way:
 *   - Airtable automation: "When record updated" on Status -> Send webhook here.
 *     Near-instant, nothing extra to run.
 *   - Or any scheduler hitting it every 5 minutes.
 *
 * Protected by SYNC_SECRET so it can't be called by anyone who finds the URL:
 *   /api/sync-stock?secret=...     or     Authorization: Bearer <secret>
 */

const CONFIRMED_STATUSES = ["confirmed", "shipped", "delivered"]

function authorised(request: Request): boolean {
  const secret = process.env.SYNC_SECRET
  // Fail closed. Without a secret configured the route refuses to run rather
  // than letting anyone trigger stock changes.
  if (!secret) return false

  const { searchParams } = new URL(request.url)
  if (searchParams.get("secret") === secret) return true

  const auth = request.headers.get("authorization") || ""
  return auth === `Bearer ${secret}`
}

async function run(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json(
      { error: "Unauthorised. Set SYNC_SECRET and pass ?secret= or an Authorization header." },
      { status: 401 }
    )
  }

  if (!isAirtableConfigured) {
    return NextResponse.json({ error: "Airtable is not configured" }, { status: 503 })
  }

  try {
    const orders = await getOrders()

    const pending = orders.filter(
      (o) =>
        CONFIRMED_STATUSES.includes((o.status || "").trim().toLowerCase()) &&
        !o.stockDeducted
    )

    const processed: {
      orderId: string
      customer: string
      items: number
      ok: boolean
      errors?: string[]
    }[] = []

    // The Items column stores readable text rather than raw JSON, so line items
    // carry a name but no record id. Resolve them in one pass for every order
    // about to be processed.
    const allNames = pending.flatMap((o) => o.items.filter((i) => !i.productId).map((i) => i.name))
    const resolved = await resolveProductIdsByName(allNames)

    for (const order of pending) {
      const withIds = order.items
        .map((i) => ({ ...i, productId: i.productId || resolved.get(i.name) || undefined }))
        .filter((i) => i.productId)

      const unresolved = order.items.filter(
        (i) => !i.productId && !resolved.get(i.name)
      )

      if (withIds.length === 0) {
        // Nothing could be matched. Do NOT mark as done - leaving the flag clear
        // means it retries once the product name is corrected, rather than
        // silently losing the deduction forever.
        processed.push({
          orderId: order.id,
          customer: order.customerName,
          items: 0,
          ok: false,
          errors: unresolved.map(
            (i) =>
              `Could not match "${i.name}" to a product - check the name still exists in the Products table and is unique`
          ),
        })
        continue
      }

      const results = await decrementStock(withIds)
      const failed = results.filter((r) => !r.ok)

      // Only tick the flag when every line resolved AND deducted, so a partial
      // failure retries next run instead of being silently lost.
      if (failed.length === 0 && unresolved.length === 0) {
        await markStockDeducted(order.id)
      }

      const errors = [
        ...failed.map((f) => `${f.productId}: ${f.error}`),
        ...unresolved.map((i) => `Could not match "${i.name}" to a product`),
      ]

      processed.push({
        orderId: order.id,
        customer: order.customerName,
        items: results.length,
        ok: failed.length === 0 && unresolved.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      })
    }

    return NextResponse.json({
      ok: true,
      checked: orders.length,
      awaitingDeduction: pending.length,
      processed,
    })
  } catch (err: any) {
    console.error("Stock sync failed:", err)
    return NextResponse.json({ error: err?.message || "Stock sync failed" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return run(request)
}

// Airtable automations send POST, so both verbs are accepted.
export async function POST(request: Request) {
  return run(request)
}
