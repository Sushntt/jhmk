import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { PromoBanner } from "@/components/layout/PromoBanner"
import { Footer } from "@/components/layout/Footer"
import { CartDrawer } from "@/components/layout/CartDrawer"
import { WishlistDrawer } from "@/components/layout/WishlistDrawer"
import { CartProvider } from "@/hooks/useCart"
import { WishlistProvider } from "@/hooks/useWishlist"
import { AuthProvider } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Chinkara | Premium Imitation Jewellery & Fashion",
  description: "Chennai-born Chinkara offers premium imitation jewellery and fashion, hand-picked from makers across India. Heritage, Fusion, and Minimal collections. Grace in every detail.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-brand-50 text-brand-900">
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
      </body>
    </html>
  )
}
