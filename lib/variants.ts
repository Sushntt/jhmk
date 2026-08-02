import { Product } from "@/types"

export interface ProductGroup {
  /** The variant shown by default - first in stock, else the first row */
  primary: Product
  /** Every row sharing this name, including the primary */
  variants: Product[]
  /** True when any variant has stock */
  inStock: boolean
  /** Combined stock across colours, used for the grid card */
  totalStock: number
}

/** Rows are the same product when their names match, ignoring case and spacing. */
function nameKey(p: Product): string {
  return p.name.trim().toLowerCase().replace(/\s+/g, " ")
}

/**
 * Collapses colour variants into one product each.
 *
 * Airtable holds one row per colour so that stock, price and photos can differ.
 * The shop grid should still show a single card, and the product page a single
 * page with colour buttons - that grouping happens here.
 *
 * Order is preserved: a group appears where its first row appeared, so any
 * sorting applied before grouping still holds.
 */
export function groupVariants(products: Product[]): ProductGroup[] {
  const groups = new Map<string, Product[]>()

  for (const p of products) {
    const key = nameKey(p)
    groups.set(key, [...(groups.get(key) || []), p])
  }

  return Array.from(groups.values()).map((variants) => {
    // Default to a colour the customer can actually buy
    const primary = variants.find((v) => v.inStock) || variants[0]
    return {
      primary,
      variants,
      inStock: variants.some((v) => v.inStock),
      totalStock: variants.reduce((sum, v) => sum + (v.stockCount || 0), 0),
    }
  })
}

/**
 * The grid needs a single Product per card. This returns the primary variant
 * with stock reflecting the whole group, so a piece with one colour sold out
 * still reads as available.
 */
export function toCardProducts(products: Product[]): Product[] {
  return groupVariants(products).map((g) => ({
    ...g.primary,
    inStock: g.inStock,
    stockCount: g.totalStock,
  }))
}

/** All rows sharing a name with the given product, for the product page. */
export function variantsOf(product: Product, all: Product[]): Product[] {
  const key = nameKey(product)
  const matches = all.filter((p) => nameKey(p) === key)
  return matches.length > 0 ? matches : [product]
}
