import { PolicyLayout, PolicySection, PolicyList } from "@/components/policy/PolicyLayout"

export const metadata = { title: "Refund & Replacement Policy | Chinkara" }

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund & Replacement Policy"
      intro="Because jewellery is a personal-wear item, all sales are final. We do not offer returns, exchanges, or refunds for change of mind, dislike of colour or size, or minor variations in shade due to screen settings or lighting."
    >
      <PolicySection heading="Replacements are provided in the following cases">
        <PolicyList
          items={[
            "The item arrived damaged or broken in transit.",
            "You received a different item from what you ordered.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="To be eligible for a replacement">
        <PolicyList
          items={[
            "A clear, continuous, uncut unboxing video (from sealed parcel to full opening) is mandatory. This protects both you and us.",
            "The issue must be reported on WhatsApp within 24 hours of delivery, along with the video and photos.",
            "The item must be unused, with all packaging, cards, and tags intact.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="Once approved">
        <p>
          We will ship a replacement of the same item. If the same item is out of stock, you may
          choose a piece of equal value, or receive a full refund to your original payment method
          within 5–7 business days.
        </p>
        <PolicyList
          items={[
            "For approved damage or wrong-item claims, Chinkara bears the return courier cost — we will either arrange a reverse pickup or reimburse your courier charges. Please use a reliable, trackable courier service and share the receipt and tracking details with us on WhatsApp.",
            "In all other cases (for example, an exchange we agree to as a goodwill exception), courier charges both ways are borne by the customer.",
          ]}
        />
      </PolicySection>
    </PolicyLayout>
  )
}
