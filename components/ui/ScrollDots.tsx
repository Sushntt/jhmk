"use client"

import { useEffect, useState, RefObject } from "react"

/**
 * Page dots for a horizontally scrolling row.
 *
 * Reads scroll position rather than tracking clicks, so the dots stay correct
 * when the row is swiped, arrow-scrolled, or keyboard-navigated. The listener
 * is passive and only sets state when the active page actually changes, so it
 * doesn't re-render on every scroll frame.
 */
export function ScrollDots({
  scrollRef,
  className = "",
}: {
  scrollRef: RefObject<HTMLDivElement>
  className?: string
}) {
  const [pages, setPages] = useState(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const measure = () => {
      const total = el.scrollWidth
      const visible = el.clientWidth
      if (visible === 0) return
      setPages(Math.max(1, Math.ceil(total / visible)))
      setActive(Math.round(el.scrollLeft / visible))
    }

    measure()
    el.addEventListener("scroll", measure, { passive: true })

    const ro = new ResizeObserver(measure)
    ro.observe(el)

    return () => {
      el.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [scrollRef])

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }

  // A single page means nothing to page between
  if (pages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 mt-6 ${className}`}>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === active}
          className="p-2 -m-1 group"
        >
          {/* scale + colour rather than animating width: width is a layout
              property and forces reflow, transforms composite on the GPU. */}
          <span
            className={`block w-1.5 h-1.5 rounded-full origin-center transition-[transform,background-color] duration-200 ease-out ${
              i === active
                ? "scale-x-[3] bg-brand-900"
                : "bg-brand-300 group-hover:bg-brand-500"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
