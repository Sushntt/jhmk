import { NextResponse } from "next/server"
import { getOrders, isAirtableConfigured } from "@/lib/airtable"

export const dynamic = "force-dynamic"

// Returns only the orders belonging to the requesting customer.
// Matched primarily on email (stable, comes from Google sign-in); phone is a
// fallback so orders placed before the Email column existed still show up.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = (searchParams.get("email") || "").trim().toLowerCase()
  const phone = (searchParams.get("phone") || "").replace(/\D/g, "")

  if (!email && !phone) {
    return NextResponse.json({ orders: [] })
  }

  if (!isAirtableConfigured) {
    return NextResponse.json({ orders: [], note: "Airtable not configured" })
  }

  try {
    const all = await getOrders()

    const mine = all.filter((o) => {
      const orderEmail = (o.email || "").trim().toLowerCase()
      if (email && orderEmail && orderEmail === email) return true

      // Compare only the last 10 digits so +91 / 0 prefixes and spacing
      // don't cause false misses.
      const orderPhone = (o.phone || "").replace(/\D/g, "")
      if (phone && orderPhone && orderPhone.slice(-10) === phone.slice(-10)) return true

      return false
    })

    mine.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ orders: mine })
  } catch (err: any) {
    console.error("Failed to load customer orders:", err)
    return NextResponse.json({ orders: [], error: err?.message || "Failed to load orders" }, { status: 200 })
  }
}
