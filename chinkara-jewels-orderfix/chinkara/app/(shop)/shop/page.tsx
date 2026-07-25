import { Suspense } from "react"
import { ShopPage } from "@/components/shop/ShopPage"
import { getAllProducts } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function Shop() {
  const products = await getAllProducts()
  return (
    <Suspense fallback={null}>
      <ShopPage products={products} />
    </Suspense>
  )
}
