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
  createdAt: string
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
                <div className="p-6 border-b border-brand-100">
                  <p className="text-sm text-brand-500 mb-1">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-brand-400">{formatDate(order.createdAt)}</p>
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
