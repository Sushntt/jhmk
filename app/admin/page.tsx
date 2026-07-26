"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { formatPrice, formatDate } from "@/lib/utils"
import { TrendingUp, Users, ShoppingBag, DollarSign, Repeat } from "lucide-react"

interface CustomerSummary {
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  firstOrderAt: string
}

interface AnalyticsPayload {
  revenue: number
  orders: number
  pendingOrders: number
  pendingRevenue: number
  cancelledOrders: number
  customers: number
  repeatCustomers: number
  avgOrderValue: number
  topProducts: { name: string; sales: number; revenue: number }[]
  revenueTrend: { date: string; revenue: number; orders: number }[]
  customerList: CustomerSummary[]
  recentOrders: { id: string; customerName: string; total: number; status: string; createdAt: string }[]
}

function MiniBar({ value, max, color = "bg-gold-500" }: { value: number; max: number; color?: string }) {
  const pct = Math.max(5, (value / max) * 100)
  return (
    <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-[width] duration-700 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function RevenueTrendChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-brand-400">No revenue data yet.</p>
  }

  const W = 800
  const H = 220
  const PAD = { top: 16, right: 8, bottom: 28, left: 8 }
  const maxRevenue = Math.max(...data.map((d) => d.revenue))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  // With a single data point there's no line to draw, so render one centred bar.
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0
  const pointX = (i: number) => (data.length > 1 ? PAD.left + i * stepX : PAD.left + innerW / 2)
  const pointY = (v: number) => PAD.top + innerH - (maxRevenue > 0 ? (v / maxRevenue) * innerH : 0)

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${pointX(i)} ${pointY(d.revenue)}`).join(" ")
  const areaPath = `${linePath} L ${pointX(data.length - 1)} ${PAD.top + innerH} L ${pointX(0)} ${PAD.top + innerH} Z`

  const label = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })

  // Show at most 6 date labels so they never overlap
  const labelEvery = Math.max(1, Math.ceil(data.length / 6))

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Revenue over time">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + innerH * f}
            y2={PAD.top + innerH * f}
            stroke="currentColor"
            className="text-brand-100"
            strokeWidth={1}
          />
        ))}

        {data.length > 1 && (
          <>
            <path d={areaPath} className="fill-gold-500/10" />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              className="text-gold-500"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        {maxRevenue > 0 && (
          <text
            x={PAD.left + 4}
            y={PAD.top + 12}
            className="fill-brand-400"
            style={{ fontSize: 11 }}
          >
            {`Peak ${formatPrice(maxRevenue)}`}
          </text>
        )}

        {data.map((d, i) => (
          <circle
            key={d.date}
            cx={pointX(i)}
            cy={pointY(d.revenue)}
            r={3}
            className="fill-gold-600"
            vectorEffect="non-scaling-stroke"
          >
            <title>{`${label(d.date)} — ${formatPrice(d.revenue)} (${d.orders} order${d.orders > 1 ? "s" : ""})`}</title>
          </circle>
        ))}
      </svg>

      <div className="flex justify-between mt-2 px-1">
        {data
          .map((d, i) => ({ d, i }))
          .filter(({ i }) => i % labelEvery === 0)
          .map(({ d }) => (
            <span key={d.date} className="text-[10px] text-brand-400">
              {label(d.date)}
            </span>
          ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [source, setSource] = useState<"live" | "demo" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data)
        setSource(json.source)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-brand-500">
        Loading analytics...
      </div>
    )
  }

  if (!data) {
    return (
      <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center text-brand-500">
        Couldn't load analytics data.
      </div>
    )
  }

  const maxSales = Math.max(1, ...data.topProducts.map((p) => p.sales))
  const maxSpent = Math.max(1, ...data.customerList.map((c) => c.totalSpent))
  const oneTimeCustomers = data.customers - data.repeatCustomers

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-900">Analytics Dashboard</h1>
          <p className="text-brand-500 mt-1">Store performance overview</p>
        </div>
        <span
          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
            source === "live" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {source === "live" ? "Live data" : "Demo data — connect Airtable to see real numbers"}
        </span>
      </Reveal>

      {/* Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Confirmed Revenue", value: formatPrice(data.revenue), icon: DollarSign },
          { label: "Confirmed Orders", value: data.orders.toString(), icon: ShoppingBag },
          { label: "Customers", value: data.customers.toString(), icon: Users },
          { label: "Avg Order Value", value: formatPrice(data.avgOrderValue), icon: TrendingUp },
        ].map((kpi) => (
          <Reveal key={kpi.label}>
            <div className="bg-white p-6 rounded-lg border border-brand-200">
              <div className="p-2 bg-brand-100 rounded-lg w-fit mb-4">
                <kpi.icon className="w-5 h-5 text-brand-700" />
              </div>
              <p className="text-2xl font-medium text-brand-900 mb-1">{kpi.value}</p>
              <p className="text-xs text-brand-500">{kpi.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Pending orders need action - a row is written the moment a customer
          reaches WhatsApp, so these are enquiries, not confirmed sales. */}
      {data.pendingOrders > 0 && (
        <Reveal className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-yellow-900">
                {data.pendingOrders} order{data.pendingOrders > 1 ? "s" : ""} awaiting confirmation
                {" · "}
                {formatPrice(data.pendingRevenue)}
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Not counted in the figures above. Set Status to <strong>confirmed</strong> in
                Airtable once payment is received.
              </p>
            </div>
            {data.cancelledOrders > 0 && (
              <span className="text-xs text-yellow-700">
                {data.cancelledOrders} cancelled (excluded)
              </span>
            )}
          </div>
        </Reveal>
      )}

      {/* Revenue Trend */}
      <Reveal className="mb-12">
        <div className="bg-white p-6 rounded-lg border border-brand-200">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-medium text-brand-900">Revenue Trend</h2>
            <span className="text-xs text-brand-400">
              {data.revenueTrend.length > 0
                ? `Last ${data.revenueTrend.length} day${data.revenueTrend.length > 1 ? "s" : ""} with orders`
                : ""}
            </span>
          </div>
          <RevenueTrendChart data={data.revenueTrend} />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Top Products */}
        <Reveal>
          <div className="bg-white p-6 rounded-lg border border-brand-200">
            <h2 className="text-lg font-medium text-brand-900 mb-6">Top Selling Products</h2>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-brand-400">No sales yet.</p>
            ) : (
              <div className="space-y-4">
                {data.topProducts.map((product, i) => (
                  <div key={product.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-brand-400 w-4">#{i + 1}</span>
                        <span className="text-sm text-brand-900">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium text-brand-900">{product.sales} sold</span>
                    </div>
                    <MiniBar value={product.sales} max={maxSales} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Recent Orders */}
        <Reveal delay={0.1}>
          <div className="bg-white p-6 rounded-lg border border-brand-200">
            <h2 className="text-lg font-medium text-brand-900 mb-6">Recent Orders</h2>
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-brand-400">No orders yet.</p>
            ) : (
              <div className="space-y-4">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-brand-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-brand-900">{order.customerName}</p>
                      <p className="text-xs text-brand-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-900">{formatPrice(order.total)}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Customer Analytics */}
      <Reveal>
        <h2 className="text-2xl font-serif text-brand-900 mb-6">Customer Analytics</h2>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Reveal>
          <div className="bg-white p-6 rounded-lg border border-brand-200">
            <div className="p-2 bg-brand-100 rounded-lg w-fit mb-4">
              <Users className="w-5 h-5 text-brand-700" />
            </div>
            <p className="text-2xl font-medium text-brand-900 mb-1">{data.customers}</p>
            <p className="text-xs text-brand-500">Total Customers</p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="bg-white p-6 rounded-lg border border-brand-200">
            <div className="p-2 bg-brand-100 rounded-lg w-fit mb-4">
              <Repeat className="w-5 h-5 text-brand-700" />
            </div>
            <p className="text-2xl font-medium text-brand-900 mb-1">{data.repeatCustomers}</p>
            <p className="text-xs text-brand-500">Repeat Customers</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="bg-white p-6 rounded-lg border border-brand-200">
            <div className="p-2 bg-brand-100 rounded-lg w-fit mb-4">
              <Users className="w-5 h-5 text-brand-700" />
            </div>
            <p className="text-2xl font-medium text-brand-900 mb-1">{oneTimeCustomers}</p>
            <p className="text-xs text-brand-500">One-time Customers</p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="bg-white p-6 rounded-lg border border-brand-200">
          <h3 className="text-lg font-medium text-brand-900 mb-6">Top Customers</h3>
          {data.customerList.length === 0 ? (
            <p className="text-sm text-brand-400">No customers yet.</p>
          ) : (
            <div className="space-y-4">
              {data.customerList.slice(0, 8).map((customer) => (
                <div key={customer.email || customer.phone || customer.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm text-brand-900">{customer.name}</span>
                      <span className="text-xs text-brand-400 ml-2">{customer.phone || customer.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-brand-900">{formatPrice(customer.totalSpent)}</span>
                      <span className="text-xs text-brand-400 ml-2">
                        {customer.orders} order{customer.orders > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <MiniBar value={customer.totalSpent} max={maxSpent} color="bg-brand-700" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  )
}
