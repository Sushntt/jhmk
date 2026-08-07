"use client"

import { useState, useEffect, useRef } from "react"
import { useBackToClose } from "@/hooks/useBackToClose"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  category: string
  image: string
}

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Back gesture closes the search rather than leaving the page
  const { closeForNavigation } = useBackToClose(isOpen, onClose)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (e) {
        console.error("Search failed:", e)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      closeForNavigation()
      router.push(`/shop?search=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-9 left-0 right-0 z-50 bg-surface shadow-2xl"
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-8">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for rings, necklaces, earrings..."
                  className="flex-1 text-lg text-brand-900 placeholder:text-brand-400 focus:outline-none py-2"
                />
                {isLoading && <Loader2 className="w-5 h-5 text-brand-400 animate-spin flex-shrink-0" />}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="p-2 hover:bg-brand-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-brand-700" />
                </button>
              </form>

              {results.length > 0 && (
                <div className="mt-6 space-y-1 max-h-[60vh] overflow-y-auto">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={closeForNavigation}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      <div className="relative w-14 h-14 bg-brand-100 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-brand-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-medium text-brand-900 flex-shrink-0">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim() && !isLoading && results.length === 0 && (
                <p className="mt-6 text-sm text-brand-500 text-center py-8">
                  No pieces found for &quot;{query}&quot;
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
