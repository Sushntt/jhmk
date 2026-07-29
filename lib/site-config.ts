// Single source of truth for business details.
// These were previously hardcoded in five different files, which is how the
// site ended up showing a Jaipur address and the wrong WhatsApp number.
// Change them here only.

export const siteConfig = {
  name: "Chinkara",
  tagline: "Grace in Every Detail",

  // WhatsApp orders & support. Country code, no "+" - wa.me needs it this way.
  whatsappNumber: "917200661501",
  whatsappDisplay: "+91 72006 61501",

  email: "chinkarajewellery@gmail.com",
  instagram: "chinkara_jewels",
  instagramUrl: "https://www.instagram.com/chinkara_jewels/",

  location: "Chennai, Tamil Nadu, India",
  supportHours: "Mon–Sat, 10 AM – 7 PM IST",

  shipping: {
    tamilNadu: 75,
    restOfIndia: 90,
    dispatchDays: "1–3 business days",
    deliveryChennai: "2–4 business days",
    deliveryIndia: "4–7 business days",
  },
} as const

// The site's WhatsApp number can still be overridden per-deployment via env,
// falling back to the value above.
export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsappNumber
