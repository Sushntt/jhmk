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
    <section className="relative min-h-screen lg:h-screen flex items-center overflow-hidden bg-brand-950">
      {/* Photo sits behind the copy. On narrow screens it is pushed right so the
          subject stays clear of the headline; on wide screens it fills the frame. */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
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
          className="object-cover object-[72%_18%] lg:object-[68%_22%]"
        />
      </motion.div>

      {/* Scrim: heaviest where the type sits, easing off over the subject. */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/92 via-brand-950/70 to-brand-950/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-950/40" />

      {/* Type side */}
      <div className="relative z-10 w-full flex items-center px-6 sm:px-10 lg:px-16 pt-32 pb-20 lg:py-0">
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
            className="flex"
          >
            <Button asChild size="lg" className="bg-surface text-brand-900 hover:bg-gold-100">
              <Link href="/shop">
                Explore Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>


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
