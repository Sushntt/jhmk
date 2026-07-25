"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types"
import { ProductCard } from "./ProductCard"
import { Reveal } from "@/components/animations/Reveal"

const STORAGE_KEY = "chinkara-recently-viewed"
const MAX_ITEMS = 8

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let ids: string[] = []
    try {
      ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    } catch {
      ids = []
    }

    // Record the current product at the front, deduped, capped
    const updated = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    const toShow = updated.filter((id) => id !== currentProductId)
    if (toShow.length === 0) return

    fetch(`/api/products/by-ids?ids=${toShow.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
  }, [currentProductId])

  if (products.length === 0) return null

  return (
    <div className="mt-20">
      <Reveal className="text-center mb-12">
        <h2 className="text-2xl font-serif text-brand-900">Recently Viewed</h2>
      </Reveal>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
        {products.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[200px] sm:w-[240px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
