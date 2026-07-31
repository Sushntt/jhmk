"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Product } from "@/types"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, addToCart } = useCart()
  const router = useRouter()
  const [deals, setDeals] = useState<Product[]>([])

  useEffect(() => {
    if (isOpen) {
      fetch("/api/deals")
        .then((res) => res.json())
        .then((data) => setDeals(data.deals || []))
        .catch(() => setDeals([]))
    }
  }, [isOpen])

  // Don't advertise something already in the bag
  const visibleDeals = deals.filter((d) => !items.some((i) => i.product.id === d.id))

  const handleProceedToCheckout = () => {
    setIsOpen(false)
    router.push("/checkout")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-100 flex-shrink-0">
              <h2 className="text-xl font-serif tracking-wide text-brand-900">
                Shopping Bag ({items.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-700" />
              </button>
            </div>

            {/* Items - scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-brand-300 mb-4" />
                  <p className="text-brand-500 text-lg mb-2">Your bag is empty</p>
                  <p className="text-brand-400 text-sm mb-6">
                    Discover our handcrafted collection
                  </p>
                  <Button onClick={() => setIsOpen(false)} variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      {/* The thumbnail links through as well as the name -
                          tapping the picture is the obvious thing to try. */}
                      <Link
                        href={`/shop/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="relative w-24 h-24 bg-brand-100 rounded-lg overflow-hidden flex-shrink-0 group"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="96px"
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="text-sm font-medium text-brand-900 hover:text-gold-600 transition-colors line-clamp-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-brand-500 mt-1">
                          {item.colour || item.product.material}
                        </p>
                        <p className="text-sm font-medium text-brand-900 mt-2">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="p-3.5 -m-1 hover:bg-brand-100 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4 text-brand-600" />
                            </motion.button>
                            <span className="text-sm font-medium text-brand-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="p-3.5 -m-1 hover:bg-brand-100 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4 text-brand-600" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label="Remove item"
                            className="p-3.5 -m-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Deals of the Day - inside the scroll area so it can never
                      push the checkout footer off screen */}
                  {visibleDeals.length > 0 && (
                    <div className="pt-6 mt-6 border-t border-brand-100">
                      <p className="text-sm font-medium text-brand-900 mb-1">Deals of the Day</p>
                      <p className="text-xs text-brand-400 mb-4">Add before you check out</p>
                      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                        {visibleDeals.map((deal) => (
                          <div key={deal.id} className="flex-shrink-0 w-24 text-center">
                            <Link href={`/shop/${deal.slug}`} onClick={() => setIsOpen(false)}>
                              <div className="relative w-24 h-24 bg-brand-50 rounded-lg overflow-hidden mb-2">
                                <Image src={deal.images[0]} alt={deal.name} fill className="object-cover" />
                              </div>
                              <p className="text-xs text-brand-900 line-clamp-1">{deal.name}</p>
                            </Link>
                            <div className="flex items-baseline justify-center gap-1 mb-1">
                              <p className="text-xs text-brand-500">{formatPrice(deal.price)}</p>
                              {deal.originalPrice && deal.originalPrice > deal.price && (
                                <p className="text-[10px] text-brand-400 line-through">
                                  {formatPrice(deal.originalPrice)}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(deal, 1)}
                              className="text-xs px-2 py-1 border border-brand-900 rounded-full hover:bg-brand-900 hover:text-white transition-colors"
                            >
                              Add +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer - fixed, not scrollable, keeps the drawer uncluttered */}
            {items.length > 0 && (
              <div className="border-t border-brand-100 p-6 space-y-4 flex-shrink-0">
                <div className="flex justify-between text-lg font-medium">
                  <span className="text-brand-900">Subtotal</span>
                  <span className="text-brand-900">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs text-brand-400">
                  Shipping and any coupon codes are calculated at checkout.
                </p>

                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                  asChild
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
