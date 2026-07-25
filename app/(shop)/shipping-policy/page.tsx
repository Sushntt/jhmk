import { PolicyLayout, PolicyList } from "@/components/policy/PolicyLayout"
import { siteConfig } from "@/lib/site-config"

export const metadata = { title: "Shipping Policy | Chinkara" }

export default function ShippingPolicyPage() {
  const s = siteConfig.shipping
  return (
    <PolicyLayout title="Shipping Policy">
      <PolicyList
        items={[
          "We currently ship within India only.",
          `Orders are dispatched after payment confirmation, within ${s.dispatchDays}. During launch periods or festive sales, dispatch may take up to 5 business days.`,
          `Estimated delivery: ${s.deliveryChennai} within Chennai, ${s.deliveryIndia} for the rest of India. Timelines are estimates and depend on the courier and destination.`,
          `Shipping charges: ₹${s.tamilNadu} per order within Tamil Nadu, and ₹${s.restOfIndia} per order for the rest of India.`,
          "Tracking details are shared on WhatsApp upon dispatch.",
          "Please ensure your full address with PIN code and phone number are correct when confirming your order. Chinkara is not responsible for delays or non-delivery due to incorrect address details, but we will assist in coordinating with the courier.",
          "If a parcel is returned to us undelivered (RTO) due to an incorrect address or repeated failed delivery attempts, re-shipping charges will apply.",
        ]}
      />
    </PolicyLayout>
  )
}
