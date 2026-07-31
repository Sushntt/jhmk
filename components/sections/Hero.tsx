"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    // Near-full height on a phone, capped on a laptop - a 100vh hero on a wide
    // screen pushes every product below the fold.
    <section className="relative h-[88vh] min-h-[520px] lg:h-[78vh] lg:max-h-[680px] flex items-center justify-center overflow-hidden bg-brand-950">
      {/* Photo fills the frame behind the copy */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero-model.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_20%] lg:object-[55%_25%]"
        />
      </motion.div>

      {/* Scrim. Darkest through the middle band where the type sits, so the
          headline stays legible without flattening the whole photograph. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-950/65 to-brand-950/55" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="font-serif italic text-gold-100 leading-[1.15] pb-2 mb-10 text-4xl sm:text-5xl lg:text-6xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
        >
          Grace in every detail
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
        >
          <Link
            href="/shop"
            className="inline-block px-12 py-4 border border-white/70 text-white text-sm tracking-[0.2em] uppercase transition-colors duration-200 ease-out hover:bg-white hover:text-brand-900"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
