import { Product } from "@/types"

export interface CategoryTile {
  name: string
  href: string
  image: string | null
  count: number
}

/**
 * Builds the category list straight from the products in Airtable.
 *
 * Nothing is hardcoded: add a new Category option in Airtable, put a product in
 * it, and the tile appears on the homepage and in the menu automatically, using
 * that product's photo. Remove the last product and the tile disappears.
 */
export function buildCategories(products: Product[]): CategoryTile[] {
  const map = new Map<string, { name: string; image: string | null; count: number }>()

  for (const p of products) {
    const raw = (p.category || "").trim()
    if (!raw) continue

    const key = raw.toLowerCase()
    const existing = map.get(key)

    if (existing) {
      existing.count += 1
      // Take the first available photo, so a tile still gets an image even if
      // the newest product in that category has none yet.
      if (!existing.image && p.images?.[0]) existing.image = p.images[0]
    } else {
      map.set(key, { name: raw, image: p.images?.[0] || null, count: 1 })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      name: c.name,
      href: `/shop?category=${encodeURIComponent(c.name)}`,
      image: c.image,
      count: c.count,
    }))
}
