"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, ChevronDown } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

// Split hero. The available photography is portrait-orientation phone
// photography, which cannot fill a widescreen background without cropping to a
// face. So it is framed as a portrait on one side and the type gets a clean
// field on the other - the photo is presented deliberately rather than
// stretched, and the page reads as editorial instead of accidental.
export function Hero() {
  return (
    <section className="relative min-h-screen lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-brand-950">
      {/* Type side */}
      <div className="relative z-10 flex-1 flex items-center px-6 sm:px-10 lg:px-16 pt-32 pb-16 lg:py-0">
        {/* Faint oversized emblem as a watermark - brand presence without
            another element competing for attention. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 w-[34rem] h-[34rem] opacity-[0.05] hidden lg:block"
        >
          <Image src="/images/logo-emblem.png" alt="" fill sizes="544px" className="object-contain" />
        </div>

        <div className="relative max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/logo-emblem.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="40px"
                priority
                className="object-contain"
              />
            </div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-gold-200">
              Chennai · Imitation Jewellery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            className="font-serif leading-[1.1] tracking-tight mb-7 pb-1 text-[3rem] sm:text-6xl xl:text-7xl"
          >
            Grace in
            <br />
            <span className="italic text-gold-200">every detail</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="flex items-start gap-4 mb-9"
          >
            {/* scaleX rather than animating width - width is a layout property
                and forces reflow on every frame; scaleX runs on the GPU. */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.6, ease }}
              style={{ transformOrigin: "left" }}
              className="h-px w-10 bg-gold-400 flex-shrink-0 mt-3"
            />
            <p className="text-sm sm:text-base text-brand-300 leading-relaxed">
              Named for the Indian gazelle. Hand-picked pieces from makers across India,
              packed and sent by us personally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Button asChild size="lg" className="bg-white text-brand-900 hover:bg-gold-100">
              <Link href="/shop">
                Explore Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white"
            >
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Image side - portrait shown as a portrait */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease }}
        className="relative w-full lg:w-[44%] xl:w-[46%] h-[58vh] lg:h-auto flex-shrink-0"
      >
        <Image
          src="/images/hero-model.jpg"
          alt="Model wearing Chinkara jewellery"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="object-cover object-[50%_18%]"
        />
        {/* Soft seam between the photo and the type field */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-950 to-transparent hidden lg:block" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-950 to-transparent lg:hidden" />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 left-6 sm:left-10 lg:left-16 hidden lg:block"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
