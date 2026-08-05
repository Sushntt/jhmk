"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

/**
 * Two crops of the same studio photograph, chosen by breakpoint.
 *
 * The shot is landscape (1.50) with the subject right of centre against a dark
 * backdrop, so the left third is naturally clear for the headline - no blurred
 * fill or composite needed. Mobile uses a portrait crop of the same frame,
 * centred on the subject.
 *
 * The desktop frame has its backdrop extended leftwards to 2.2, because the
 * original 1.50 crop lost 44% of the photo's height on a wide short screen and
 * cut the subject off. Extending a plain gradient backdrop is lossless where
 * cropping the subject is not.
 *
 * Anchored at 68% across and 30% down: the subject sits right of centre and the
 * head between 16% and 50%, so centring would clip her on shorter viewports.
 */
export function Hero() {
  return (
    // Starts directly below the fixed header (36px promo bar + 80px navbar).
    // Desktop: the hero fills everything below the header, so the first screen
    // is entirely the banner. Phones stay slightly short of full height so the
    // top of the next section peeks in and signals there's more to scroll.
    <section className="relative mt-[116px] h-[calc(92vh-116px)] min-h-[460px] lg:h-[calc(100vh-116px)] lg:max-h-none flex items-center overflow-hidden bg-brand-950">
      <div
        className="absolute inset-0 hero-zoom"
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
          className="hidden lg:block object-cover object-[68%_30%]"
        />
      </div>

      {/* Scrim. Even on phones, where the copy sits centred over the subject. */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/45 via-brand-950/35 to-brand-950/50 lg:bg-gradient-to-r lg:from-brand-950/55 lg:via-brand-950/15 lg:to-transparent" />

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16">
        {/* Centred on a phone; left-aligned on desktop, where the subject sits
            right of centre and the left third is clear. */}
        <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left lg:max-w-lg">
          <h1
            className="hero-in hero-in-1 font-serif italic text-gold-100 leading-[1.15] pb-2 mb-8 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)]"
          >
            Grace in every detail
          </h1>

          <div className="hero-in hero-in-2">
            <Link
              href="/shop"
              className="inline-block px-10 py-3.5 border border-white/70 text-white text-xs sm:text-sm tracking-[0.2em] uppercase transition-colors duration-200 ease-out hover:bg-white hover:text-brand-900"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hero-in hero-in-3">
        <ChevronDown className="w-5 h-5 text-white/50 animate-bob" />
      </div>
    </section>
  )
}
