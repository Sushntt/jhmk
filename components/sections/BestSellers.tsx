import { getAllProducts } from "@/lib/data"
import { ProductCarousel } from "./ProductCarousel"
import { toCardProducts } from "@/lib/variants"

// Driven strictly by the "Bestseller" checkbox in Airtable. It previously fell
// back to showing every product when nothing was ticked, which made the section
// title untrue and meant ticking the box changed nothing.
export async function BestSellers() {
  const products = await getAllProducts()
  const bestsellers = toCardProducts(products.filter((p) => p.bestseller))

  return (
    <ProductCarousel
      title="Best Sellers"
      products={bestsellers.slice(0, 10)}
      viewAllHref="/shop?filter=bestseller"
    />
  )
}
