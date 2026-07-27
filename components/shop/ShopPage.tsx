"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { Reveal } from "@/components/animations/Reveal"
import { Grid3X3, LayoutList } from "lucide-react"

export function ShopPage({ products }: { products: Product[] }) {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  )

  useEffect(() => {
    const category = searchParams.get("category")
    if (category && categories.includes(category)) {
      setSelectedCategory(category)
    }
    const search = searchParams.get("search")
    if (search) {
      setSearchQuery(search)
    }
    const sort = searchParams.get("sort")
    if (sort) {
      setSortBy(sort)
    }
  }, [searchParams, categories])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const filtered = useMemo(() => {
    let result = [...products]
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break
      case "price-high": result.sort((a, b) => b.price - a.price); break
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break
      case "bestseller": result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0)); break
    }

    return result
  }, [products, selectedCategory, sortBy, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory, sortBy, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-brand-500 mb-6">
        <Link href="/" className="hover:text-brand-900 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-brand-900">{selectedCategory === "All" ? "All Products" : selectedCategory}</span>
      </nav>

      <Reveal className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-900 mb-4">The Collection</h1>
        <p className="text-brand-500 max-w-xl mx-auto">
          Hand-picked imitation jewellery from makers across India, across our Heritage, Fusion, and Minimal collections
        </p>
      </Reveal>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-200">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm tracking-wide transition-colors duration-200 rounded-full ${
                selectedCategory === cat
                  ? "bg-brand-900 text-white"
                  : "bg-brand-100 text-brand-700 hover:bg-brand-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-sm text-brand-700 border-b border-brand-300 pb-1 focus:outline-none focus:border-brand-900"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="bestseller">Bestsellers</option>
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-brand-200" : "hover:bg-brand-100"}`}
            >
              <Grid3X3 className="w-4 h-4 text-brand-700" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-brand-200" : "hover:bg-brand-100"}`}
            >
              <LayoutList className="w-4 h-4 text-brand-700" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-brand-500 mb-6">
        {filtered.length} pieces
        {searchQuery.trim() && (
          <>
            {" "}for &quot;{searchQuery}&quot;
            <button
              onClick={() => setSearchQuery("")}
              className="ml-2 text-brand-900 underline hover:no-underline"
            >
              Clear
            </button>
          </>
        )}
      </p>

      {paginated.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-brand-500 text-lg mb-2">No pieces to show right now</p>
          <p className="text-brand-400 text-sm">
            Please check back shortly, or message us on WhatsApp and we&apos;ll help you directly.
          </p>
        </div>
      ) : (
        <div
          className={`grid gap-4 sm:gap-6 lg:gap-8 ${
            viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {paginated.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 text-sm text-brand-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-900"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .map((n, i, arr) => (
              <span key={n} className="flex items-center gap-2">
                {i > 0 && arr[i - 1] !== n - 1 && <span className="text-brand-300">...</span>}
                <button
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-full text-sm transition-colors ${
                    page === n ? "bg-brand-900 text-white" : "text-brand-700 hover:bg-brand-100"
                  }`}
                >
                  {n}
                </button>
              </span>
            ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 text-sm text-brand-700 disabled:opacity-30 disabled:cursor-not-allowed hover:text-brand-900"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
