import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean)

  if (ids.length === 0) {
    return NextResponse.json({ products: [] })
  }

  const products = await getAllProducts()
  const byId = new Map(products.map((p) => [p.id, p]))
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean)

  return NextResponse.json({ products: ordered })
}
