import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET() {
  const products = await getAllProducts()
  const inStock = products.filter((p) => p.inStock)

  // Prefer genuine discounts (Original Price set above the current price in
  // Airtable), then top up with bestsellers / any in-stock piece so the
  // "Deals of the Day" strip is never empty.
  const discounted = inStock.filter((p) => p.originalPrice && p.originalPrice > p.price)
  const bestsellers = inStock.filter((p) => p.bestseller && !discounted.includes(p))
  const rest = inStock.filter((p) => !discounted.includes(p) && !bestsellers.includes(p))

  const deals = [...discounted, ...bestsellers, ...rest].slice(0, 6)

  return NextResponse.json({ deals })
}
