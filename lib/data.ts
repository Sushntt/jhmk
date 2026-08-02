import { cache } from "react"
import { Product } from "@/types"
import { isAirtableConfigured, getProducts as getAirtableProducts } from "@/lib/airtable"
import { mockProducts } from "@/lib/mock-data"

// In production we never fall back to demo products. Showing 12 fake pieces
// with stock photos would let a real customer order something that doesn't
// exist - an empty shop is recoverable, a fraudulent order is not.
// The demo fallback stays available in development so the UI is still workable
// before Airtable is wired up.
const allowDemoFallback = process.env.NODE_ENV !== "production"

/**
 * Loads every product, de-duplicated per request.
 *
 * The homepage renders Categories, New Arrivals and Best Sellers, and each one
 * needs the full product list. Without this, that was three or four separate
 * Airtable round-trips per page view - all sequential, all before anything
 * rendered, which is what made the site feel slow.
 *
 * React's cache() memoises for the lifetime of a single request, so those calls
 * collapse into one. It does NOT cache across visitors, so stock levels stay
 * live - important, since the client relies on stock being accurate.
 */
export const getAllProducts = cache(async function getAllProducts(): Promise<Product[]> {
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
})

export const getProductBySlug = cache(async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug) || null
})
