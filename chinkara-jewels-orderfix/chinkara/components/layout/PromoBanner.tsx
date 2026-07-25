"use client"

const offers = [
  "Free shipping on orders above ₹999",
  "Flat 10% off on your first order — checkout via WhatsApp",
  "New arrivals dropping every week",
]

export function PromoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-brand-900 text-white overflow-hidden h-9 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex gap-16 text-xs tracking-wide">
        {[...offers, ...offers, ...offers].map((offer, i) => (
          <span key={i}>{offer}</span>
        ))}
      </div>
    </div>
  )
}
