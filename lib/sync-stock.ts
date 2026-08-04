import {
  isAirtableConfigured,
  getOrders,
  decrementStock,
  markStockDeducted,
  resolveProductIdsByName,
} from "@/lib/airtable"

const CONFIRMED_STATUSES = ["confirmed", "shipped", "delivered"]

export interface SyncResult {
  ok: boolean
  checked: number
  awaitingDeduction: number
  processed: {
    orderId: string
    customer: string
    items: number
    ok: boolean
    errors?: string[]
  }[]
  error?: string
}

/**
 * Deducts stock for orders whose Status is confirmed and that have not been
 * deducted yet.
 *
 * Lives here rather than inside a route so it can be triggered two ways: the
 * public /api/sync-stock endpoint (secret-protected, for an external scheduler)
 * and the admin dashboard button (already behind the admin password). Sharing
 * one implementation means the two can never drift apart.
 */
export async function syncStock(): Promise<SyncResult> {
  const empty = { checked: 0, awaitingDeduction: 0, processed: [] }

  if (!isAirtableConfigured) {
    return { ok: false, ...empty, error: "Airtable is not configured" }
  }

  try {
    const orders = await getOrders()

    const pending = orders.filter(
      (o) =>
        CONFIRMED_STATUSES.includes((o.status || "").trim().toLowerCase()) &&
        !o.stockDeducted
    )

    const processed: SyncResult["processed"] = []

    // Items are stored as readable text, so lines carry a name but no record id.
    // Resolve them all in one pass.
    const allNames = pending.flatMap((o) =>
      o.items.filter((i) => !i.productId).map((i) => i.name)
    )
    const resolved = await resolveProductIdsByName(allNames)

    for (const order of pending) {
      const withIds = order.items
        .map((i) => ({ ...i, productId: i.productId || resolved.get(i.name) || undefined }))
        .filter((i) => i.productId)

      const unresolved = order.items.filter((i) => !i.productId && !resolved.get(i.name))

      if (withIds.length === 0) {
        // Nothing matched. Deliberately NOT marked as done, so it retries once
        // the product name is corrected rather than being lost silently.
        processed.push({
          orderId: order.id,
          customer: order.customerName,
          items: 0,
          ok: false,
          errors: unresolved.map(
            (i) =>
              `Could not match "${i.name}" to a product - check the name still exists in Products and is unique`
          ),
        })
        continue
      }

      const results = await decrementStock(withIds)
      const failed = results.filter((r) => !r.ok)

      // Only mark done when every line resolved AND deducted, so a partial
      // failure retries next run instead of being lost.
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

    return {
      ok: true,
      checked: orders.length,
      awaitingDeduction: pending.length,
      processed,
    }
  } catch (err: any) {
    console.error("Stock sync failed:", err)
    return { ok: false, ...empty, error: err?.message || "Stock sync failed" }
  }
}
