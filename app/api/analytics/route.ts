import { NextResponse } from "next/server"
import { getOrders, isAirtableConfigured, type AirtableOrderRecord } from "@/lib/airtable"
import { mockOrders } from "@/lib/mock-data"

export const dynamic = "force-dynamic"

interface CustomerSummary {
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  firstOrderAt: string
}

// A row is written to Airtable the moment a customer clicks through to
// WhatsApp - before any payment is taken. Counting those as sales would show
// the client revenue they have not received, so "pending" is reported
// separately and "cancelled" is excluded from the figures entirely.
const CONFIRMED_STATUSES = ["confirmed", "shipped", "delivered"]

function statusOf(o: AirtableOrderRecord) {
  return (o.status || "pending").trim().toLowerCase()
}

function computeAnalytics(allOrders: AirtableOrderRecord[]) {
  const active = allOrders.filter((o) => statusOf(o) !== "cancelled")
  const pending = active.filter((o) => !CONFIRMED_STATUSES.includes(statusOf(o)))
  // Confirmed sales drive every headline number below.
  const orders = active.filter((o) => CONFIRMED_STATUSES.includes(statusOf(o)))

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

  const pendingOrders = pending.length
  const pendingRevenue = pending.reduce((sum, o) => sum + o.total, 0)
  const cancelledOrders = allOrders.length - active.length

  // Customers grouped by a stable identity key. Email (from Google sign-in) is
  // preferred; phone is normalised to its last 10 digits first, otherwise
  // "+91 98683 66997" and "9868366997" would count as two different people and
  // inflate the customer count while destroying the repeat-customer figure.
  const normalisePhone = (p: string) => p.replace(/\D/g, "").slice(-10)

  const customerMap = new Map<string, CustomerSummary>()
  for (const order of orders) {
    const email = (order.email || "").trim().toLowerCase()
    const phone = normalisePhone(order.phone || "")
    const key = email || phone || order.customerName.trim().toLowerCase()

    const existing = customerMap.get(key)
    if (existing) {
      existing.orders += 1
      existing.totalSpent += order.total
      if (order.createdTime < existing.firstOrderAt) existing.firstOrderAt = order.createdTime
      // Backfill contact details from whichever order happens to carry them
      if (!existing.email && email) existing.email = email
      if (!existing.phone && order.phone) existing.phone = order.phone
    } else {
      customerMap.set(key, {
        name: order.customerName,
        email,
        phone: order.phone,
        orders: 1,
        totalSpent: order.total,
        firstOrderAt: order.createdTime,
      })
    }
  }
  const customerList = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent)
  const totalCustomers = customerList.length
  const repeatCustomers = customerList.filter((c) => c.orders > 1).length

  // Top products by units sold, parsed from each order's item list
  const productSales = new Map<string, { name: string; sales: number; revenue: number }>()
  for (const order of orders) {
    for (const item of order.items) {
      const existing = productSales.get(item.name)
      const revenue = item.price * item.quantity
      if (existing) {
        existing.sales += item.quantity
        existing.revenue += revenue
      } else {
        productSales.set(item.name, { name: item.name, sales: item.quantity, revenue })
      }
    }
  }
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Revenue trend by day
  const trendMap = new Map<string, { revenue: number; orders: number }>()
  for (const order of orders) {
    const date = order.createdTime.slice(0, 10)
    const existing = trendMap.get(date)
    if (existing) {
      existing.revenue += order.total
      existing.orders += 1
    } else {
      trendMap.set(date, { revenue: order.total, orders: 1 })
    }
  }
  const revenueTrend = Array.from(trendMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)

  // Recent orders shows EVERY order - pending, confirmed and cancelled. The
  // figures above exclude pending and cancelled, but this list is the client's
  // working view of what has come in, so nothing is hidden from it.
  // Sorted on ISO createdTime because "Created At" is a readable string.
  const recentOrders = [...allOrders]
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime))
    .slice(0, 10)

  return {
    revenue: totalRevenue,
    orders: totalOrders,
    // Surfaced so the dashboard can show what still needs confirming - these
    // were being computed and then thrown away.
    pendingOrders,
    pendingRevenue,
    cancelledOrders,
    customers: totalCustomers,
    repeatCustomers,
    avgOrderValue,
    topProducts,
    revenueTrend,
    customerList,
    recentOrders,
  }
}

export async function GET() {
  if (isAirtableConfigured) {
    try {
      const orders = await getOrders()
      return NextResponse.json({ source: "live", data: computeAnalytics(orders) })
    } catch (err) {
      console.error("Failed to load live analytics, falling back to demo data:", err)
    }
  }

  // Demo fallback so the dashboard is still usable before Airtable is wired up
  const demoOrders: AirtableOrderRecord[] = mockOrders.map((o) => ({
    id: o.id,
    customerName: o.userId,
    email: `${o.userId}@demo.local`,
    phone: o.userId,
    address: "",
    items: o.items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
    total: o.total,
    status: o.status,
    stockDeducted: true,
    createdAt: o.createdAt,
    createdTime: o.createdAt,
  }))

  return NextResponse.json({ source: "demo", data: computeAnalytics(demoOrders) })
}
