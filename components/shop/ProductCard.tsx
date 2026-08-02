"use client"

import { useState } from "react"
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

  const saved = isInWishlist(product.id)

  return (
    // Hover lift, press feedback and icon reveals are all plain CSS here.
    // Framer Motion was creating six animated components per card; on a grid of
    // 24 that is 144 React-driven animations, which is what made scrolling
    // stutter. CSS transforms composite on the GPU and cost nothing in JS.
    <div className="group transition-transform duration-200 ease-out [@media(hover:hover)]:hover:-translate-y-1">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-brand-100 rounded-lg overflow-hidden mb-3">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgSrc("/images/product-1.jpg")}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badges. Small and low-contrast enough not to fight the photograph.
              No stock badge here - the client asked for nothing over the image
              beyond these two; the stock position lives on the product page,
              beside the quantity picker where it affects a decision. */}
          {!product.inStock ? (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-spice-600/95 text-[9px] font-medium tracking-wide uppercase text-white rounded">
              Sold Out
            </span>
          ) : (
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              {product.newArrival && (
                <span className="px-1.5 py-0.5 bg-surface/95 text-[9px] tracking-wide uppercase text-brand-900 rounded">
                  New
                </span>
              )}
              {product.bestseller && (
                <span className="px-1.5 py-0.5 bg-gold-600/95 text-[9px] tracking-wide uppercase text-white rounded">
                  Bestseller
                </span>
              )}
            </div>
          )}

          {/* Icon actions, stacked top-right over the image.
              Always visible on touch; on pointer devices they fade in, since a
              permanent overlay competes with the product photo. */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ease-out [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleWishlist(product)
              }}
              aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              className="grid place-items-center w-9 h-9 rounded-full bg-surface/95 shadow-sm hover:bg-surface transition-[background-color,transform] duration-150 active:scale-90"
            >
              <Heart className={`w-4 h-4 ${saved ? "fill-spice-500 text-spice-500" : "text-brand-700"}`} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault()
                if (product.inStock) addToCart(product)
              }}
              disabled={!product.inStock}
              aria-label={product.inStock ? `Add ${product.name} to bag` : `${product.name} is sold out`}
              className="grid place-items-center w-9 h-9 rounded-full bg-surface/95 shadow-sm hover:bg-brand-900 hover:text-white transition-[background-color,color,transform] duration-150 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-surface/95 disabled:hover:text-brand-700 text-brand-700"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-sm font-medium text-brand-900 hover:text-gold-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-brand-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-brand-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
