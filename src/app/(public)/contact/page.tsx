'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { submitContactMessage } from '@/services/contactService'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react'
import { GoogleMapsEmbed } from '@next/third-parties/google'

const subjectKeys = [
  'generalInquiry', 'booking', 'ridingLessons', 'stableRental',
  'horseTransportation', 'safari', 'other',
] as const

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
    } catch {
      setError(t('error.sendFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: Phone, labelKey: 'info.phone', valueKey: 'info.phoneValue' },
    { icon: Mail, labelKey: 'info.email', valueKey: 'info.emailValue' },
    { icon: MapPin, labelKey: 'info.location', valueKey: 'info.locationValue' },
    { icon: Clock, labelKey: 'info.hours', valueKey: 'info.hoursValue' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('hero.subtitle')}
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
                      {t('success.heading')}
                    </h3>
                    <p className="text-cream-200 font-sans">
                      {t('success.text')}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 px-6 py-2 bg-gold-500 text-forest-900 font-sans font-semibold rounded-xl hover:bg-gold-400 transition-colors"
                    >
                      {t('success.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-xl font-serif font-bold text-cream-100 mb-4">
                      {t('form.heading')}
                    </h2>

                    {error && (
                      <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm text-center font-sans">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="form-label">{t('form.name')} *</label>
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
                        <label htmlFor="email" className="form-label">{t('form.email')} *</label>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="form-label">{t('form.phone')}</label>
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
                        <label htmlFor="subject" className="form-label">{t('form.subject')} *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="form-input"
                          required
                        >
                          <option value="">{t('form.selectSubject')}</option>
                          {subjectKeys.map((key) => (
                            <option key={key} value={key}>{t(`subjects.${key}`)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">{t('form.message')} *</label>
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
                          {t('form.submit')}
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
                <div key={info.labelKey} className="glass-card rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-semibold text-cream-100 mb-1">
                      {t(info.labelKey)}
                    </h3>
                    <p className="text-cream-200 font-sans text-sm">{t(info.valueKey)}</p>
                  </div>
                </div>
              ))}

              {/* Google Maps mam */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <GoogleMapsEmbed
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''}
                  height={300}
                  width="100%"
                  mode="place"
                  q="Mam+horse+riding+center"
                  id="0x40072355434d428d:0x6f830bbb98fb7add"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
