import { Hero } from "@/components/sections/Hero"
import { Categories } from "@/components/sections/Categories"
import { NewArrivals } from "@/components/sections/NewArrivals"
import { BestSellers } from "@/components/sections/BestSellers"
import { CustomerReviews } from "@/components/sections/CustomerReviews"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <NewArrivals />
      <BestSellers />
      <CustomerReviews />
    </>
  )
}
