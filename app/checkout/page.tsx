"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { formatPrice, generateWhatsAppMessage } from "@/lib/utils"
import { INDIAN_STATES, shippingForState, formatAddress } from "@/lib/shipping"
import { Button } from "@/components/ui/Button"
import { Reveal } from "@/components/animations/Reveal"
import { siteConfig } from "@/lib/site-config"
import { MessageCircle, ShoppingBag, User, ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, isLoading, signIn, authError, updateProfile } = useAuth()
  const router = useRouter()

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percentOff: number } | null>(null)
  const [couponError, setCouponError] = useState("")

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [doorNo, setDoorNo] = useState("")
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stockWarning, setStockWarning] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)

  // Pre-fill from the saved profile once the user is loaded
  useEffect(() => {
    if (!user) return
    setName((v) => v || user.name || "")
    setPhone((v) => v || user.phone || "")
    setLine1((v) => v || user.address || "")
    setCity((v) => v || user.city || "")
    setPincode((v) => v || user.pincode || "")
  }, [user])

  const discount = appliedCoupon ? Math.round(totalPrice * (appliedCoupon.percentOff / 100)) : 0
  const shipping = useMemo(() => shippingForState(state), [state])
  const total = totalPrice - discount + shipping

  const addressLine = formatAddress({ doorNo, line1, line2, city, state, pincode })

  /**
   * Per-field validation.
   *
   * Errors appear once a field has been touched (blurred) or once the customer
   * has attempted to submit - not while they are still typing their first
   * character, which would be hostile.
   *
   * Phone and PIN are checked for format, not just presence: an order that
   * reaches WhatsApp with an unreachable number or an invalid PIN costs a sale.
   */
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [attempted, setAttempted] = useState(false)

  const errors = useMemo(() => {
    const e: Record<string, string> = {}

    if (!name.trim()) e.name = "Please enter your name"

    const digits = phone.replace(/\D/g, "")
    if (!phone.trim()) e.phone = "Please enter your phone number"
    // Accept an optional 91 country code in front of a standard 10-digit number
    else if (!/^(91)?[6-9]\d{9}$/.test(digits))
      e.phone = "Enter a valid 10-digit Indian mobile number"

    if (!doorNo.trim()) e.doorNo = "Please enter your door number"
    if (!line1.trim()) e.line1 = "Please enter your address"
    if (!city.trim()) e.city = "Please enter your city"
    if (!state.trim()) e.state = "Please select your state"

    if (!pincode.trim()) e.pincode = "Please enter your PIN code"
    // Indian PIN codes are 6 digits and never start with 0
    else if (!/^[1-9]\d{5}$/.test(pincode.trim()))
      e.pincode = "PIN code must be 6 digits"

    return e
  }, [name, phone, doorNo, line1, city, state, pincode])

  const missing = Object.keys(errors)

  /** Show an error only once the field has been touched, or on submit attempt. */
  const errorFor = (field: string) =>
    attempted || touched[field] ? errors[field] : undefined

  const markTouched = (field: string) =>
    setTouched((t) => ({ ...t, [field]: true }))

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
    setStockWarning("")
    if (missing.length > 0) {
      setAttempted(true)
      return
    }

    setIsSubmitting(true)
    try {
      // Saves the shopper re-typing all of this next time
      updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: [doorNo.trim(), line1.trim(), line2.trim()].filter(Boolean).join(", "),
        city: city.trim(),
        pincode: pincode.trim(),
      })

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          email: user?.email || "",
          phone: phone.trim(),
          address: addressLine,
          state: state.trim(),
          shipping,
          discount,
          couponCode: appliedCoupon?.code || "",
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.colour ? `${item.product.name} (${item.colour})` : item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
          total,
        }),
      })
      // If another customer's order was confirmed for the same piece while this
      // one was being filled in, say so now rather than sending them to WhatsApp
      // to ask about something already sold.
      const data = await res.json().catch(() => null)
      if (data?.unavailable?.length > 0) {
        setStockWarning(
          data.unavailable
            .map((u: { name: string; available: number }) =>
              u.available === 0
                ? `${u.name} has just sold out`
                : `${u.name} — only ${u.available} left`
            )
            .join(". ")
        )
        setIsSubmitting(false)
        return
      }
    } catch (e) {
      console.error("Order logging failed, continuing to WhatsApp anyway:", e)
    } finally {
      setIsSubmitting(false)
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsappNumber
    const message = generateWhatsAppMessage(
      items.map((item) => ({
        name: item.colour ? `${item.product.name} (${item.colour})` : item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      name.trim(),
      phone.trim(),
      addressLine,
      { subtotal: totalPrice, discount, shipping, total },
      appliedCoupon?.code
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

  const field =
    "w-full px-4 py-3 border rounded-lg bg-surface focus:outline-none focus:ring-1 transition-colors"

  /** Border and ring turn red once a field is in error. */
  const fieldClass = (name: string) =>
    `${field} ${
      errorFor(name)
        ? "border-spice-400 focus:border-spice-500 focus:ring-spice-400"
        : "border-brand-200 focus:border-gold-500 focus:ring-gold-500"
    }`

  /** Small red message under a field. */
  const FieldError = ({ name }: { name: string }) => {
    const message = errorFor(name)
    if (!message) return null
    return (
      <p className="text-xs text-spice-600 mt-1.5" role="alert">
        {message}
      </p>
    )
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <Reveal className="mb-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl md:text-4xl font-serif text-brand-900">Checkout</h1>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Summary */}
        <div className="lg:col-span-2 lg:order-2">
          <Reveal delay={0.1}>
            <div className="bg-surface border border-brand-200 rounded-lg p-6 lg:sticky lg:top-32">
              <h2 className="text-lg font-serif text-brand-900 mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="relative w-16 h-16 bg-brand-100 rounded-md overflow-hidden flex-shrink-0"
                    >
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="64px" className="object-cover" />
                    </Link>
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

              <div className="mt-6 pt-6 border-t border-brand-200 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-brand-200 rounded-lg bg-surface focus:outline-none focus:border-gold-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 text-sm border border-brand-900 text-brand-900 rounded-lg hover:bg-brand-900 hover:text-white transition-colors duration-200"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-spice-600">{couponError}</p>}

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-brand-500">Subtotal</span>
                  <span className="text-brand-900">{formatPrice(totalPrice)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700">Coupon ({appliedCoupon.code})</span>
                    <span className="text-green-700">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-brand-500">Shipping</span>
                  {state ? (
                    <span className="text-brand-900">{formatPrice(shipping)}</span>
                  ) : (
                    <span className="text-brand-400 text-xs">Select a state</span>
                  )}
                </div>
                {state && (
                  <p className="text-xs text-brand-400 -mt-1">
                    {state === "Tamil Nadu" ? "Within Tamil Nadu" : "Outside Tamil Nadu"}
                  </p>
                )}

                <div className="flex justify-between text-lg font-medium pt-3 border-t border-brand-200">
                  <span className="text-brand-900">Total</span>
                  <span className="text-brand-900">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Login + address */}
        <div className="lg:col-span-3 lg:order-1">
          {isLoading ? (
            <div className="bg-surface border border-brand-200 rounded-lg p-10 text-center">
              <p className="text-brand-400 text-sm">Loading…</p>
            </div>
          ) : !user ? (
            <Reveal>
              <div className="bg-surface border border-brand-200 rounded-lg p-10 text-center">
                <User className="w-12 h-12 text-gold-600 mx-auto mb-4" />
                <h2 className="text-2xl font-serif text-brand-900 mb-2">Sign in to continue</h2>
                <p className="text-brand-500 mb-8 max-w-sm mx-auto">
                  Please sign in so we can save your order and keep you updated on WhatsApp.
                </p>
                <Button onClick={handleSignIn} isLoading={isSigningIn} size="lg">
                  <User className="w-4 h-4 mr-2" />
                  Sign In with Google
                </Button>
                {authError && <p className="text-sm text-spice-600 mt-4 max-w-sm mx-auto">{authError}</p>}
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <div className="bg-surface border border-brand-200 rounded-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-200">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 grid place-items-center">
                      <User className="w-5 h-5 text-brand-500" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-900 truncate">Signed in as {user.name}</p>
                    <p className="text-xs text-brand-500 truncate">{user.email}</p>
                  </div>
                </div>

                <h2 className="text-lg font-serif text-brand-900 mb-1">Delivery Address</h2>
                <p className="text-sm text-brand-500 mb-6">
                  We use your state to work out the shipping charge before you confirm.
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" onBlur={() => markTouched("name")} aria-invalid={!!errorFor("name")} className={fieldClass("name")} />
                      <FieldError name="name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 90000 00000" onBlur={() => markTouched("phone")} aria-invalid={!!errorFor("phone")} className={fieldClass("phone")} />
                      <FieldError name="phone" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Door No.</label>
                    <input type="text" value={doorNo} onChange={(e) => setDoorNo(e.target.value)} placeholder="Flat / house number" onBlur={() => markTouched("doorNo")} aria-invalid={!!errorFor("doorNo")} className={fieldClass("doorNo")} />
                      <FieldError name="doorNo" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">Address Line 1</label>
                    <input type="text" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street, area" onBlur={() => markTouched("line1")} aria-invalid={!!errorFor("line1")} className={fieldClass("line1")} />
                      <FieldError name="line1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-700 mb-2">
                      Address Line 2 <span className="text-brand-400 font-normal">(optional)</span>
                    </label>
                    <input type="text" value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Landmark, apartment name" className={field} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" onBlur={() => markTouched("city")} aria-invalid={!!errorFor("city")} className={fieldClass("city")} />
                      <FieldError name="city" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">State</label>
                      <select value={state} onChange={(e) => setState(e.target.value)} onBlur={() => markTouched("state")} aria-invalid={!!errorFor("state")} className={fieldClass("state")}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brand-700 mb-2">PIN Code</label>
                      <input type="text" inputMode="numeric" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="600001" onBlur={() => markTouched("pincode")} aria-invalid={!!errorFor("pincode")} className={fieldClass("pincode")} />
                      <FieldError name="pincode" />
                    </div>
                  </div>
                </div>

                {stockWarning && (
                  <div className="mt-8 p-4 bg-spice-50 border border-spice-200 rounded-lg">
                    <p className="text-sm text-spice-700 font-medium mb-1">
                      Availability has changed
                    </p>
                    <p className="text-sm text-spice-700">{stockWarning}.</p>
                    <p className="text-xs text-spice-600 mt-2">
                      Please adjust your bag, or message us on WhatsApp and we&apos;ll help find
                      something similar.
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-green-700 hover:bg-green-800 text-white mt-6"
                  size="lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Placing order…" : `Confirm on WhatsApp · ${formatPrice(total)}`}
                </Button>

                {/* Summary only after they have tried to submit - each field
                    already shows its own message by then. */}
                {attempted && missing.length > 0 && (
                  <p className="text-sm text-spice-600 mt-3 text-center" role="alert">
                    Please correct the highlighted fields above.
                  </p>
                )}

                <p className="text-xs text-brand-400 mt-4 text-center">
                  Your order opens in WhatsApp so we can confirm availability and share payment
                  details. Stock is only reserved once we confirm.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  )
}
