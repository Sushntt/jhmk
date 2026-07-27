"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { Heart, ShoppingBag, Minus, Plus, Check, ArrowLeft, Truck, Shield, MessageCircle } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { RecentlyViewed } from "./RecentlyViewed"

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, setIsOpen: setCartOpen } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = () => {
    if (!product.inStock) return
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!product.inStock) return
    addToCart(product, quantity)
    setCartOpen(true)
  }

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal>
        <nav className="flex items-center gap-2 text-sm text-brand-500 mb-8">
          <Link href="/" className="hover:text-brand-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-brand-900 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-900">{product.name}</span>
        </nav>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        {/* Images */}
        <Reveal direction="left">
          <div className="space-y-4">
            <div className="relative aspect-square bg-brand-100 rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-gold-500" : "border-transparent hover:border-brand-300"
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Info */}
        <Reveal direction="right" delay={0.2}>
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-gold-600 mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium text-brand-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-brand-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              )}
              {!product.inStock && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium tracking-wide rounded">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <p className="text-brand-600 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-brand-700">Quantity</span>
              <div className="flex items-center border border-brand-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                  className="p-3 hover:bg-brand-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  disabled={!product.inStock}
                  className="p-3 hover:bg-brand-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
                size="lg"
              >
                <AnimatePresence mode="wait">
                  {!product.inStock ? (
                    <motion.span key="oos" className="flex items-center gap-2">
                      Out of Stock
                    </motion.span>
                  ) : added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Added to Bag
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isInWishlist(product.id)
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-brand-200 hover:border-brand-400 text-brand-700"
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
              </motion.button>
            </div>

            {product.inStock && (
              <button
                onClick={handleBuyNow}
                className="w-full mb-8 -mt-4 py-4 rounded-lg border-2 border-brand-900 text-brand-900 font-medium tracking-wide uppercase text-sm hover:bg-brand-900 hover:text-white transition-colors"
              >
                Buy Now
              </button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Truck, label: "Pan-India Delivery" },
                { icon: Shield, label: "Quality Checked" },
                { icon: MessageCircle, label: "Order on WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="p-3 bg-brand-50 rounded-lg">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-gold-600" />
                  <p className="text-xs text-brand-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <Reveal className="text-center mb-12">
            <h2 className="text-2xl font-serif text-brand-900 mb-2">People Also Bought</h2>
            <p className="text-brand-500 text-sm">More from {product.category}</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {related.map((p) => (
              <div key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      <RecentlyViewed currentProductId={product.id} />
    </div>
  )
}
