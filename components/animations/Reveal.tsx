"use client"

import { ReactNode, useEffect, useRef } from "react"

/**
 * Scroll reveal, built on one shared IntersectionObserver and CSS transitions.
 *
 * This used to be a Framer Motion component. With 62 of them on the site, that
 * meant 62 animated React components and 62 separate observers - a large part of
 * why the home and shop pages felt heavy. CSS transitions run on the compositor
 * and cost nothing in JavaScript.
 *
 * Once an element has been revealed it is unobserved and the class stays put, so
 * scrolling back up can never replay the animation.
 */

type Direction = "up" | "down" | "left" | "right" | "none"

// One observer for the whole page rather than one per element.
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("reveal-visible")
          // Reveal once, then stop watching - no replay on scroll up.
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    )
  }
  return observer
}

function useReveal(delay: number) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (delay) el.style.transitionDelay = `${delay}s`

    const io = getObserver()
    if (!io) {
      // No observer support: show immediately rather than leaving it invisible.
      el.classList.add("reveal-visible")
      return
    }

    io.observe(el)
    return () => io.unobserve(el)
  }, [delay])

  return ref
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** Kept for compatibility with existing call sites */
  duration?: number
  direction?: Direction
  distance?: number
  once?: boolean
  amount?: number
}) {
  const ref = useReveal(delay)
  return (
    <div ref={ref} className={`reveal reveal-${direction} ${className}`}>
      {children}
    </div>
  )
}

/** Children fade in one after another as the container scrolls into view. */
export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
}) {
  const ref = useReveal(0)
  return (
    <div ref={ref} className={`reveal-stagger ${className}`}>
      {children}
    </div>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  distance?: number
}) {
  return <div className={className}>{children}</div>
}
