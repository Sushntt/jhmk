export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  tags: string[]
  inStock: boolean
  stockCount: number
  material?: string
  weight?: string
  dimensions?: string
  featured?: boolean
  newArrival?: boolean
  bestseller?: boolean
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress?: Address
  whatsappMessage?: string
}

export interface Address {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface User {
  id: string
  email: string
  name: string
  photoURL?: string
  phone?: string
  address?: string
  city?: string
  pincode?: string
  preferences?: {
    orderUpdates: boolean
    newArrivals: boolean
    offers: boolean
  }
  wishlist: string[]
  orders: string[]
  createdAt: string
}

export interface FAQItem {
  question: string
  answer: string
  category: string
}

export interface AnalyticsData {
  revenue: number
  orders: number
  customers: number
  avgOrderValue: number
  topProducts: { name: string; sales: number; revenue: number }[]
  revenueTrend: { date: string; revenue: number; orders: number }[]
  customerList: { id: string; name: string; email: string; orders: number; totalSpent: number }[]
}
