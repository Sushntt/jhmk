import { getAllProducts } from "@/lib/data"
import { homeCategories } from "@/lib/site-config"
import { CategoriesGrid, CategoryTile } from "./CategoriesGrid"

// Tiles take their image from the first product in that category, so the grid
// fills itself in as the client adds stock in Airtable. Categories with no
// products yet still appear, using the emblem as a placeholder rather than a
// stock photo of jewellery Chinkara doesn't sell.
export async function Categories() {
  const products = await getAllProducts()

  const tiles: CategoryTile[] = homeCategories.map((cat) => {
    const matches = products.filter((p) =>
      cat.match.includes((p.category || "").trim().toLowerCase())
    )
    const withImage = matches.find((p) => p.images?.[0])

    return {
      name: cat.name,
      href: `/shop?category=${encodeURIComponent(matches[0]?.category || cat.name)}`,
      image: withImage?.images[0] || cat.fallback || null,
      count: matches.length,
    }
  })

  return <CategoriesGrid categories={tiles} />
}
