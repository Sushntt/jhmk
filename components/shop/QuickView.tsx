"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingBag, Minus, Plus, Heart, ArrowRight } from "lucide-react"
import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { Button } from "@/components/ui/Button"

export function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [imageIndex, setImageIndex] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const handleAdd = () => {
    addToCart(product, quantity)
    setAdded(true)
    // Close shortly after so the confirmation is visible but the shopper is
    // returned to browsing rather than left in a dead modal.
    setTimeout(onClose, 900)
  }

  const saved = isInWishlist(product.id)
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-brand-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-3xl bg-surface rounded-t-2xl sm:rounded-lg overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        >
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-surface/90 text-brand-700 hover:text-brand-900 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 overflow-y-auto">
            {/* Image */}
            <div className="relative aspect-square bg-brand-100 flex-shrink-0">
              <Image
                src={product.images[imageIndex]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      aria-label={`Image ${i + 1}`}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        i === imageIndex ? "bg-white" : "bg-white/45"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-7 flex flex-col">
              <p className="text-xs tracking-[0.2em] uppercase text-gold-600 mb-2">
                {product.category}
              </p>
              <h2 className="text-2xl font-serif text-brand-900 leading-snug mb-3">
                {product.name}
              </h2>

              <div className="flex items-center flex-wrap gap-2 mb-4">
                <span className="text-xl font-medium text-brand-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-brand-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount && (
                  <span className="px-2 py-0.5 bg-spice-100 text-spice-700 text-xs rounded">
                    {discount}% off
                  </span>
                )}
                {!product.inStock && (
                  <span className="px-2 py-0.5 bg-brand-200 text-brand-700 text-xs font-medium rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-brand-600 leading-relaxed line-clamp-4 mb-5">
                  {product.description}
                </p>
              )}

              {product.material && (
                <p className="text-xs text-brand-500 mb-5">
                  <span className="text-brand-400">Material · </span>
                  {product.material}
                </p>
              )}

              <div className="mt-auto space-y-4">
                {product.inStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-brand-500">Quantity</span>
                    <div className="flex items-center border border-brand-200 rounded-md">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                        className="p-2.5 hover:bg-brand-100 transition-colors rounded-l-md"
                      >
                        <Minus className="w-4 h-4 text-brand-600" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                        className="p-2.5 hover:bg-brand-100 transition-colors rounded-r-md"
                      >
                        <Plus className="w-4 h-4 text-brand-600" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAdd}
                    disabled={!product.inStock || added}
                    className="flex-1"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {added ? "Added to bag" : product.inStock ? "Add to Bag" : "Sold Out"}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                    className="px-3 border border-brand-200 rounded-md hover:border-brand-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${saved ? "fill-spice-500 text-spice-500" : "text-brand-600"}`}
                    />
                  </button>
                </div>

                <Link
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="group inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-900 transition-colors"
                >
                  View full details
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
