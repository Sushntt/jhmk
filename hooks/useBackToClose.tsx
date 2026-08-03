"use client"

import { useEffect, useRef } from "react"

/**
 * Makes the phone's Back gesture close an overlay rather than leave the page.
 *
 * Opening a drawer or modal doesn't change the URL, so the browser has no idea
 * anything opened - a back swipe navigates away from the shop entirely, which
 * loses the customer's place. This pushes a throwaway history entry when the
 * overlay opens, so Back pops that entry and we close the overlay instead.
 *
 * Closing by button calls history.back() to consume the entry, so the history
 * stack never accumulates junk and Back doesn't need pressing twice.
 */
export function useBackToClose(isOpen: boolean, close: () => void) {
  // Tracks whether the entry we pushed is still on the stack
  const pushedRef = useRef(false)
  // Avoids re-entrancy when we call history.back() ourselves
  const closingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isOpen && !pushedRef.current) {
      window.history.pushState({ overlay: true }, "")
      pushedRef.current = true

      const onPop = () => {
        // The user pressed Back: our entry is already gone
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
    // Closed by button or backdrop - remove the entry we added so the stack
    // stays clean and the next Back press goes where the user expects.
    if (!isOpen && pushedRef.current && !closingRef.current) {
      pushedRef.current = false
      window.history.back()
    }
  }, [isOpen])
}
