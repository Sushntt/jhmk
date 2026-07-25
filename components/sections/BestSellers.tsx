import { getAllProducts } from "@/lib/data"
import { ProductCarousel } from "./ProductCarousel"

export async function BestSellers() {
  const products = await getAllProducts()
  const bestsellers = products.filter((p) => p.bestseller)
  const list = (bestsellers.length > 0 ? bestsellers : products).slice(0, 10)
  return <ProductCarousel title="Best Sellers" products={list} viewAllHref="/shop?sort=bestseller" />
}
