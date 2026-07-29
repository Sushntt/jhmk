import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/data"
import { buildCategories } from "@/lib/categories"

export const dynamic = "force-dynamic"

// The navbar is a client component, so it can't read Airtable directly.
// This gives it the same category list the homepage builds.
export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json({ categories: buildCategories(products) })
  } catch (err) {
    console.error("Failed to build categories:", err)
    return NextResponse.json({ categories: [] })
  }
}
