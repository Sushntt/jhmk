"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/Button"
import { Mail, Phone, Clock, MapPin, Send, MessageCircle } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || siteConfig.whatsappNumber

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-900 mb-4">Get in Touch</h1>
        <p className="text-brand-500 max-w-xl mx-auto">
          We would love to hear from you. Whether you have a question about a piece, 
          custom order, or just want to say hello.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <Reveal direction="left">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-brand-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-900"
                  >
                    {siteConfig.whatsappDisplay}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-brand-600 hover:text-brand-900 break-all"
                  >
                    {siteConfig.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <p className="text-brand-600">{siteConfig.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <p className="text-brand-600">{siteConfig.supportHours}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Quick Response on WhatsApp
              </h3>
              <p className="text-sm text-green-700 mb-4">
                For fastest response, message us directly on WhatsApp for orders, custom designs, or inquiries.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal direction="right" delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitted}>
              <motion.span
                animate={submitted ? { scale: [1, 1.1, 1] } : {}}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submitted ? "Message Sent!" : "Send Message"}
              </motion.span>
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  )
}
