import { PolicyLayout, PolicyList } from "@/components/policy/PolicyLayout"

export const metadata = { title: "Terms & Conditions | Chinkara" }

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <PolicyList
        items={[
          "Listing a product on this website is an invitation to enquire, not a binding offer. An order is confirmed only when we accept it on WhatsApp and payment is received.",
          "Prices are in Indian Rupees and may change without notice. The price confirmed on WhatsApp at the time of ordering is final for that order.",
          "Product availability shown on the site is updated regularly but is not guaranteed in real time; availability is confirmed on WhatsApp.",
          "Our products are imitation/fashion jewellery and are described honestly as such. Slight variations in colour, finish, and handcrafted detailing are natural and not defects.",
          "All images, text, the Chinkara name, gazelle logo, and brand materials on this site are our property and may not be copied or used commercially without written permission.",
          "Our liability for any order is limited to the amount paid for that order.",
          "These terms are governed by the laws of India, with courts in Chennai, Tamil Nadu having jurisdiction.",
        ]}
      />
    </PolicyLayout>
  )
}
