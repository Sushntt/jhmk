import { NextResponse } from "next/server"
import { createOrder } from "@/lib/airtable"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, email, phone, address, items, total } = body

    if (!customerName || !phone || !Array.isArray(items) || typeof total !== "number") {
      return NextResponse.json({ error: "Missing or invalid order fields" }, { status: 400 })
    }

    const result = await createOrder({ customerName, email, phone, address, items, total })
    return NextResponse.json({
      ok: true,
      logged: result !== null && result.order !== null,
      orderError: result?.orderError || null,
      stockResults: result?.stockResults || [],
    })
  } catch (err) {
    console.error("Failed to log order:", err)
    // Don't block checkout if logging fails - the WhatsApp message is still the source of truth
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
