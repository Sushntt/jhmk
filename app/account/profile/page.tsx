"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { ArrowLeft, User, Check } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/shop")
    }
  }, [user, isLoading, router])

  // Seed the form from the saved profile once it's loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setAddress(user.address || "")
      setCity(user.city || "")
      setPincode(user.pincode || "")
    }
  }, [user])

  const handleSave = () => {
    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

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
        <h1 className="text-4xl font-serif text-brand-900 mb-8">Profile</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="bg-surface rounded-lg border border-brand-200 p-8">
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-brand-100">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-100 flex-shrink-0">
              {user.photoURL ? (
                <Image src={user.photoURL} alt={user.name} fill className="object-cover" />
              ) : (
                <User className="w-8 h-8 text-brand-400 mx-auto mt-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-brand-900 truncate">{user.name}</p>
              <p className="text-sm text-brand-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-brand-200 rounded-lg bg-brand-50 text-brand-500 cursor-not-allowed"
              />
              <p className="text-xs text-brand-400 mt-1">Email is linked to your sign-in and can&apos;t be changed here.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 90000 00000"
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Default Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="House / street / landmark"
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">PIN Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="110075"
                  className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full mt-8" size="lg">
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </Reveal>
    </div>
  )
}
