"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Reveal } from "@/components/animations/Reveal"
import { formatPrice, formatDate } from "@/lib/utils"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

interface OrderRecord {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  items: { productId?: string; name: string; quantity: number; price: number }[]
  total: number
  status: string
  createdAt: string
  createdTime: string
}

// Status is controlled entirely from the Status column in the Airtable Orders
// table - changing it there updates what the customer sees here. Keys are
// lowercased on lookup so "Pending", "pending" and "PENDING" all match.
const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Confirmed", className: "text-blue-700 bg-blue-50 border-blue-200" },
  shipped: { label: "Shipped", className: "text-purple-700 bg-purple-50 border-purple-200" },
  delivered: { label: "Delivered", className: "text-green-700 bg-green-50 border-green-200" },
  cancelled: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200" },
}

// "Created At" is written as a readable IST string for the client's benefit.
// Legacy rows still hold an ISO timestamp, so those get formatted instead of
// being shown raw.
function displayDate(order: { createdAt: string; createdTime: string }): string {
  const raw = order.createdAt || order.createdTime
  const looksISO = /^\d{4}-\d{2}-\d{2}T/.test(raw)
  return looksISO ? formatDate(raw) : raw
}

function StatusBadge({ status }: { status: string }) {
  const key = (status || "pending").trim().toLowerCase()
  // Unknown values still render rather than disappearing, so a typo in Airtable
  // is visible instead of silently showing nothing.
  const style = STATUS_STYLES[key] || {
    label: status || "Pending",
    className: "text-brand-600 bg-brand-50 border-brand-200",
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/shop")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return

    const params = new URLSearchParams()
    if (user.email) params.set("email", user.email)
    if (user.phone) params.set("phone", user.phone)

    setLoadingOrders(true)
    fetch(`/api/orders/mine?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user])

  if (isLoading) {
    return (
      <div className="pt-36 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Reveal>
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-brand-500 hover:text-brand-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>
        <h1 className="text-4xl font-serif text-brand-900 mb-8">Order History</h1>
      </Reveal>

      <div className="space-y-6">
        {loadingOrders ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-brand-900 border-t-transparent rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <Reveal>
            <div className="text-center py-16 bg-white rounded-lg border border-brand-200">
              <Package className="w-16 h-16 text-brand-300 mx-auto mb-4" />
              <p className="text-brand-500 text-lg">No orders yet</p>
              <p className="text-brand-400 text-sm mt-2">Your order history will appear here</p>
            </div>
          </Reveal>
        ) : (
          orders.map((order, i) => (
            <Reveal key={order.id} delay={i * 0.1}>
              <div className="bg-white rounded-lg border border-brand-200 overflow-hidden">
                <div className="p-6 border-b border-brand-100 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-brand-500 mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-brand-400">{displayDate(order)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={`${order.id}-${idx}`} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-900 truncate">{item.name}</p>
                          <p className="text-xs text-brand-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-brand-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-brand-100 flex justify-between items-center">
                    <span className="text-sm text-brand-500">Total</span>
                    <span className="text-lg font-medium text-brand-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </div>
  )
}
