"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Reveal } from "@/components/animations/Reveal"
import { faqItems as mockFAQ } from "@/lib/faq"
import { ChevronDown, Search } from "lucide-react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fix: Convert Set to Array explicitly for TypeScript compatibility
  const categories = Array.from(new Set(mockFAQ.map((f) => f.category)))

  const filtered = mockFAQ.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const grouped = categories.map((cat) => ({
    category: cat,
    items: filtered.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Reveal className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-900 mb-4">FAQ</h1>
        <p className="text-brand-500 max-w-xl mx-auto">
          Find answers to common questions about our jewellery, orders, and policies
        </p>
      </Reveal>

      <Reveal delay={0.2} className="mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
          />
        </div>
      </Reveal>

      <div className="space-y-12">
        {grouped.map((group) => (
          <div key={group.category}>
            <Reveal>
              <h2 className="text-lg font-medium text-brand-900 mb-6 tracking-wide uppercase">
                {group.category}
              </h2>
            </Reveal>
            <div className="space-y-3">
              {group.items.map((item, index) => {
                const globalIndex = mockFAQ.indexOf(item)
                const isOpen = openIndex === globalIndex

                return (
                  <Reveal key={globalIndex} delay={index * 0.05}>
                    <div className="bg-surface rounded-lg border border-brand-200 overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-brand-50 transition-colors"
                      >
                        <span className="font-medium text-brand-900 pr-4">{item.question}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-brand-500 flex-shrink-0" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-5 pb-5 text-brand-600 leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
