"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Two images, chosen by breakpoint.
 *
 * The source photograph is portrait (0.75). A phone hero is roughly 0.79, so it
 * fits almost exactly. A desktop banner is 2.25, which would keep only a third
 * of the frame and crop to a face. So desktop gets a purpose-built wide version
 * where the subject sits right of centre against a blurred extension of the same
 * photo, leaving a dark, low-detail area on the left for the headline.
 */
export function Hero() {
  return (
    // Starts directly below the fixed header (36px promo bar + 80px navbar).
    // Sized so the header and hero together fill ~92% of the screen on first
    // load, matching the proportion on the reference site - measured at 77% of
    // the viewport for the image band itself.
    <section className="relative mt-[116px] h-[calc(92vh-116px)] min-h-[460px] lg:h-[calc(90vh-116px)] lg:max-h-[700px] flex items-center overflow-hidden bg-brand-950">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        className="absolute inset-0"
      >
        {/* Phone: the original, which already matches the aspect */}
        <Image
          src="/images/hero-model.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[58%_15%] lg:hidden"
        />
        {/* Laptop and up: the wide banner */}
        <Image
          src="/images/hero-banner-wide.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="100vw"
          className="hidden lg:block object-cover object-center"
        />
      </motion.div>

      {/* Scrim. Even on phones, where the copy sits centred over the subject. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/50 via-brand-950/55 to-brand-950/45 lg:bg-gradient-to-r lg:from-brand-950/75 lg:via-brand-950/35 lg:to-transparent" />

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
