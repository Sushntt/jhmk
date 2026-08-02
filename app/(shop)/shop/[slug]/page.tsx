import { ProductDetail } from "@/components/shop/ProductDetail"
import { getAllProducts, getProductBySlug } from "@/lib/data"
import { variantsOf, toCardProducts } from "@/lib/variants"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const allProducts = await getAllProducts()

  // Every row sharing this name is a colour of the same piece
  const variants = variantsOf(product, allProducts)
  const variantIds = new Set(variants.map((v) => v.id))

  // Related products are grouped too, so a piece in three colours doesn't
  // appear three times in the row.
  const related = toCardProducts(
    allProducts.filter((p) => p.category === product.category && !variantIds.has(p.id))
  ).slice(0, 8)

  return <ProductDetail product={product} variants={variants} related={related} />
}
