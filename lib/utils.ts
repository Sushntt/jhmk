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
  total: number,
  customerName: string,
  customerPhone: string,
  customerAddress: string
): string {
  const itemList = items
    .map((item) => `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
    .join("\n")

  return encodeURIComponent(
    `*New Order from Chinkara Jewels*\n\n` +
    `*Customer:* ${customerName}\n` +
    `*Phone:* ${customerPhone}\n` +
    `*Address:* ${customerAddress}\n\n` +
    `*Order Items:*\n${itemList}\n\n` +
    `*Total:* ${formatPrice(total)}\n\n` +
    `Please confirm availability and share payment details.`
  )
}
