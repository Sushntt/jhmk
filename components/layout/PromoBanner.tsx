"use client"

// Keep these consistent with the Shipping Policy page and the live coupon
// code in the checkout. "Free shipping" was removed because shipping is
// charged at ₹75 (Tamil Nadu) / ₹90 (rest of India) with no free threshold.
const offers = [
  "Pan-India delivery — dispatched in 1–3 business days",
  "Use code CHINKARA10 for 10% off — confirmed on WhatsApp",
  "New arrivals dropping every week",
  "Premium imitation jewellery, hand-picked across India",
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
