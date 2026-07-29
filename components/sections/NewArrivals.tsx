import { getAllProducts } from "@/lib/data"
import { ProductCarousel } from "./ProductCarousel"

// Matches the /new-arrivals page and the NEW badge on cards: driven by the
// "New Arrival" checkbox in Airtable, not by creation date. If nothing is
// ticked, ProductCarousel renders nothing and the section simply doesn't appear.
export async function NewArrivals() {
  const products = await getAllProducts()
  const newest = products
    .filter((p) => p.newArrival)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <ProductCarousel title="New Arrivals" products={newest.slice(0, 10)} viewAllHref="/new-arrivals" />
  )
}
