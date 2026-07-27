"use client"

import { Truck, Clock, MessageCircle } from "lucide-react"
import { Reveal } from "@/components/animations/Reveal"
import { siteConfig } from "@/lib/site-config"

// Every claim here is drawn from siteConfig, which mirrors the Shipping Policy
// page. Nothing is invented - in particular there is no "free shipping" line,
// because shipping is charged at a flat rate with no free threshold.
const items = [
  {
    icon: Truck,
    title: "Pan-India Delivery",
    body: `₹${siteConfig.shipping.tamilNadu} within Tamil Nadu, ₹${siteConfig.shipping.restOfIndia} elsewhere in India`,
  },
  {
    icon: Clock,
    title: "Quick Dispatch",
    body: `Sent within ${siteConfig.shipping.dispatchDays} of payment, with tracking`,
  },
  {
    icon: MessageCircle,
    title: "Talk to Us",
    body: `${siteConfig.supportHours} on WhatsApp`,
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-brand-200 bg-surface-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          {items.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex sm:flex-col sm:items-center sm:text-center gap-4 sm:gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-100 text-gold-700 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-brand-900 leading-snug">{title}</h3>
                  <p className="text-sm text-brand-500 mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
