import { NextResponse } from "next/server"
import { syncStock } from "@/lib/sync-stock"

export const dynamic = "force-dynamic"

/**
 * Stock sync triggered from the admin dashboard.
 *
 * No secret in the query string: this path is covered by the Basic Auth
 * middleware, so the browser has already authenticated. That keeps SYNC_SECRET
 * out of any client-side code.
 */
export async function POST() {
  const result = await syncStock()
  return NextResponse.json(result, { status: result.ok ? 200 : 503 })
}
