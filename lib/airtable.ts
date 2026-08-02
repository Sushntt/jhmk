// Airtable data layer for real Orders + Products (powers the shop, product pages,
// stock tracking, and the analytics dashboard).
//
// Setup required in your Airtable base:
//
// 1) "Products" table with these fields:
//   - Name            (Single line text)
//   - Slug            (Single line text) — leave blank to auto-generate from Name
//   - Description     (Long text)
//   - Price           (Number)
//   - Original Price  (Number, optional — shows a strikethrough price when set)
//   - Images          (Attachment field — upload the product photos here. "Image" also works.)
//   - Category        (Single select: Necklaces, Bangles, Anklets, Bracelets)
//   - Colour          (Single select, optional) -- ONE colour per row. To sell a
//                     piece in several colours, create one row per colour with
//                     the SAME Name. The site groups them into a single product
//                     with colour buttons, and each row keeps its own stock,
//                     price and photos. Leave blank for single-colour pieces.
//   - Subcategory     (Single line text, optional)
//   - Tags            (Single line text, optional — comma separated, e.g. "gold,minimal")
//   - Stock           (Number) — this is what drives "OUT OF STOCK"
//   - Material        (Single line text, optional)
//   - Featured        (Checkbox)
//   - Bestseller      (Checkbox)
//   - New Arrival     (Checkbox)
//
// 2) "Orders" table with these fields:
//   - Customer Name   (Single line text)
//   - Email           (Single line text) -- signed-in user's email, used to match order history
//   - Phone           (Single line text)
//   - Address         (Long text) -- delivery address for the order
//   - Items           (Long text)   -> JSON string: [{ productId, name, quantity, price }]
//   - Total           (Number)
//   - Status          (Single select: pending, confirmed, shipped, delivered, cancelled)
//   - Created At       (Single line text) -> ISO date string, e.g. 2025-07-20T10:00:00Z
//
// No separate "Customers" table is needed — customers are derived from Orders
// by grouping on phone number.

import { Product } from "@/types"
import { generateSlug } from "@/lib/utils"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const ORDERS_TABLE = "Orders"
const PRODUCTS_TABLE = "Products"

export const isAirtableConfigured = Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID)

export interface AirtableOrderRecord {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  items: { productId?: string; name: string; quantity: number; price: number }[]
  total: number
  status: string
  stockDeducted: boolean
  createdAt: string
  createdTime: string
}

async function airtableRequest(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Airtable request failed (${res.status}): ${body}`)
  }

  return res.json()
}

// Orders written before the readable format was introduced stored raw JSON.
// We still parse that, so existing rows keep working, but new orders are
// written as plain readable lines the client can actually scan in Airtable:
//   Kiran Threader Earrings  x1  -  Rs 2,600
function parseItems(raw: string | undefined): AirtableOrderRecord["items"] {
  if (!raw) return []

  // Legacy JSON format
  const trimmed = raw.trim()
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // fall through to text parsing
    }
  }

  // Readable format
  const items: AirtableOrderRecord["items"] = []
  for (const line of trimmed.split("\n")) {
    const text = line.trim()
    if (!text) continue

    // "Name  x2  -  Rs 2,600"  (the amount shown is the LINE TOTAL, so divide
    // by quantity to recover the unit price the rest of the app expects)
    const match = text.match(/^(.*?)\s+x(\d+)\s+-\s+Rs\s*([\d,]+)/i)
    if (match) {
      const quantity = parseInt(match[2], 10) || 1
      const lineTotal = parseInt(match[3].replace(/,/g, ""), 10) || 0
      items.push({
        name: match[1].trim(),
        quantity,
        price: Math.round(lineTotal / quantity),
      })
    } else {
      // Unrecognised line - keep the text rather than dropping the item
      items.push({ name: text, quantity: 1, price: 0 })
    }
  }
  return items
}

// Renders order items as readable lines for the Airtable "Items" column.
function formatItemsForAirtable(
  items: { name: string; quantity: number; price: number }[]
): string {
  return items
    .map((i) => `${i.name}  x${i.quantity}  -  Rs ${(i.price * i.quantity).toLocaleString("en-IN")}`)
    .join("\n")
}

// Readable IST timestamp for the Airtable "Created At" column, e.g.
// "26 Jul 2026, 01:31 AM". Sorting never relies on this string - Airtable's
// own record createdTime is used for that.
function formatDateForAirtable(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
}

function mapProduct(rec: any): Product {
  const f = rec.fields
  const stockCount = typeof f["Stock"] === "number" ? f["Stock"] : 0
  const imageField = f["Images"] || f["Image"]
  const images = Array.isArray(imageField)
    ? imageField.map((img: any) => img?.url).filter((url: any) => typeof url === "string" && url.length > 0)
    : []

  return {
    id: rec.id,
    name: f["Name"] || "Untitled",
    slug: f["Slug"] || generateSlug(f["Name"] || rec.id),
    description: f["Description"] || "",
    price: f["Price"] || 0,
    originalPrice: f["Original Price"] || undefined,
    images: images.length > 0 ? images : ["/images/product-1.jpg"],
    category: f["Category"] || "Uncategorized",
    subcategory: f["Subcategory"] || undefined,
    tags: f["Tags"] ? String(f["Tags"]).split(",").map((t: string) => t.trim()) : [],
    inStock: stockCount > 0,
    stockCount,
    colour: String(f["Colour"] || "").trim() || undefined,
    material: f["Material"] || undefined,
    featured: !!f["Featured"],
    newArrival: !!f["New Arrival"],
    bestseller: !!f["Bestseller"],
    createdAt: f["Created At"] || rec.createdTime,
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!isAirtableConfigured) {
    throw new Error("Airtable is not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID)")
  }

  const records: Product[] = []
  let offset: string | undefined

  do {
    const query = offset ? `?offset=${offset}` : ""
    const data = await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}${query}`)
    for (const rec of data.records || []) {
      records.push(mapProduct(rec))
    }
    offset = data.offset
  } while (offset)

  return records
}

// Reduces stock for each ordered item by its quantity (never below 0).
// Called right after an order is logged so "OUT OF STOCK" reflects reality.
export interface StockResult {
  productId: string
  ok: boolean
  error?: string
}

export async function decrementStock(
  items: { productId?: string; quantity: number }[]
): Promise<StockResult[]> {
  const results: StockResult[] = []
  if (!isAirtableConfigured) return results

  for (const item of items) {
    if (!item.productId) {
      console.error("Skipped stock deduction: order item is missing a productId", item)
      continue
    }
    try {
      const rec = await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}/${item.productId}`)
      const currentStock = typeof rec.fields["Stock"] === "number" ? rec.fields["Stock"] : 0
      const newStock = Math.max(0, currentStock - item.quantity)

      await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}/${item.productId}`, {
        method: "PATCH",
        body: JSON.stringify({ fields: { Stock: newStock } }),
      })
      results.push({ productId: item.productId, ok: true })
    } catch (err: any) {
      console.error(`Failed to decrement stock for product ${item.productId}:`, err)
      results.push({ productId: item.productId, ok: false, error: err?.message || String(err) })
    }
  }

  return results
}

export async function getOrders(): Promise<AirtableOrderRecord[]> {
  if (!isAirtableConfigured) {
    throw new Error("Airtable is not configured (missing AIRTABLE_API_KEY / AIRTABLE_BASE_ID)")
  }

  const records: AirtableOrderRecord[] = []
  let offset: string | undefined

  do {
    const query = offset ? `?offset=${offset}` : ""
    const data = await airtableRequest(`${encodeURIComponent(ORDERS_TABLE)}${query}`)

    for (const rec of data.records || []) {
      records.push({
        id: rec.id,
        customerName: rec.fields["Customer Name"] || "Unknown",
        email: rec.fields["Email"] || "",
        phone: rec.fields["Phone"] || "",
        address: rec.fields["Address"] || "",
        items: parseItems(rec.fields["Items"]),
        total: rec.fields["Total"] || 0,
        status: rec.fields["Status"] || "pending",
        stockDeducted: !!rec.fields["Stock Deducted"],
        createdAt: rec.fields["Created At"] || rec.createdTime,
        // Airtable always supplies createdTime as ISO - used for sorting so a
        // human-readable "Created At" string can never break date ordering.
        createdTime: rec.createdTime,
      })
    }

    offset = data.offset
  } while (offset)

  return records
}

export async function createOrder(order: {
  customerName: string
  email?: string
  phone: string
  address?: string
  items: { productId?: string; name: string; quantity: number; price: number }[]
  total: number
}) {
  if (!isAirtableConfigured) {
    // Silently no-op in environments without Airtable configured (e.g. local preview)
    // so checkout still works via WhatsApp even before the base is set up.
    return null
  }

  let result = null
  let orderError: string | null = null
  try {
    result = await airtableRequest(encodeURIComponent(ORDERS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          "Customer Name": order.customerName,
          Email: order.email || "",
          Phone: order.phone,
          Address: order.address || "",
          Items: formatItemsForAirtable(order.items),
          Total: order.total,
          Status: "pending",
          "Created At": formatDateForAirtable(new Date()),
        },
      }),
    })
  } catch (err: any) {
    // Don't let a failure writing the Orders record (e.g. a mismatched field
    // name/type in the base) silently block stock deduction below - the two
    // are independent and stock should still reflect reality either way.
    // The message is returned to the caller so the cause is visible without
    // having to dig through server logs.
    orderError = err?.message || String(err)
    console.error("Failed to write order record to Airtable Orders table:", err)
  }

  // NOTE: stock is deliberately NOT deducted here. Reaching WhatsApp is not the
  // same as placing an order - shoppers abandon at that step all the time, and
  // deducting on click made pieces show as sold out that were never sold.
  // Deduction happens in /api/sync-stock once the order Status is "confirmed".
  return { order: result, orderError, stockResults: [] as StockResult[] }
}


// Diagnostic helper: writes a row to the Orders table using the exact field
// names checkout uses, then deletes it. Any mismatch in table name, field name,
// or field type surfaces here as a readable Airtable error.
export async function createTestOrderRecord(): Promise<string> {
  const created = await airtableRequest(encodeURIComponent(ORDERS_TABLE), {
    method: "POST",
    body: JSON.stringify({
      fields: {
        "Customer Name": "TEST - safe to delete",
        Email: "test@example.com",
        Phone: "0000000000",
        Address: "Test address",
        Items: formatItemsForAirtable([{ name: "Test item", quantity: 1, price: 0 }]),
        Total: 0,
        Status: "pending",
        "Created At": formatDateForAirtable(new Date()),
      },
    }),
  })

  // Clean up so the client never sees a stray test row
  try {
    await airtableRequest(`${encodeURIComponent(ORDERS_TABLE)}/${created.id}`, { method: "DELETE" })
  } catch (err) {
    console.error("Test order row created but could not be deleted:", err)
  }

  return created.id
}


// Marks an order as having had its stock taken off, so a retry or a second cron
// run can never deduct the same order twice.
export async function markStockDeducted(orderId: string): Promise<void> {
  await airtableRequest(`${encodeURIComponent(ORDERS_TABLE)}/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: { "Stock Deducted": true } }),
  })
}


export interface StockCheckItem {
  productId?: string
  name: string
  quantity: number
}

export interface StockCheckResult {
  name: string
  requested: number
  available: number
  ok: boolean
}

/**
 * Reads live stock for the items in an order, right before the customer is sent
 * to WhatsApp.
 *
 * This closes most of the two-shoppers-one-piece window. It cannot close all of
 * it - stock only comes off once an order is CONFIRMED, so two people can still
 * reach WhatsApp for the same last piece within the same few minutes. That is
 * inherent to confirming orders by hand, and the client resolves it in chat.
 * What this does prevent is someone ordering a piece that has already been sold
 * and confirmed to somebody else.
 */
export async function checkStock(items: StockCheckItem[]): Promise<StockCheckResult[]> {
  if (!isAirtableConfigured) return []

  const results: StockCheckResult[] = []

  for (const item of items) {
    if (!item.productId) continue
    try {
      const rec = await airtableRequest(`${encodeURIComponent(PRODUCTS_TABLE)}/${item.productId}`)
      const available = typeof rec.fields["Stock"] === "number" ? rec.fields["Stock"] : 0
      results.push({
        name: item.name,
        requested: item.quantity,
        available,
        ok: available >= item.quantity,
      })
    } catch (err) {
      // A failed read must not block the order - the client confirms manually
      // anyway, so we simply don't warn rather than stopping the sale.
      console.error(`Stock check failed for ${item.productId}:`, err)
    }
  }

  return results
}


/**
 * Resolves order-line names back to product record IDs.
 *
 * The Items column is stored in readable form for the client's benefit, so it
 * carries the product NAME but not its record id. Stock sync needs the id.
 *
 * Checkout writes colour variants as "Laya (Rose Gold)", and variants share a
 * name, so the colour in brackets is what distinguishes them - it is matched on
 * name + colour first, then name alone for single-colour pieces.
 *
 * If a line matches zero rows, or is ambiguous between several, NOTHING is
 * returned for it. Guessing would deduct stock from the wrong colour, which is
 * worse than deducting none and reporting it.
 */
export async function resolveProductIdsByName(
  names: string[]
): Promise<Map<string, string | null>> {
  const out = new Map<string, string | null>()
  if (!isAirtableConfigured || names.length === 0) return out

  const products = await getProducts()
  const norm = (v: string) => v.trim().toLowerCase().replace(/\s+/g, " ")

  // Two indexes: exact name+colour, and name alone
  const byNameColour = new Map<string, string[]>()
  const byName = new Map<string, string[]>()

  for (const p of products) {
    const n = norm(p.name)
    byName.set(n, [...(byName.get(n) || []), p.id])
    if (p.colour) {
      const k = `${n}|${norm(p.colour)}`
      byNameColour.set(k, [...(byNameColour.get(k) || []), p.id])
    }
  }

  for (const raw of names) {
    const m = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/)
    const baseName = norm(m ? m[1] : raw)
    const colour = m ? norm(m[2]) : ""

    let matches: string[] = []
    if (colour) matches = byNameColour.get(`${baseName}|${colour}`) || []
    if (matches.length === 0) matches = byName.get(baseName) || []

    out.set(raw, matches.length === 1 ? matches[0] : null)
  }

  return out
}
