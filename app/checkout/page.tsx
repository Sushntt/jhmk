"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Reveal } from "@/components/animations/Reveal"
import { siteConfig } from "@/lib/site-config"
import { MessageCircle, ShoppingBag, User, ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, isLoading, signIn, authError } = useAuth()
  const router = useRouter()

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percentOff: number } | null>(null)
  const [couponError, setCouponError] = useState("")

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Pre-fill from the saved profile once the user is loaded
  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.name || "")
      setCustomerPhone((prev) => prev || user.phone || "")
      setCustomerAddress(
        (prev) =>
          prev ||
          [user.address, [user.city, user.pincode].filter(Boolean).join(" - ")]
            .filter(Boolean)
            .join(", ")
      )
    }
  }, [user])

  const discount = appliedCoupon ? Math.round(totalPrice * (appliedCoupon.percentOff / 100)) : 0
  const total = totalPrice - discount

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (code === "CHINKARA10") {
      setAppliedCoupon({ code, percentOff: 10 })
      setCouponError("")
    } else {
      setAppliedCoupon(null)
      setCouponError("Invalid or expired code")
    }
  }

  const handleSignIn = async () => {
    setIsSigningIn(true)
    await signIn()
    setIsSigningIn(false)
  }

  const handlePlaceOrder = async () => {
    const finalName = (customerName || user?.name || "").trim()
    if (!finalName || !customerPhone.trim() || !customerAddress.trim()) return

    setIsSubmitting(true)
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: finalName,
          email: user?.email || "",
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total,
        }),
      })
    } catch (e) {
      console.error("Order logging failed, continuing to WhatsApp anyway:", e)
    } finally {
      setIsSubmitting(false)
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsappNumber
    const message = generateWhatsAppMessage(
      items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      finalName,
      customerPhone.trim(),
      customerAddress.trim()
    )
    clearCart()
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
    router.push("/")
  }

  if (items.length === 0) {
    return (
      <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <ShoppingBag className="w-16 h-16 text-brand-300 mx-auto mb-4" />
        <h1 className="text-2xl font-serif text-brand-900 mb-2">Your bag is empty</h1>
        <p className="text-brand-500 mb-8">Add something beautiful before checking out.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Reveal className="mb-12">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-brand-900">Checkout</h1>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-2 lg:order-2">
          <Reveal delay={0.1}>
            <div className="bg-white border border-brand-100 rounded-lg p-6 sticky top-32">
              <h2 className="text-lg font-serif text-brand-900 mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-brand-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-brand-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-brand-900 flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-brand-100 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 text-sm border border-brand-900 text-brand-900 rounded-lg hover:bg-brand-900 hover:text-white transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-brand-500">Subtotal</span>
                  <span className="text-brand-900">{formatPrice(totalPrice)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon ({appliedCoupon.code})</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Shipping</span>
                  <span className="text-brand-400">
                    ₹{siteConfig.shipping.tamilNadu}–{siteConfig.shipping.restOfIndia}, confirmed on WhatsApp
                  </span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-2 border-t border-brand-100">
                  <span className="text-brand-900">Total</span>
                  <span className="text-brand-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Login + Details */}
        <div className="lg:col-span-3 lg:order-1">
          {isLoading ? (
            <div className="bg-white border border-brand-100 rounded-lg p-10 text-center">
              <p className="text-brand-400 text-sm">Loading…</p>
            </div>
          ) : !user ? (
            <Reveal>
              <div className="bg-white border border-brand-100 rounded-lg p-10 text-center">
                <User className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-brand-900 mb-2">Sign in to continue</h2>
                <p className="text-brand-500 mb-8 max-w-sm mx-auto">
                  Please sign in so we can save your order and keep you updated on WhatsApp.
                </p>
                <Button onClick={handleSignIn} isLoading={isSigningIn} size="lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In with Google
                </Button>
                {authError && (
                  <p className="text-sm text-red-600 mt-4 max-w-sm mx-auto">{authError}</p>
                )}
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div className="bg-white border border-brand-100 rounded-lg p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-100">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-brand-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-brand-900">Signed in as {user.name}</p>
                    <p className="text-xs text-brand-500">{user.email}</p>
                  </div>
                </div>

                <h2 className="text-lg font-serif text-brand-900 mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone number"
                      className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Delivery Address</label>
                    <textarea
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={3}
                      placeholder="Full delivery address"
                      className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || !customerName.trim() || !customerPhone.trim() || !customerAddress.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-8"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Placing order..." : "Place Order via WhatsApp"}
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}
