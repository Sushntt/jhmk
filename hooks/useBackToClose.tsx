"use client"

import { useCallback, useEffect, useRef } from "react"

/**
 * Makes the phone's Back gesture close an overlay rather than leave the page.
 *
 * Opening a drawer doesn't change the URL, so the browser has no idea anything
 * opened - a back swipe would navigate away from the shop entirely. This pushes
 * a throwaway history entry when the overlay opens so Back pops that instead.
 *
 * Returns `closeForNavigation`, which MUST be used whenever closing the overlay
 * is followed by navigating somewhere (a product link, Proceed to Checkout).
 * Closing normally consumes the pushed entry with history.back(); if that runs
 * while a navigation is also in flight, the two fight and the navigation is
 * cancelled - which silently broke both the cart links and checkout.
 */
export function useBackToClose(isOpen: boolean, close: () => void) {
  // Is the entry we pushed still on the stack?
  const pushedRef = useRef(false)
  // Set while WE are the ones calling history.back(), to avoid re-entrancy
  const closingRef = useRef(false)
  // Set when the overlay is closing because the app is navigating away
  const navigatingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isOpen && !pushedRef.current) {
      window.history.pushState({ overlay: true }, "")
      pushedRef.current = true

      const onPop = () => {
        // User pressed Back: our entry is already gone
        pushedRef.current = false
        closingRef.current = true
        close()
        closingRef.current = false
      }

      window.addEventListener("popstate", onPop)
      return () => window.removeEventListener("popstate", onPop)
    }
  }, [isOpen, close])

  useEffect(() => {
    if (isOpen) {
      // Reset for the next open
      navigatingRef.current = false
      return
    }

    if (!pushedRef.current) return
    pushedRef.current = false

    // Closed by Back, or closed in order to navigate - in both cases calling
    // history.back() here would be wrong.
    if (closingRef.current || navigatingRef.current) return

    // Plain close by button or backdrop: consume the entry we added so the
    // history stack stays clean.
    window.history.back()
  }, [isOpen])

  /** Close the overlay without touching history, because a navigation follows. */
  const closeForNavigation = useCallback(() => {
    navigatingRef.current = true
    close()
  }, [close])

  return { closeForNavigation }
}
