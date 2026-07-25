"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  User as FirebaseUser,
} from "firebase/auth"
import { User } from "@/types"
import { firebaseAuth, googleProvider, isFirebaseConfigured } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  authError: string | null
  signIn: () => Promise<void>
  signOut: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Profile fields the customer edits themselves (phone, address, preferences)
// live in localStorage keyed by Firebase UID. Firebase owns identity; we own
// the shipping details, so the two are stored separately.
const profileKey = (uid: string) => `chinkara-profile-${uid}`

function loadLocalProfile(uid: string): Partial<User> {
  try {
    return JSON.parse(localStorage.getItem(profileKey(uid)) || "{}")
  } catch {
    return {}
  }
}

function mapFirebaseUser(fbUser: FirebaseUser): User {
  const local = loadLocalProfile(fbUser.uid)
  return {
    id: fbUser.uid,
    email: fbUser.email || "",
    name: local.name || fbUser.displayName || "Customer",
    photoURL: fbUser.photoURL || undefined,
    phone: local.phone || fbUser.phoneNumber || undefined,
    address: local.address,
    city: local.city,
    pincode: local.pincode,
    preferences: local.preferences,
    wishlist: [],
    orders: [],
    createdAt: fbUser.metadata.creationTime
      ? new Date(fbUser.metadata.creationTime).toISOString()
      : new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setIsLoading(false)
      return
    }

    // Firebase restores the session itself, so there's no manual localStorage
    // rehydration here - this fires once on load with the existing user or null.
    const unsubscribe = onAuthStateChanged(firebaseAuth, (fbUser) => {
      setUser(fbUser ? mapFirebaseUser(fbUser) : null)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async () => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setAuthError("Sign-in isn't set up yet. Please contact us on WhatsApp to place your order.")
      return
    }

    setAuthError(null)
    setIsLoading(true)
    try {
      await signInWithPopup(firebaseAuth, googleProvider)
      // onAuthStateChanged above sets the user; nothing to do here.
    } catch (err: any) {
      const code = err?.code || ""
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setAuthError(null) // user backed out on purpose, not an error worth showing
      } else if (code === "auth/unauthorized-domain") {
        setAuthError("This domain isn't authorised in Firebase yet. Add it under Authentication → Settings → Authorized domains.")
      } else if (code === "auth/popup-blocked") {
        setAuthError("Your browser blocked the sign-in popup. Allow popups for this site and try again.")
      } else {
        setAuthError("Sign-in failed. Please try again.")
      }
      console.error("Firebase sign-in failed:", err)
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(() => {
    if (firebaseAuth) fbSignOut(firebaseAuth).catch((e) => console.error("Sign out failed:", e))
    setUser(null)
  }, [])

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null
      const next = { ...prev, ...data }
      try {
        localStorage.setItem(
          profileKey(prev.id),
          JSON.stringify({
            name: next.name,
            phone: next.phone,
            address: next.address,
            city: next.city,
            pincode: next.pincode,
            preferences: next.preferences,
          })
        )
      } catch (e) {
        console.error("Failed to save profile locally:", e)
      }
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, authError, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
