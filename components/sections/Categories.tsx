import { getAllProducts } from "@/lib/data"
import { buildCategories } from "@/lib/categories"
import { CategoriesGrid } from "./CategoriesGrid"

export async function Categories() {
  const products = await getAllProducts()
  return <CategoriesGrid categories={buildCategories(products)} />
}
