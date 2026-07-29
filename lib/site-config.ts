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


// Homepage category tiles, in display order.
//
// `match` values are compared case-insensitively against a product's Category
// field in Airtable, so a tile picks up its image from the first product in
// that category automatically. Add the same names as Category options in the
// Airtable Products table or the tile will link to an empty filter.
export const homeCategories: { name: string; match: string[]; fallback?: string }[] = [
  { name: "Premium Necklaces", match: ["premium necklace", "premium necklaces"], fallback: "/images/collection-necklaces.jpg" },
  { name: "Budget Friendly Neckpieces", match: ["budget friendly neckpieces", "budget neckpieces", "budget friendly neckpiece"] },
  { name: "Harams & Sets", match: ["harams and sets", "harams & sets", "haram", "harams"] },
  { name: "Premium Earrings", match: ["premium earrings", "premium earring"] },
  { name: "Budget Friendly Earrings", match: ["budget friendly earrings", "budget earrings"] },
  { name: "Oxidised Earrings", match: ["oxidised earrings", "oxidized earrings", "oxidised earring"] },
  { name: "Micro Gold Plated Bangles", match: ["micro gold plated bangles", "micro gold bangles", "bangles", "bangle"] },
  { name: "Bracelets", match: ["bracelets", "bracelet"], fallback: "/images/collection-bracelets.jpg" },
  { name: "Anklets", match: ["anklets", "anklet"] },
]
