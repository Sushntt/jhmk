"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Reveal } from "@/components/animations/Reveal"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <Reveal delay={0}>
            <div>
              <h3 className="text-2xl font-serif text-white tracking-widest uppercase mb-4">
                Chinkara
              </h3>
              <p className="text-sm leading-relaxed text-brand-400">
                Premium imitation jewellery and fashion, named for the Indian gazelle
                and hand-picked from makers across India. Grace in every detail.
              </p>
              <div className="flex gap-4 mt-6">
                <motion.a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chinkara Jewels on Instagram"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </motion.a>
              </div>
            </div>
          </Reveal>

          {/* Main Menu */}
          <Reveal delay={0.1}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Main Menu
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/shop", label: "All Products" },
                  { href: "/shop?sort=newest", label: "New Arrivals" },
                  { href: "/contact", label: "Contact" },
                  { href: "/about", label: "About Us" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-400 hover:text-gold-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Support */}
          <Reveal delay={0.2}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/privacy-policy", label: "Privacy Policy" },
                  { href: "/refund-policy", label: "Refund Policy" },
                  { href: "/shipping-policy", label: "Shipping Policy" },
                  { href: "/terms", label: "Terms and Conditions" },
                  { href: "/faq", label: "FAQs" },
                  { href: "/contact", label: "Contact" },
                ].map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-400 hover:text-gold-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.3}>
            <div>
              <h4 className="text-white font-medium tracking-wider uppercase text-sm mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors"
                  >
                    {siteConfig.whatsappDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors break-all"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0" />
                  <span className="text-sm text-brand-400">{siteConfig.location}</span>
                </li>
                <li className="text-xs text-brand-500 pt-1">{siteConfig.supportHours}</li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Follow band. Sits across the full footer width rather than inside a
            column, so it reads as an invitation rather than another list item. */}
        <div className="mt-16 pt-12 border-t border-brand-900 text-center">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-brand-500 mb-5">
            Follow us on Instagram
          </p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-xl sm:text-2xl font-serif text-white hover:text-gold-300 transition-colors duration-200"
          >
            <span className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-brand-700 group-hover:border-gold-400 transition-colors duration-200">
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            @{siteConfig.instagram}
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-500">
            © {new Date().getFullYear()} Chinkara. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="text-xs text-brand-500 hover:text-brand-300 transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
