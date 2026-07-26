"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/hooks/useWishlist"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils"
import { User, Heart, ShoppingBag, LogOut, Settings, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function AccountPage() {
  const { user, isLoading, signOut } = useAuth()
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist()
  const router = useRouter()

  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [lifetimeSpend, setLifetimeSpend] = useState(0)

  useEffect(() => {
    if (!isLoading && !user) router.push("/shop")
  }, [user, isLoading, router])

  // Real numbers make the page feel like an account rather than a menu.
  useEffect(() => {
    if (!user) return
    const params = new URLSearchParams()
    if (user.email) params.set("email", user.email)
    if (user.phone) params.set("phone", user.phone)

    fetch(`/api/orders/mine?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        const orders = d.orders || []
        setOrderCount(orders.length)
        setLifetimeSpend(
          orders
            .filter((o: any) => (o.status || "").toLowerCase() !== "cancelled")
            .reduce((s: number, o: any) => s + (o.total || 0), 0)
        )
      })
      .catch(() => setOrderCount(0))
  }, [user])

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  const firstName = user.name?.split(" ")[0] || "there"
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase()
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })

  const tiles = [
    {
      href: "/account/orders",
      icon: ShoppingBag,
      title: "Order History",
      meta:
        orderCount === null
          ? "Loading…"
          : orderCount === 0
          ? "No orders yet"
          : `${orderCount} order${orderCount === 1 ? "" : "s"}`,
    },
    {
      onClick: () => setWishlistOpen(true),
      icon: Heart,
      title: "Wishlist",
      meta:
        wishlistItems.length > 0
          ? `${wishlistItems.length} saved ${wishlistItems.length === 1 ? "piece" : "pieces"}`
          : "Nothing saved yet",
    },
    {
      href: "/account/profile",
      icon: User,
      title: "Profile",
      meta: user.address ? "Address saved" : "Add your address",
    },
    {
      href: "/account/settings",
      icon: Settings,
      title: "Settings",
      meta: "Notifications & privacy",
    },
  ]

  return (
    <div className="pt-32 pb-24">
      {/* Banner. A dark band gives the page a top edge and stops it reading as
          four grey boxes floating on a beige field. */}
      <div className="relative bg-brand-900 text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 opacity-[0.06] hidden sm:block"
        >
          <Image src="/images/logo-emblem.png" alt="" fill sizes="320px" className="object-contain" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Reveal>
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-1 ring-gold-400/50 flex-shrink-0 bg-brand-800">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.name} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-serif text-2xl text-gold-200">
                    {initial}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl sm:text-4xl font-serif leading-tight">
                  Hello, {firstName}
                </h1>
                <p className="text-sm text-brand-300 truncate">{user.email}</p>
              </div>
            </div>
          </Reveal>

          {/* Three facts, not decoration */}
          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-3 gap-px bg-brand-800 border border-brand-800 rounded-lg overflow-hidden max-w-lg">
              {[
                { label: "Orders", value: orderCount === null ? "—" : String(orderCount) },
                { label: "Saved", value: String(wishlistItems.length) },
                { label: "Member since", value: memberSince },
              ].map((s) => (
                <div key={s.label} className="bg-brand-900 px-4 py-4">
                  <p className="font-serif text-lg text-gold-200 leading-tight truncate">{s.value}</p>
                  <p className="text-[11px] text-brand-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Tiles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tiles.map((t, i) => {
            const inner = (
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full bg-surface border border-brand-200 rounded-lg p-6 flex items-start gap-4 hover:border-gold-400 transition-colors duration-200"
              >
                <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-100 text-brand-700 flex-shrink-0 group-hover:bg-gold-100 group-hover:text-gold-700 transition-colors duration-200">
                  <t.icon className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="font-medium text-brand-900">{t.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[opacity,transform] duration-200" />
                  </span>
                  <span className="block text-sm text-brand-500 mt-0.5">{t.meta}</span>
                </span>
              </motion.div>
            )

            return (
              <Reveal key={t.title} delay={i * 0.06}>
                {t.href ? (
                  <Link href={t.href} className="block h-full">
                    {inner}
                  </Link>
                ) : (
                  <button onClick={t.onClick} className="block w-full h-full text-left">
                    {inner}
                  </button>
                )}
              </Reveal>
            )
          })}
        </div>

        {/* Footer row */}
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-brand-200 pt-6">
            <p className="text-sm text-brand-500">
              {lifetimeSpend > 0
                ? `You've ordered ${formatPrice(lifetimeSpend)} of Chinkara so far. Thank you.`
                : "Questions about an order? Message us on WhatsApp any time."}
            </p>
            <Button variant="outline" onClick={signOut} className="flex-shrink-0">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
