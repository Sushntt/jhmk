import { Hero } from "@/components/sections/Hero"
import { Categories } from "@/components/sections/Categories"
import { NewArrivals } from "@/components/sections/NewArrivals"
import { Collections } from "@/components/sections/Collections"
import { BestSellers } from "@/components/sections/BestSellers"
import { BrandStory } from "@/components/sections/BrandStory"
import { CustomerReviews } from "@/components/sections/CustomerReviews"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      {/* Dark band between the two product carousels - gives the page a change
          of pace instead of four pale sections stacked in a row. */}
      <Collections />
      <BestSellers />
      <CustomerReviews />
      {/* Brand story closes the page. Reviews are empty until real screenshots
          arrive, so this makes sure the homepage never ends on a blank section. */}
      <BrandStory />
    </>
  )
}
