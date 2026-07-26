import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protects the analytics dashboard with HTTP Basic Auth.
//
// IMPORTANT: this guards /admin, /api/analytics AND /api/debug-airtable.
// Guarding only the page would be theatre - the raw revenue, customer names and
// phone numbers are served by the API route, so anyone could just request that
// directly. The debug route is included because it exposes product data and can
// write a test row to Airtable.
//
// Set these in Vercel -> Settings -> Environment Variables:
//   ADMIN_USER      e.g. chinkara
//   ADMIN_PASSWORD  a long random string
//
// These are NOT prefixed with NEXT_PUBLIC_, so they stay server-side only and
// never reach the browser bundle.

export const config = {
  matcher: ["/admin/:path*", "/api/analytics/:path*", "/api/debug-airtable/:path*"],
}

function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      // Triggers the browser's native username/password prompt
      "WWW-Authenticate": 'Basic realm="Chinkara Admin", charset="UTF-8"',
    },
  })
}

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD

  // Fail closed. If the credentials aren't configured we deny access rather
  // than leaving the dashboard open - an unprotected dashboard is the exact
  // problem this file exists to prevent.
  if (!user || !password) {
    return new NextResponse(
      "Admin access is not configured. Set ADMIN_USER and ADMIN_PASSWORD in your environment variables, then redeploy.",
      { status: 503 }
    )
  }

  const header = request.headers.get("authorization")

  if (!header || !header.toLowerCase().startsWith("basic ")) {
    return unauthorized()
  }

  let decoded = ""
  try {
    decoded = atob(header.slice(6).trim())
  } catch {
    return unauthorized("Invalid credentials")
  }

  // Split on the FIRST colon only, so passwords containing ":" still work
  const separator = decoded.indexOf(":")
  if (separator === -1) return unauthorized("Invalid credentials")

  const givenUser = decoded.slice(0, separator)
  const givenPassword = decoded.slice(separator + 1)

  if (givenUser !== user || givenPassword !== password) {
    return unauthorized("Invalid credentials")
  }

  return NextResponse.next()
}
