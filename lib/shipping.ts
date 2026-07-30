import { siteConfig } from "@/lib/site-config"

// Indian states and union territories for the checkout dropdown.
// Free text can't drive a shipping rate reliably - "TN", "Tamilnadu" and
// "tamil nadu" would all need handling - so the customer picks from this list
// and the rate follows from the selection.
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

export const TAMIL_NADU = "Tamil Nadu"

/**
 * Flat shipping rate, decided only by whether the order is going to Tamil Nadu.
 * Returns 0 when no state has been picked yet, so the checkout can show
 * "Select a state" instead of quoting a figure it can't know.
 */
export function shippingForState(state: string): number {
  const s = (state || "").trim()
  if (!s) return 0
  return s === TAMIL_NADU ? siteConfig.shipping.tamilNadu : siteConfig.shipping.restOfIndia
}

/**
 * Joins the separate address inputs into one line for Airtable and the WhatsApp
 * message. Empty parts are dropped so there are no stray commas.
 */
export function formatAddress(parts: {
  doorNo?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  pincode?: string
}): string {
  const head = [parts.doorNo, parts.line1, parts.line2, parts.city]
    .map((v) => (v || "").trim())
    .filter(Boolean)
    .join(", ")

  const tail = [(parts.state || "").trim(), (parts.pincode || "").trim()]
    .filter(Boolean)
    .join(" - ")

  return [head, tail].filter(Boolean).join(", ")
}
