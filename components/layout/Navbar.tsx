"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Heart, Menu, X, Search, User, LogOut } from "lucide-react"
import { useCart } from "@/hooks/useCart"
import { useWishlist } from "@/hooks/useWishlist"
import { useAuth } from "@/hooks/useAuth"
import { IconButton } from "@/components/ui/IconButton"
import { SearchOverlay } from "@/components/layout/SearchOverlay"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems, setIsOpen: setCartOpen } = useCart()
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist()
  const { user, signIn, signOut } = useAuth()

  // A scroll listener fires on every scroll frame and re-renders the navbar
  // each time. IntersectionObserver does the same job off the main thread and
  // only fires when the threshold is actually crossed.
  useEffect(() => {
    const sentinel = document.createElement("div")
    sentinel.setAttribute("aria-hidden", "true")
    sentinel.style.cssText = "position:absolute;top:0;left:0;height:50px;width:1px;pointer-events:none;"
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
    }
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isHome = pathname === "/"

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed top-9 left-0 right-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ease-out",
          isScrolled || !isHome
            ? "bg-surface/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.span
                className={cn(
                  "text-2xl font-serif tracking-widest uppercase",
                  isScrolled || !isHome ? "text-brand-900" : "text-white"
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
                    isScrolled || !isHome ? "text-brand-700 hover:text-brand-900" : "text-white/90 hover:text-white"
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
                  isScrolled || !isHome ? "text-brand-900" : "text-white"
                )}
              >
                <Search className="w-5 h-5" />
              </IconButton>

              <IconButton
                onClick={() => setWishlistOpen(true)}
                badge={wishlistItems.length}
                className={cn(
                  isScrolled || !isHome ? "text-brand-900" : "text-white"
                )}
              >
                <Heart className="w-5 h-5" />
              </IconButton>

              <IconButton
                onClick={() => setCartOpen(true)}
                badge={totalItems}
                className={cn(
                  isScrolled || !isHome ? "text-brand-900" : "text-white"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
              </IconButton>

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/account">
                    <IconButton
                      className={cn(
                        isScrolled || !isHome ? "text-brand-900" : "text-white"
                      )}
                    >
                      <User className="w-5 h-5" />
                    </IconButton>
                  </Link>
                  <IconButton
                    onClick={signOut}
                    className={cn(
                      isScrolled || !isHome ? "text-brand-900" : "text-white"
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
                    isScrolled || !isHome
                      ? "text-brand-900 border border-brand-900 hover:bg-brand-900 hover:text-white"
                      : "text-white border border-white/50 hover:bg-surface/10"
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
                  isMobileMenuOpen
                    ? "text-brand-900"
                    : isScrolled || !isHome
                    ? "text-brand-900"
                    : "text-white"
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
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
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
