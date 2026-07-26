"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, ChevronDown } from "lucide-react"

// Staged entrance: emblem, then wordmark, then tagline, then the action.
// Each step is small; the sequence is what makes it feel considered rather
// than everything fading in at once.
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src="/images/hero-model.jpg"
          alt="Model wearing Chinkara jewellery"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient rather than flat black - keeps the jewellery in the photo
            readable at the top while darkening enough for text at the centre. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-6"
        >
          <Image
            src="/images/logo-emblem.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="80px"
            priority
            className="object-contain"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-[0.06em] mb-5 leading-none"
        >
          Chinkara
        </motion.h1>

        {/* Hairline flanking the tagline - a small piece of jewellery-catalogue
            typography rather than another line of centred text. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="h-px bg-white/40"
          />
          <span className="text-sm md:text-base font-light tracking-[0.28em] uppercase text-white/90">
            Grace in Every Detail
          </span>
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: "3rem" }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="h-px bg-white/40"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-white text-brand-900 hover:bg-white/90">
            <Link href="/shop">
              Explore Collection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/50 text-white hover:bg-white/10 hover:border-white"
          >
            <Link href="/about">Our Story</Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
