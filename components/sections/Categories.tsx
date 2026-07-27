"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations/Reveal"

const categories = [
  { name: "Necklaces", image: "/images/collection-necklaces.jpg" },
  { name: "Bangles", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80" },
  { name: "Anklets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { name: "Bracelets", image: "/images/collection-bracelets.jpg" },
]

export function Categories() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-brand-900">Categories</h2>
      </Reveal>
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {categories.map((cat) => (
          <StaggerItem key={cat.name}>
            <Link href={`/shop?category=${cat.name}`}>
              <motion.div
                className="relative aspect-[3/4] rounded-lg overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-white">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-serif">{cat.name}</h3>
                </div>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  )
}
