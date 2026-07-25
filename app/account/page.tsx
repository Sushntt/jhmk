"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useWishlist } from "@/hooks/useWishlist"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { User, Heart, ShoppingBag, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AccountPage() {
  const { user, isLoading, signOut } = useAuth()
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/shop")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Reveal>
        <h1 className="text-4xl font-serif text-brand-900 mb-8">My Account</h1>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Reveal className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-brand-200 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-brand-100">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.name} fill className="object-cover" />
              ) : (
                <User className="w-12 h-12 mx-auto mt-6 text-brand-400" />
              )}
            </div>
            <h2 className="text-lg font-medium text-brand-900">{user.name}</h2>
            <p className="text-sm text-brand-500 mb-4">{user.email}</p>
            <p className="text-xs text-brand-400 mb-6">
              Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
            <Button variant="outline" size="sm" onClick={signOut} className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Reveal>

        {/* Quick Links */}
        <Reveal delay={0.1} className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/account/orders">
              <div className="bg-white p-6 rounded-lg border border-brand-200 hover:border-gold-400 transition-colors group h-full">
                <ShoppingBag className="w-8 h-8 text-gold-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-brand-900 mb-1">Order History</h3>
                <p className="text-sm text-brand-500">View your past orders</p>
              </div>
            </Link>
            <button onClick={() => setWishlistOpen(true)} className="text-left">
              <div className="bg-white p-6 rounded-lg border border-brand-200 hover:border-gold-400 transition-colors group h-full">
                <Heart className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-brand-900 mb-1">Wishlist</h3>
                <p className="text-sm text-brand-500">
                  {wishlistItems.length > 0
                    ? `${wishlistItems.length} saved ${wishlistItems.length === 1 ? "item" : "items"}`
                    : "View saved items"}
                </p>
              </div>
            </button>
            <Link href="/account/settings">
              <div className="bg-white p-6 rounded-lg border border-brand-200 hover:border-gold-400 transition-colors group cursor-pointer h-full">
                <Settings className="w-8 h-8 text-brand-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-brand-900 mb-1">Settings</h3>
                <p className="text-sm text-brand-500">Manage preferences and addresses</p>
              </div>
            </Link>
            <Link href="/account/profile">
              <div className="bg-white p-6 rounded-lg border border-brand-200 hover:border-gold-400 transition-colors group cursor-pointer h-full">
                <User className="w-8 h-8 text-brand-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-brand-900 mb-1">Profile</h3>
                <p className="text-sm text-brand-500">Update personal information</p>
              </div>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
