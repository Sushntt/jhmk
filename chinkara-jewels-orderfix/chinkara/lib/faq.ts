import { siteConfig } from "@/lib/site-config"

export interface FAQItem {
  category: string
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  // ---------- Ordering ----------
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "Browse the catalogue and add the pieces you like to your bag. At checkout you'll confirm your name, phone number, and delivery address, and your order opens as a pre-filled message in WhatsApp. Send it to us and we'll confirm availability, payment, and delivery details right there in chat.",
  },
  {
    category: "Ordering",
    question: "Why does my order finish on WhatsApp?",
    answer:
      "We keep ordering personal. On WhatsApp we can confirm real-time availability, share extra photos or videos of the exact piece, and answer styling questions before you pay — something a standard online checkout can't do.",
  },
  {
    category: "Ordering",
    question: "How do I pay?",
    answer:
      "We accept UPI (Google Pay, PhonePe, Paytm) and bank transfer. Payment details are shared on WhatsApp once your order is confirmed. We dispatch after payment is received. We do not offer cash on delivery.",
  },

  // ---------- Products & Care ----------
  {
    category: "Products & Care",
    question: "Is your jewellery real gold?",
    answer:
      "No — Chinkara specialises in premium imitation (fashion) jewellery. Our pieces use quality base metals with gold-tone, antique, and rhodium finishes, offering the look of fine jewellery at a fraction of the price.",
  },
  {
    category: "Products & Care",
    question: "How do I care for my jewellery?",
    answer:
      "Keep pieces away from water, perfume, and sweat; wear them last when dressing. Store each piece in its pouch or a dry, airtight box. Wipe gently with a soft dry cloth after use. With this care, finishes stay bright for much longer.",
  },
  {
    category: "Products & Care",
    question: "Will the colour fade?",
    answer:
      "All imitation jewellery finishes evolve with time and use. With proper care, our pieces are made to look beautiful for many wears. We photograph every product honestly, with no heavy filters, so what you see is what arrives.",
  },

  // ---------- Shipping & Returns ----------
  {
    category: "Shipping & Returns",
    question: "Do you ship across India?",
    answer:
      "Yes, we ship pan-India via trusted courier partners. Tracking details are shared on WhatsApp once your order is dispatched.",
  },
  {
    category: "Shipping & Returns",
    question: "How long does delivery take?",
    answer: `Orders are dispatched within ${siteConfig.shipping.dispatchDays} of payment. Delivery typically takes ${siteConfig.shipping.deliveryChennai} in Chennai and ${siteConfig.shipping.deliveryIndia} elsewhere in India.`,
  },
  {
    category: "Shipping & Returns",
    question: "What if my order arrives damaged?",
    answer:
      "We're happy to replace it. Please record a clear, uncut unboxing video when opening your parcel and send it to us on WhatsApp within 24 hours of delivery. See our Refund & Replacement Policy for full details.",
  },
  {
    category: "Shipping & Returns",
    question: "Can I return a piece if I change my mind?",
    answer:
      "For hygiene reasons, jewellery cannot be returned or exchanged once delivered, except in cases of damage or a wrong item shipped. Do ask us for extra photos, videos, or measurements before ordering — we're glad to share them.",
  },
]
