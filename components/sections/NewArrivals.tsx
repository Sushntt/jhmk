import { getAllProducts } from "@/lib/data"
import { ProductCarousel } from "./ProductCarousel"

export async function NewArrivals() {
  const products = await getAllProducts()
  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return <ProductCarousel title="New Arrivals" products={sorted.slice(0, 10)} viewAllHref="/shop?sort=newest" />
}
