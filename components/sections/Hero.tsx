"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Two crops of the same studio photograph, chosen by breakpoint.
 *
 * The shot is landscape (1.50) with the subject right of centre against a dark
 * backdrop, so the left third is naturally clear for the headline - no blurred
 * fill or composite needed. Mobile uses a portrait crop of the same frame,
 * centred on the subject.
 *
 * Vertical anchor is 30%: the head sits between 16% and 50% of the frame, and
 * shorter viewports crop from the top and bottom, so centring would clip it.
 */
export function Hero() {
  return (
    // Starts directly below the fixed header (36px promo bar + 80px navbar).
    // Desktop: the hero fills everything below the header, so the first screen
    // is entirely the banner. Phones stay slightly short of full height so the
    // top of the next section peeks in and signals there's more to scroll.
    <section className="relative mt-[116px] h-[calc(92vh-116px)] min-h-[460px] lg:h-[calc(100vh-116px)] lg:max-h-none flex items-center overflow-hidden bg-brand-950">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        className="absolute inset-0"
      >
        {/* Phone: portrait crop */}
        <Image
          src="/images/hero-model-mobile.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_28%] lg:hidden"
        />
        {/* Laptop and up: the full landscape frame */}
        <Image
          src="/images/hero-banner-wide.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="100vw"
          className="hidden lg:block object-cover object-[center_30%]"
        />
      </motion.div>

      {/* Scrim. Even on phones, where the copy sits centred over the subject. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/45 via-brand-950/35 to-brand-950/50 lg:bg-gradient-to-r lg:from-brand-950/55 lg:via-brand-950/15 lg:to-transparent" />

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        {/* Centred on a phone; left-aligned on desktop, where the subject sits
            right of centre and the left third is clear. */}
        <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left lg:max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="font-serif italic text-gold-100 leading-[1.15] pb-2 mb-8 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          >
            Grace in every detail
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
          >
            <Link
              href="/shop"
              className="inline-block px-10 py-3.5 border border-white/70 text-white text-xs sm:text-sm tracking-[0.2em] uppercase transition-colors duration-200 ease-out hover:bg-white hover:text-brand-900"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
