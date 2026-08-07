"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { CartItem, Product } from "@/types"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number, colour?: string) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("chinkara-cart")
    let restored: CartItem[] = []

    if (saved) {
      try {
        restored = JSON.parse(saved)
        setItems(restored)
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    setIsLoaded(true)

    /**
     * Refresh saved items against the live catalogue.
     *
     * Airtable attachment URLs expire after a couple of hours, so a cart
     * restored the next day had dead image links and showed blank thumbnails.
     * Re-fetching also picks up any price or stock change since the item was
     * added, so nobody checks out against a stale price.
     *
     * Anything no longer in the catalogue is dropped from the cart.
     */
    if (restored.length === 0) return

    const ids = Array.from(new Set(restored.map((i) => i.product.id))).join(",")

    let cancelled = false

    fetch(`/api/products/by-ids?ids=${encodeURIComponent(ids)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const fresh = new Map<string, Product>(
          (data.products || []).map((p: Product) => [p.id, p])
        )
        // Functional update so anything added while this was in flight is kept
        setItems((prev) =>
          prev
            .filter((i) => fresh.has(i.product.id))
            .map((i) => ({ ...i, product: fresh.get(i.product.id)! }))
        )
      })
      .catch((e) => console.error("Could not refresh cart items:", e))

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem("chinkara-cart", JSON.stringify(items))
    } catch (e) {
      // Private browsing and full storage both throw here. Losing the saved
      // cart is recoverable; an uncaught error would blank the whole page.
      console.error("Could not save cart", e)
    }
  }, [items, isLoaded])

  const addToCart = useCallback((product: Product, quantity = 1, colour?: string) => {
    setItems((prev) => {
      // Same piece in a different colour is a separate line item
      const existing = prev.find((item) => item.product.id === product.id && item.colour === colour)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockCount)
        return prev.map((item) =>
          item.product.id === product.id && item.colour === colour
            ? { ...item, quantity: newQty }
            : item
        )
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockCount), colour }]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stockCount) }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
