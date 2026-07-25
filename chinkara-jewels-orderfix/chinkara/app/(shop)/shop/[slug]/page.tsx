import { ProductDetail } from "@/components/shop/ProductDetail"
import { getAllProducts, getProductBySlug } from "@/lib/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const allProducts = await getAllProducts()
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return <ProductDetail product={product} related={related} />
}
