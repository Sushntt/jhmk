"use client"

import Image from "next/image"
import Link from "next/link"
import { StaggerContainer, StaggerItem } from "@/components/animations/Reveal"
import { Reveal } from "@/components/animations/Reveal"
import { CategoryTile } from "@/lib/categories"

export function CategoriesGrid({ categories }: { categories: CategoryTile[] }) {
  if (categories.length === 0) return null

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Shop by Category</h2>
        <p className="text-brand-500 max-w-md mx-auto text-sm sm:text-base">
          From everyday pieces to festive statements
        </p>
      </Reveal>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {categories.map((cat) => (
          <StaggerItem key={cat.name}>
            <Link href={cat.href} className="group block">
              <div className="relative aspect-[4/5] sm:aspect-square rounded-lg overflow-hidden bg-brand-900">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  // No product in this category yet - the emblem holds the space
                  // rather than showing a stock photo of someone else's jewellery.
                  <div className="absolute inset-0 grid place-items-center bg-brand-900">
                    <div className="relative w-16 h-16 opacity-25">
                      <Image src="/images/logo-emblem.png" alt="" fill sizes="64px" className="object-contain" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  <h3 className="text-sm sm:text-base lg:text-lg font-serif leading-tight">
                    {cat.name}
                  </h3>
                  {cat.count > 0 && (
                    <p className="text-[10px] sm:text-xs text-white/60 mt-0.5">
                      {cat.count} {cat.count === 1 ? "piece" : "pieces"}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
