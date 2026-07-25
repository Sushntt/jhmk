import Link from "next/link"
import { PolicyLayout, PolicySection, PolicyList } from "@/components/policy/PolicyLayout"
import { siteConfig } from "@/lib/site-config"

export const metadata = { title: "Privacy Policy | Chinkara" }

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      intro={`Chinkara (“we”, “us”) respects your privacy. This policy explains what information we collect through our website and WhatsApp ordering process, and how we use it.`}
    >
      <PolicySection heading="What we collect">
        <PolicyList
          items={[
            "Information you share with us to place an order: your name, phone number, delivery address, and order details. This may be entered on our site at checkout or shared directly with us on WhatsApp or Instagram.",
            "If you sign in, the name and email address associated with your Google account.",
            "Basic website analytics: pages and products viewed, and orders placed. This helps us understand which designs you love.",
          ]}
        />
        <p>
          All payments are made directly by you through your own UPI or banking app, so we never
          collect or store card, UPI, or banking details on this website.
        </p>
      </PolicySection>

      <PolicySection heading="How we use it">
        <PolicyList
          items={[
            "To confirm and deliver your orders and provide customer support.",
            "To share order updates, and — only if you opt in — new collection announcements on WhatsApp.",
            "To improve our catalogue based on what customers browse and ask about.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="What we don't do">
        <PolicyList
          items={[
            "We do not sell, rent, or trade your personal information to anyone.",
            "We share your details only with our courier partners, strictly for delivery.",
          ]}
        />
      </PolicySection>

      <PolicySection heading="Your choices">
        <p>
          You may ask us at any time to delete your contact details from our records or to stop
          receiving promotional messages — just say so on WhatsApp. You can also manage your
          notification preferences in your{" "}
          <Link href="/account/settings" className="text-brand-900 underline hover:no-underline">
            account settings
          </Link>
          .
        </p>
        <p>
          For any privacy questions, contact us at{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-brand-900 underline hover:no-underline"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}
