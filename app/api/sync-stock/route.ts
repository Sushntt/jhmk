import { NextResponse } from "next/server"
import { syncStock } from "@/lib/sync-stock"

export const dynamic = "force-dynamic"

/**
 * Public stock-sync endpoint, for an external scheduler.
 *
 * Protected by SYNC_SECRET so it can't be triggered by anyone who finds the URL:
 *   /api/sync-stock?secret=...     or     Authorization: Bearer <secret>
 *
 * The admin dashboard has its own button that calls the same logic without
 * needing the secret, since it already sits behind the admin password.
 */
function authorised(request: Request): boolean {
  const secret = process.env.SYNC_SECRET
  // Fail closed: with no secret configured, refuse rather than run openly.
  if (!secret) return false

  const { searchParams } = new URL(request.url)
  if (searchParams.get("secret") === secret) return true

  return (request.headers.get("authorization") || "") === `Bearer ${secret}`
}

async function run(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json(
      { error: "Unauthorised. Set SYNC_SECRET and pass ?secret= or an Authorization header." },
      { status: 401 }
    )
  }

  const result = await syncStock()
  return NextResponse.json(result, { status: result.ok ? 200 : 503 })
}

export async function GET(request: Request) {
  return run(request)
}

// Schedulers commonly POST, so both verbs are accepted.
export async function POST(request: Request) {
  return run(request)
}
