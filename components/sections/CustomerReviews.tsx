"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import { Reveal } from "@/components/animations/Reveal"
import { ScrollDots } from "@/components/ui/ScrollDots"
import { siteConfig } from "@/lib/site-config"
import { Instagram } from "lucide-react"

// Real customer messages, supplied by Chinkara.
//
// Each screenshot has had the WhatsApp header cropped off, so no contact name
// or profile photo is published - customers agreed to their words being shared,
// not their identity, and Chinkara's own privacy policy commits to not passing
// on customer details.
const reviewScreenshots: string[] = [
  "/images/reviews/review-7.jpg",
  "/images/reviews/review-6.jpg",
  "/images/reviews/review-1.jpg",
  "/images/reviews/review-4.jpg",
  "/images/reviews/review-3.jpg",
  "/images/reviews/review-2.jpg",
  "/images/reviews/review-5.jpg",
]

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
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-brand-900">What Customers Are Saying</h2>
          <p className="text-sm text-brand-500 mt-1">Real messages from Chinkara customers</p>
        </div>
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
            <div
              key={i}
              // Fixed height with object-contain: the screenshots have very
              // different aspect ratios, and object-cover would crop the shorter
              // ones past the point of being readable.
              className="snap-start flex-shrink-0 w-[220px] sm:w-[250px] h-[380px] sm:h-[420px] rounded-lg overflow-hidden border border-brand-200 bg-brand-950 grid place-items-center"
            >
              <Image
                src={src}
                alt={`Customer message ${i + 1}`}
                width={250}
                height={420}
                sizes="250px"
                className="w-full h-full object-contain"
              />
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

      {reviewScreenshots.length > 0 && (
        <>
          <ScrollDots scrollRef={scrollRef} />

          <div className="flex justify-center mt-8">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 bg-brand-900 text-white text-sm tracking-wide rounded-full transition-colors duration-200 ease-out hover:bg-gold-600"
            >
              Visit our Instagram
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </>
      )}
    </section>
  )
}
