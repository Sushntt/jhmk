"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Reveal } from "@/components/animations/Reveal"

// Drop real customer DM/review screenshot image paths here once available,
// e.g. "/images/reviews/review-1.jpg". Until then this shows a friendly placeholder.
const reviewScreenshots: string[] = []

export function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-brand-900">What Customers Are Saying</h2>
        {reviewScreenshots.length > 0 && (
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-brand-700" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-brand-200 hover:bg-brand-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-brand-700" />
            </button>
          </div>
        )}
      </Reveal>

      {reviewScreenshots.length > 0 ? (
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
          {reviewScreenshots.map((src, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[240px] rounded-lg overflow-hidden border border-brand-200">
              <img src={src} alt={`Customer review ${i + 1}`} className="w-full h-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-brand-200 rounded-lg">
          <MessageCircle className="w-8 h-8 text-brand-300 mx-auto mb-3" />
          <p className="text-brand-500 text-sm">
            Customer DM screenshots go here — send over a few and we&apos;ll drop them right in.
          </p>
        </div>
      )}
    </section>
  )
}
