'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { submitContactMessage } from '@/services/contactService'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const { t } = useTranslation('contact')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await submitContactMessage(form)
      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+964 770 000 0000' },
    { icon: Mail, label: 'Email', value: 'info@mamcenter.com' },
    { icon: MapPin, label: 'Location', value: 'Sulaymaniyah, Kurdistan Region, Iraq' },
    { icon: Clock, label: 'Hours', value: 'Sun–Thu: 8AM–8PM · Fri–Sat: 9AM–10PM' },
  ]

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            We&apos;d love to hear from you
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="glass-card rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold text-cream-100 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-cream-200 font-sans">
                      We&apos;ll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 px-6 py-2 bg-gold-500 text-forest-900 font-sans font-semibold rounded-xl hover:bg-gold-400 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-serif font-bold text-cream-100 mb-4">
                      Send us a message
                    </h2>

                    {error && (
                      <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm text-center font-sans">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="form-label">Name *</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="form-label">Subject *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="form-input"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Booking">Booking</option>
                          <option value="Riding Lessons">Riding Lessons</option>
                          <option value="Stable Rental">Stable Rental</option>
                          <option value="Horse Transportation">Horse Transportation</option>
                          <option value="Safari">Safari</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        className="form-input resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="glass-card rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-semibold text-cream-100 mb-1">
                      {info.label}
                    </h3>
                    <p className="text-cream-200 font-sans text-sm">{info.value}</p>
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-cream-400/5 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-8 h-8 text-cream-300 mx-auto mb-2" />
                    <p className="text-cream-300 font-sans text-sm">
                      Sulaymaniyah, Kurdistan Region, Iraq
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
