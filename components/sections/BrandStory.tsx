"use client"

import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"

// The gazelle is the brand - "Chinkara takes its name from the Indian gazelle".
// Using the actual emblem here (rather than a stock photo) is the one place the
// homepage leans on brand identity instead of product photography.
export function BrandStory() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-50">
      <div className="max-w-4xl mx-auto text-center">
        <Reveal>
          <div
            className="relative w-20 h-20 mx-auto mb-8"
          >
            <Image
              src="/images/logo-emblem.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="80px"
              className="object-contain"
            />
          </div>

          <p className="text-xs tracking-[0.35em] uppercase text-gold-600 mb-6">The Name</p>

          <p className="text-xl md:text-2xl font-serif text-brand-900 leading-relaxed mb-8">
            The chinkara is the Indian gazelle — light on its feet, alert, quietly elegant.
            That is the spirit we look for in every piece we carry.
          </p>

          <p className="text-brand-600 text-sm leading-relaxed max-w-xl mx-auto mb-10">
            Chennai-born, founded by two friends who believed beautiful, well-finished imitation
            jewellery shouldn&apos;t require a treasure hunt — or a treasure chest. Every order is
            checked, packed, and dispatched by us personally.
          </p>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-brand-900 border-b border-brand-300 pb-1 hover:border-gold-500 transition-colors duration-300"
          >
            Read our story
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
