import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").trim().toLowerCase()

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  const products = await getAllProducts()

  const results = products
    .filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.material || "").toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      category: p.category,
      image: p.images[0],
    }))

  return NextResponse.json({ results })
}
