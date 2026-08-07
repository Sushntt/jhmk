import { syncStock } from "@/lib/sync-stock"

/**
 * Runs the stock sync automatically in the background, at most once every few
 * minutes, whenever someone loads a page that reads products.
 *
 * Airtable's free plan has no way to call an external URL, so there is no
 * reliable automation available to the client. Rather than depending on them
 * setting up an external scheduler, the site triggers the sync itself: any
 * visitor arriving after an order is confirmed causes the deduction to run.
 *
 * Deliberately fire-and-forget. Nothing awaits this, so a slow or failing sync
 * can never delay a page render or break the shop for a customer.
 */

const INTERVAL_MS = 3 * 60 * 1000

// Module scope persists between requests on a warm serverless instance. A cold
// start just means one extra sync, which is harmless.
let lastRun = 0
let running = false

export function maybeSyncStock(): void {
  if (process.env.NODE_ENV !== "production") return

  const now = Date.now()
  if (running || now - lastRun < INTERVAL_MS) return

  lastRun = now
  running = true

  syncStock()
    .then((result) => {
      if (result.awaitingDeduction > 0) {
        console.log(
          `Auto stock sync: processed ${result.processed.length} confirmed order(s)`
        )
      }
    })
    .catch((err) => console.error("Auto stock sync failed:", err))
    .finally(() => {
      running = false
    })
}
