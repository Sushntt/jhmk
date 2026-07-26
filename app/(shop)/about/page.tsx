import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "About Us | Chinkara",
  description:
    "Chinkara is a Chennai-born brand offering premium imitation jewellery and fashion, hand-picked from makers across India.",
}

const collections = [
  {
    name: "Heritage",
    description:
      "Traditional South Indian and pan-Indian styles: temple-inspired pieces, antique finishes, and festive classics.",
  },
  {
    name: "Fusion",
    description: "Pieces that pair a saree as easily as they pair denim.",
  },
  {
    name: "Minimal",
    description: "Clean, western-leaning everyday jewellery for work and casual wear.",
  },
]

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Intro */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center mb-20">
        <Reveal>
          <p className="text-sm tracking-[0.3em] uppercase text-gold-600 mb-4">About Us</p>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-900 mb-8">
            Grace in Every Detail
          </h1>
          <div className="space-y-6 text-brand-600 leading-relaxed text-left sm:text-center">
            <p>
              Chinkara takes its name from the Indian gazelle — a creature known for its lightness,
              alertness, and quiet elegance. It is the spirit we bring to everything we make and
              curate: jewellery and fashion that moves gracefully with you, whether you are dressing
              for a temple festival, a boardroom, or a Sunday brunch.
            </p>
            <p>
              We are a Chennai-born brand, founded by two friends, Kavya and Sandhiya, who believed
              that beautiful, well-finished imitation jewellery shouldn&apos;t require a treasure
              hunt — or a treasure chest. Each piece is hand-picked from the regions famous for that
              craft, through makers we have carefully vetted across India and beyond.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Founders */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-900 mb-3">The Founders</h2>
          <p className="text-brand-500 text-sm max-w-xl mx-auto">
            Two friends from Chennai, Kavya and Sandhiya, who hand-pick every piece Chinkara carries.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {["founder-1", "founder-2"].map((file, i) => (
            <Reveal key={file} delay={i * 0.1}>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-brand-100">
                <Image
                  src={`/images/founders/${file}.jpg`}
                  alt="Chinkara founder"
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-24">
        <Reveal className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-brand-900 mb-3">Our Collections</h2>
          <p className="text-brand-500 text-sm">Our collections span three moods.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <div className="text-center p-8 bg-surface rounded-lg border border-brand-100 h-full">
                <h3 className="text-xl font-serif text-brand-900 mb-3">{c.name}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{c.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promise */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="py-12 border-t border-b border-brand-100">
            <p className="text-brand-600 leading-relaxed mb-6">
              Every order is checked, packed, and dispatched by us personally — from our thank-you
              cards to our wrapping paper, we sweat the small stuff. Because for us, grace really is
              in every detail.
            </p>
            <p className="text-sm text-brand-400 mb-8">{siteConfig.location}</p>
            <Button asChild size="lg">
              <Link href="/shop">Explore the Collection</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
