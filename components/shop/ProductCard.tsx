"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [imgSrc, setImgSrc] = useState(product.images[0] || "/images/product-1.jpg")

  return (
    <motion.div
      className="group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-brand-100 rounded-lg overflow-hidden mb-4">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgSrc("/images/product-1.jpg")}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badges.
              A 2-column mobile card is ~173px wide. "OUT OF STOCK" plus
              "BESTSELLER" needs ~210px, so side by side they clipped mid-word.
              When a piece is sold out that is the only thing worth saying, so
              the marketing flags are suppressed and the wording shortened to
              match the button.

              Badges wrap rather than clip, so a piece can carry Limited stock,
              New and Bestseller without anything being cut off. The exact count
              is on the product page beside the quantity picker. */}
          {!product.inStock ? (
            <span className="absolute top-3 left-3 px-2 py-1 bg-spice-600 text-[10px] sm:text-xs font-medium tracking-wider uppercase text-white">
              Sold Out
            </span>
          ) : (
            <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start gap-1.5">
              {product.stockCount > 0 && product.stockCount <= 3 && (
                <span className="px-2 py-1 bg-gold-600 text-[10px] sm:text-xs font-medium tracking-wide text-white">
                  Limited stock
                </span>
              )}
              {product.newArrival && (
                <span className="px-2 py-1 bg-surface/90 text-[10px] sm:text-xs tracking-wider uppercase text-brand-900">
                  New
                </span>
              )}
              {product.bestseller && (
                <span className="px-2 py-1 bg-gold-500/90 text-[10px] sm:text-xs tracking-wider uppercase text-white">
                  Bestseller
                </span>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex gap-2 transition-[opacity,transform] duration-200 ease-out [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0">
            <motion.button
              whileHover={product.inStock ? { scale: 1.05 } : undefined}
              whileTap={product.inStock ? { scale: 0.95 } : undefined}
              onClick={(e) => {
                e.preventDefault()
                if (product.inStock) addToCart(product)
              }}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-surface text-brand-900 font-medium rounded-md hover:bg-brand-900 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-brand-900"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{product.inStock ? "Add to Bag" : "Sold Out"}</span>
            </motion.button>
          </div>
        </div>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-sm font-medium text-brand-900 hover:text-gold-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-medium text-brand-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-brand-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleWishlist(product)}
          className="p-2 hover:bg-brand-100 rounded-full transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist(product.id) ? "text-spice-500 fill-spice-500" : "text-brand-400"}`}
          />
        </motion.button>
      </div>
    </motion.div>
  )
}
