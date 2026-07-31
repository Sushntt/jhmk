"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart, Menu, X, Search, User, LogOut, ChevronRight } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import type { CategoryTile } from "@/lib/categories"
import { useWishlist } from "@/hooks/useWishlist"
import { useAuth } from "@/hooks/useAuth"
import { IconButton } from "@/components/ui/IconButton"
import { SearchOverlay } from "@/components/layout/SearchOverlay"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
]

// The drawer leads with Home and drops "Shop" - "All Products" already opens
// the full catalogue, so listing both just doubles up.
const mobileLinks = [
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryTile[]>([])

  // Categories come from Airtable, so the menu matches the homepage without a
  // second list to keep in sync. Fetched once the menu is first opened rather
  // than on every page load.
  useEffect(() => {
    if (!productsOpen || categories.length > 0) return
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]))
  }, [productsOpen, categories.length])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, setIsOpen: setCartOpen } = useCart()
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist()
  const { user, signIn, signOut } = useAuth()

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setProductsOpen(false)
  }, [pathname])

  const isHome = pathname === "/"

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed top-9 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out",
          isHome
            ? "bg-brand-950 shadow-sm"
            : "bg-surface/95 backdrop-blur-md shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.span
                className={cn(
                  "text-2xl font-serif tracking-widest uppercase",
                  isHome ? "text-white" : "text-brand-900"
                )}
                whileHover={{ scale: 1.02 }}
              >
                Chinkara
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm tracking-widest uppercase transition-colors duration-300 relative group",
                    isHome ? "text-white/90 hover:text-white" : "text-brand-700 hover:text-brand-900"
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-[width] duration-300 ease-out group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <IconButton
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  isHome ? "text-white" : "text-brand-900"
                )}
              >
                <Search className="w-5 h-5" />
              </IconButton>

              <IconButton
                onClick={() => setWishlistOpen(true)}
                badge={wishlistItems.length}
                className={cn(
                  isHome ? "text-white" : "text-brand-900"
                )}
              >
                <Heart className="w-5 h-5" />
              </IconButton>

              <IconButton
                onClick={() => setCartOpen(true)}
                badge={totalItems}
                className={cn(
                  isHome ? "text-white" : "text-brand-900"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
              </IconButton>

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/account">
                    <IconButton
                      className={cn(
                        isHome ? "text-white" : "text-brand-900"
                      )}
                    >
                      <User className="w-5 h-5" />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={signOut}
                    className={cn(
                      isHome ? "text-white" : "text-brand-900"
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                  </IconButton>
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className={cn(
                    "hidden md:flex items-center gap-2 text-sm tracking-wider uppercase px-4 py-2 rounded-full transition-colors duration-200",
                    isHome
                      ? "text-white border border-white/50 hover:bg-surface/10"
                      : "text-brand-900 border border-brand-900 hover:bg-brand-900 hover:text-white"
                  )}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "md:hidden p-2",
                  // Menu panel is always light, so the close X must be dark
                  isMobileMenuOpen ? "text-brand-900" : isHome ? "text-white" : "text-brand-900"
                )}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-surface pt-32 px-6"
          >
            <nav className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-10rem)] pb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link
                  href="/"
                  className="text-2xl font-serif text-brand-900 tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>

              {/* All Products expands in place rather than navigating away, so
                  the shopper can pick a category without losing the menu. */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <button
                  onClick={() => setProductsOpen((o) => !o)}
                  aria-expanded={productsOpen}
                  className="flex items-center justify-between w-full text-2xl font-serif text-brand-900 tracking-wide"
                >
                  All Products
                  <ChevronRight
                    className={`w-5 h-5 text-brand-400 transition-transform duration-200 ${
                      productsOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {productsOpen && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 ml-1 border-l border-brand-200 pl-4 space-y-3"
                  >
                    <li>
                      <Link
                        href="/shop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base text-brand-700 hover:text-brand-900"
                      >
                        Shop All
                      </Link>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between text-base text-brand-700 hover:text-brand-900"
                        >
                          {cat.name}
                          <span className="text-xs text-brand-400">{cat.count}</span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>

              {mobileLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 1) * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-serif text-brand-900 tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-brand-200"
              >
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link href="/account" className="text-lg text-brand-700">
                      My Account
                    </Link>
                    <button onClick={signOut} className="text-lg text-brand-700 text-left">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { signIn(); setIsMobileMenuOpen(false); }}
                    className="text-lg text-brand-900 font-medium"
                  >
                    Sign In with Google
                  </button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
