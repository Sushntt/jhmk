"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { Product } from "@/types"
import { useAuth } from "@/hooks/useAuth"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Signed-out visitors get a shared guest wishlist; signed-in customers get one
// keyed to their Firebase UID, so two people on the same device (or the same
// person on two accounts) never see each other's saved pieces.
const GUEST_KEY = "chinkara-wishlist-guest"
const keyFor = (uid?: string) => (uid ? `chinkara-wishlist-${uid}` : GUEST_KEY)

function read(key: string): Product[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error("Failed to read wishlist", e)
    return []
  }
}

function write(key: string, items: Product[]) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch (e) {
    console.error("Failed to save wishlist", e)
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const activeKey = useRef<string>(GUEST_KEY)

  // Load (and re-load whenever the signed-in user changes)
  useEffect(() => {
    if (authLoading) return

    const key = keyFor(user?.id)
    const stored = read(key)

    if (user) {
      // Anything saved while signed out is merged into the account once, so a
      // customer who browsed first and signed in later doesn't lose their picks.
      const guest = read(GUEST_KEY)
      if (guest.length > 0) {
        const merged = [...stored]
        for (const g of guest) {
          if (!merged.some((i) => i.id === g.id)) merged.push(g)
        }
        write(key, merged)
        localStorage.removeItem(GUEST_KEY)
        activeKey.current = key
        setItems(merged)
        setIsLoaded(true)
        return
      }
    }

    activeKey.current = key
    setItems(stored)
    setIsLoaded(true)
    refresh(stored)
  }, [user, authLoading])

  /**
   * Same expiry problem as the cart: Airtable image URLs go stale after a
   * couple of hours, so saved pieces showed blank thumbnails on a later visit.
   */
  function refresh(saved: Product[]) {
    if (saved.length === 0) return
    const ids = Array.from(new Set(saved.map((p) => p.id))).join(",")

    fetch(`/api/products/by-ids?ids=${encodeURIComponent(ids)}`)
      .then((res) => res.json())
      .then((data) => {
        const fresh = new Map<string, Product>(
          (data.products || []).map((p: Product) => [p.id, p])
        )
        setItems((prev) => prev.filter((p) => fresh.has(p.id)).map((p) => fresh.get(p.id)!))
      })
      .catch((e) => console.error("Could not refresh wishlist items:", e))
  }

  // Persist
  useEffect(() => {
    if (!isLoaded) return
    write(activeKey.current, items)
  }, [items, isLoaded])

  const addToWishlist = useCallback((product: Product) => {
    setItems((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]))
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  )

  const toggleWishlist = useCallback(
    (product: Product) => {
      if (isInWishlist(product.id)) removeFromWishlist(product.id)
      else addToWishlist(product)
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  )

  return (
    <WishlistContext.Provider
      value={{ items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, isOpen, setIsOpen }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error("useWishlist must be used within WishlistProvider")
  return context
}
