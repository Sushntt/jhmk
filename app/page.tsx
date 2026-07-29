import { Hero } from "@/components/sections/Hero"
import { Categories } from "@/components/sections/Categories"
import { NewArrivals } from "@/components/sections/NewArrivals"
import { Collections } from "@/components/sections/Collections"
import { BestSellers } from "@/components/sections/BestSellers"
import { BrandStory } from "@/components/sections/BrandStory"
import { CustomerReviews } from "@/components/sections/CustomerReviews"
import { TrustStrip } from "@/components/sections/TrustStrip"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <BestSellers />
      {/* Dark band after the two product carousels - gives the page a change of
          pace instead of pale sections stacked all the way down. */}
      <Collections />
      <CustomerReviews />
      {/* Delivery and support facts sit just before the brand story, where a
          shopper who has scrolled this far is weighing up whether to order. */}
      <TrustStrip />
      {/* Brand story closes the page. Reviews are empty until real screenshots
          arrive, so this makes sure the homepage never ends on a blank section. */}
      <BrandStory />
    </>
  )
}
