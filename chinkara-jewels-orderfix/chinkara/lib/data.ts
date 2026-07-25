import { Product } from "@/types"
import { isAirtableConfigured, getProducts as getAirtableProducts } from "@/lib/airtable"
import { mockProducts } from "@/lib/mock-data"

// In production we never fall back to demo products. Showing 12 fake pieces
// with stock photos would let a real customer order something that doesn't
// exist - an empty shop is recoverable, a fraudulent order is not.
// The demo fallback stays available in development so the UI is still workable
// before Airtable is wired up.
const allowDemoFallback = process.env.NODE_ENV !== "production"

export async function getAllProducts(): Promise<Product[]> {
  if (!isAirtableConfigured) {
    if (allowDemoFallback) return mockProducts
    console.error("Airtable is not configured in production - returning no products.")
    return []
  }

  try {
    const products = await getAirtableProducts()
    if (products.length > 0) return products

    // Table reachable but empty
    return allowDemoFallback ? mockProducts : []
  } catch (err) {
    console.error("Failed to load live products from Airtable:", err)
    return allowDemoFallback ? mockProducts : []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) || null
}
