"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/hooks/useWishlist"
import { useCart } from "@/hooks/useCart"
import { formatPrice } from "@/lib/utils"
import { X, Heart, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function WishlistDrawer() {
  const { items, isOpen, setIsOpen, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-brand-100">
              <h2 className="text-xl font-serif tracking-wide text-brand-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                Wishlist ({items.length})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-brand-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-brand-700" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Heart className="w-16 h-16 text-brand-300 mb-4" />
                  <p className="text-brand-500 text-lg mb-2">Your wishlist is empty</p>
                  <p className="text-brand-400 text-sm mb-6">
                    Save your favourite pieces for later
                  </p>
                  <Button onClick={() => setIsOpen(false)} variant="outline" asChild>
                    <Link href="/shop">Explore Collection</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-24 h-24 bg-brand-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${item.slug}`}
                          className="text-sm font-medium text-brand-900 hover:text-gold-600 transition-colors line-clamp-1"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-brand-500 mt-1">{item.category}</p>
                        <p className="text-sm font-medium text-brand-900 mt-2">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-900 text-white text-xs rounded-full hover:bg-brand-800 transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Add to Bag
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-brand-400 hover:text-red-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-brand-100 p-6">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                  asChild
                >
                  <Link href="/shop">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
