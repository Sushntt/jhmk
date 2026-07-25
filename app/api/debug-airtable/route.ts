import { NextResponse } from "next/server"
import {
  isAirtableConfigured,
  getProducts,
  getOrders,
  decrementStock,
  createTestOrderRecord,
} from "@/lib/airtable"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testProductId = searchParams.get("testDecrementProductId")

  const result: any = {
    airtableApiKeySet: Boolean(process.env.AIRTABLE_API_KEY),
    airtableBaseIdSet: Boolean(process.env.AIRTABLE_BASE_ID),
    isAirtableConfigured,
  }

  if (!isAirtableConfigured) {
    return NextResponse.json({
      ...result,
      note: "Env vars are missing at runtime. Double-check they're added in Vercel → Settings → Environment Variables, scoped to 'Production', then redeploy.",
    })
  }

  try {
    const products = await getProducts()
    result.productsOk = true
    result.productsCount = products.length
    result.sampleProductNames = products.slice(0, 3).map((p) => p.name)
    result.sampleProductIds = products.slice(0, 3).map((p) => ({ id: p.id, stockCount: p.stockCount }))
  } catch (err: any) {
    result.productsOk = false
    result.productsError = err.message
  }

  try {
    const orders = await getOrders()
    result.ordersOk = true
    result.ordersCount = orders.length
  } catch (err: any) {
    result.ordersOk = false
    result.ordersError = err.message
  }

  // Optional: pass ?testDecrementProductId=<Airtable record id> to test the
  // exact stock-deduction path against a real record (deducts 0, so it's safe
  // to run repeatedly - it only proves whether the read+write round trip works).
  if (testProductId) {
    result.stockDeductionTest = await decrementStock([{ productId: testProductId, quantity: 0 }])
  }

  // Optional: ?testOrderWrite=1 attempts a real write to the Orders table using
  // the exact same field names checkout uses, then deletes the row again.
  // This surfaces "Unknown field name" / type errors that are otherwise only
  // visible in server logs.
  if (searchParams.get("testOrderWrite") === "1") {
    try {
      const created = await createTestOrderRecord()
      result.orderWriteOk = true
      result.orderWriteNote = "Test row written and deleted successfully. Orders table is correctly configured."
      result.testRecordId = created
    } catch (err: any) {
      result.orderWriteOk = false
      result.orderWriteError = err?.message || String(err)
      result.orderWriteHint =
        "Check that the table is named exactly 'Orders' and has these fields with these exact names: Customer Name, Email, Phone, Address, Items, Total (Number), Status (single select containing 'pending'), Created At (single line text)."
    }
  }

  return NextResponse.json(result)
}
