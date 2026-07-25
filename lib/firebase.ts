// Firebase client setup for Google sign-in.
//
// All six NEXT_PUBLIC_FIREBASE_* vars must be present at BUILD time (Vercel →
// Settings → Environment Variables), because NEXT_PUBLIC_ values are inlined
// into the browser bundle when the site is compiled - not read at runtime.
// Adding them after a deploy does nothing until you redeploy.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// If the keys aren't set we deliberately do NOT initialise. The app still
// builds and the shop still works - only sign-in is unavailable, and useAuth
// shows a clear message instead of crashing the whole page.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
)

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  // getApps() guard prevents "Firebase App named '[DEFAULT]' already exists"
  // during Next.js fast refresh / repeated module evaluation.
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export const firebaseAuth = auth

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
