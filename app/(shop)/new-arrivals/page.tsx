import Link from "next/link"
import { getAllProducts } from "@/lib/data"
import { ProductCard } from "@/components/shop/ProductCard"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "New Arrivals | Chinkara",
  description: "The newest pieces to land at Chinkara — hand-picked imitation jewellery from makers across India.",
}

export default async function NewArrivalsPage() {
  const products = await getAllProducts()

  // ONLY products with the "New Arrival" checkbox ticked in Airtable - the page
  // has to match the NEW badge on the cards, otherwise ticking the box means
  // nothing. Newest first within that set.
  const list = products
    .filter((p) => p.newArrival)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 text-gold-600 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs tracking-[0.3em] uppercase">Just In</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-brand-900 mb-4">New Arrivals</h1>
        <p className="text-brand-500 text-sm sm:text-base max-w-md mx-auto">
          Fresh pieces land every week. These are the most recent to join the collection.
        </p>
      </Reveal>

      {list.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-brand-500 text-lg mb-2">Nothing new just yet</p>
          <p className="text-brand-400 text-sm mb-8">
            New pieces drop every week — check back shortly.
          </p>
          {/* Only visible while developing: tells whoever is testing why the
              page is empty rather than leaving them guessing. */}
          {process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-brand-400 mb-8">
              (No products have the &quot;New Arrival&quot; checkbox ticked in Airtable.)
            </p>
          )}
          <Button asChild>
            <Link href="/shop">Browse the Collection</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {list.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">View Everything</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
