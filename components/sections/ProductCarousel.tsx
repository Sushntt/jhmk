"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Product } from "@/types"
import { ProductCard } from "@/components/shop/ProductCard"
import { Reveal } from "@/components/animations/Reveal"
import Link from "next/link"

export function ProductCarousel({
  title,
  products,
  viewAllHref,
}: {
  title: string
  products: Product[]
  viewAllHref?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-brand-900">{title}</h2>
        <div className="flex items-center gap-3">
          {viewAllHref && (
            <Link href={viewAllHref} className="text-sm text-brand-600 hover:text-brand-900 tracking-wide">
              View all &gt;
            </Link>
          )}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="p-2 rounded-full border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-brand-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="p-2 rounded-full border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-brand-700" />
            </button>
          </div>
        </div>
      </Reveal>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start flex-shrink-0 w-[220px] sm:w-[260px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
