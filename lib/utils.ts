import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function generateWhatsAppMessage(
  items: { name: string; quantity: number; price: number }[],
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  totals: { subtotal: number; discount: number; shipping: number; total: number },
  couponCode?: string
): string {
  const itemList = items
    .map((item) => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
    .join("\n")

  const lines = [
    `*New Order from Chinkara*`,
    ``,
    `*Customer:* ${customerName}`,
    `*Phone:* ${customerPhone}`,
    `*Address:* ${customerAddress}`,
    ``,
    `*Order Items:*`,
    itemList,
    ``,
    `*Subtotal:* ${formatPrice(totals.subtotal)}`,
  ]

  if (totals.discount > 0) {
    lines.push(`*Discount${couponCode ? ` (${couponCode})` : ""}:* -${formatPrice(totals.discount)}`)
  }

  lines.push(`*Shipping:* ${formatPrice(totals.shipping)}`)
  lines.push(`*Total:* ${formatPrice(totals.total)}`)
  lines.push(``)
  lines.push(`Please confirm and share payment details.`)

  return encodeURIComponent(lines.join("\n"))
}
