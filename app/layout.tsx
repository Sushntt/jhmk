import type { Metadata } from "next"
import { Cormorant_Garamond, Karla } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { PromoBanner } from "@/components/layout/PromoBanner"
import { Footer } from "@/components/layout/Footer"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { WishlistDrawer } from "@/components/layout/WishlistDrawer"
import { CartProvider } from "@/hooks/useCart"
import { WishlistProvider } from "@/hooks/useWishlist"
import { AuthProvider } from "@/hooks/useAuth"
import { MotionProvider } from "@/components/providers/MotionProvider"

// Display: Cormorant Garamond - high-contrast old-style serif. The thick/thin
// stroke modulation echoes fine metalwork, which suits a jewellery brand far
// better than Georgia (a screen-reading workhorse) did.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
})

// Body: Karla - a grotesque with slightly quirky letterforms. Chosen over Inter,
// which is on every AI-generated site and reads as a default rather than a choice.
const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chinkara | Premium Imitation Jewellery & Fashion",
  description: "Chennai-born Chinkara offers premium imitation jewellery and fashion, hand-picked from makers across India. Heritage, Fusion, and Minimal collections. Grace in every detail.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable}`}>
      <body className="font-sans antialiased bg-brand-50 text-brand-900">
        <MotionProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <PromoBanner />
              <Navbar />
              <CartDrawer />
              <WishlistDrawer />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
