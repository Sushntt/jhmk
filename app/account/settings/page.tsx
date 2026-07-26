"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, Check, LogOut, MapPin } from "lucide-react"

const DEFAULT_PREFS = {
  orderUpdates: true,
  newArrivals: true,
  offers: false,
}

const PREF_LABELS: { key: keyof typeof DEFAULT_PREFS; title: string; desc: string }[] = [
  { key: "orderUpdates", title: "Order Updates", desc: "Get notified on WhatsApp about your order status" },
  { key: "newArrivals", title: "New Arrivals", desc: "Be the first to see new pieces as they launch" },
  { key: "offers", title: "Offers & Promotions", desc: "Occasional festive offers and private sale invites" },
]

export default function SettingsPage() {
  const { user, isLoading, updateProfile, signOut } = useAuth()
  const router = useRouter()

  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/shop")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.preferences) {
      setPrefs({ ...DEFAULT_PREFS, ...user.preferences })
    }
  }, [user])

  const toggle = (key: keyof typeof DEFAULT_PREFS) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    updateProfile({ preferences: prefs })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  const hasAddress = Boolean(user.address)

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <Reveal>
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>
        <h1 className="text-4xl font-serif text-brand-900 mb-8">Settings</h1>
      </Reveal>

      {/* Notification Preferences */}
      <Reveal delay={0.1}>
        <div className="bg-surface rounded-lg border border-brand-200 p-8 mb-6">
          <h2 className="text-lg font-serif text-brand-900 mb-1">Notifications</h2>
          <p className="text-sm text-brand-500 mb-6">Choose what you'd like to hear about.</p>

          <div className="space-y-4">
            {PREF_LABELS.map(({ key, title, desc }) => (
              <div
                key={key}
                className="flex items-start justify-between gap-4 py-3 border-b border-brand-100 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-brand-900">{title}</p>
                  <p className="text-xs text-brand-500 mt-0.5">{desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={prefs[key]}
                  aria-label={title}
                  onClick={() => toggle(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-1 ${
                    prefs[key] ? "bg-gold-500" : "bg-brand-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform ${
                      prefs[key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <Button onClick={handleSave} className="w-full mt-8">
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Preferences Saved
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </Reveal>

      {/* Saved Address */}
      <Reveal delay={0.15}>
        <div className="bg-surface rounded-lg border border-brand-200 p-8 mb-6">
          <h2 className="text-lg font-serif text-brand-900 mb-1">Delivery Address</h2>
          <p className="text-sm text-brand-500 mb-6">Used to pre-fill your details at checkout.</p>

          {hasAddress ? (
            <div className="flex items-start gap-3 p-4 bg-brand-50 rounded-lg">
              <MapPin className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-brand-700">
                <p>{user.address}</p>
                {(user.city || user.pincode) && (
                  <p className="text-brand-500">
                    {[user.city, user.pincode].filter(Boolean).join(" - ")}
                  </p>
                )}
                {user.phone && <p className="text-brand-500 mt-1">{user.phone}</p>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-400 mb-4">No address saved yet.</p>
          )}

          <Button variant="outline" className="w-full mt-4" asChild>
            <Link href="/account/profile">
              {hasAddress ? "Edit Address" : "Add Address"}
            </Link>
          </Button>
        </div>
      </Reveal>

      {/* Account */}
      <Reveal delay={0.2}>
        <div className="bg-surface rounded-lg border border-brand-200 p-8">
          <h2 className="text-lg font-serif text-brand-900 mb-1">Account</h2>
          <p className="text-sm text-brand-500 mb-6">Signed in as {user.email}</p>
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Reveal>
    </div>
  )
}
