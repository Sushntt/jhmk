"use client"

import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"

// The three moods are real brand content from Chinkara's own copy, not filler.
// They were previously only on the About page, where nobody browsing would see them.
const collections = [
  {
    name: "Heritage",
    line: "Temple-inspired pieces, antique finishes, and festive classics.",
    detail: "Traditional South Indian and pan-Indian styles",
  },
  {
    name: "Fusion",
    line: "Pieces that pair a saree as easily as they pair denim.",
    detail: "For when the occasion refuses to pick a side",
  },
  {
    name: "Minimal",
    line: "Clean, western-leaning everyday jewellery.",
    detail: "Work, casual, and everything in between",
  },
]

export function Collections() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Find your register</h2>
          <p className="text-brand-300 text-sm max-w-md mx-auto">
            Every piece we carry belongs to one of three moods. Start with the one that sounds
            like you.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-800 border border-brand-800 rounded-lg overflow-hidden">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.12}>
              <Link href="/shop" className="group block h-full">
                <div
                  className="h-full bg-brand-900 p-10 flex flex-col"
                >
                  {/* The rule grows on hover - a small, quiet signal rather than a
                      card that lifts off the page. */}
                  <span className="block h-px w-10 bg-gold-500 mb-6 transition-[width] duration-300 ease-out group-hover:w-20" />

                  <h3 className="text-2xl font-serif mb-3 group-hover:text-gold-300 transition-colors duration-300">
                    {c.name}
                  </h3>
                  <p className="text-brand-300 text-sm leading-relaxed mb-4 flex-1">{c.line}</p>
                  <p className="text-xs text-brand-500 tracking-wide">{c.detail}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
