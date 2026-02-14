'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getAllHorses } from '@/services/horseService'
import { createBooking } from '@/services/bookingService'
import { getIpLocation } from '@/services/ipGeolocation'
import type { Horse } from '@/types'
import {
  ChevronRight, ChevronLeft, CheckCircle, Loader2,
  User, Calendar, Clock, Users, MessageSquare
} from 'lucide-react'

const stepKeys = ['steps.dateTime', 'steps.service', 'steps.details', 'steps.confirm'] as const

const serviceOptions = [
  { value: 'ACADEMY', labelKey: 'services.ridingLessons' },
  { value: 'SAFARI', labelKey: 'services.horseSafari' },
  { value: 'PRIVATE', labelKey: 'services.privateTraining' },
  { value: 'EVENT', labelKey: 'services.stableRental' },
]

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00',
]

const experienceLevelOptions = [
  { value: 'BEGINNER', labelKey: 'experienceLevels.beginner' },
  { value: 'NOVICE', labelKey: 'experienceLevels.novice' },
  { value: 'INTERMEDIATE', labelKey: 'experienceLevels.intermediate' },
  { value: 'ADVANCED', labelKey: 'experienceLevels.advanced' },
]

export default function BookingPage() {
  const { t } = useTranslation('booking')
  const [step, setStep] = useState(0)
  const [horses, setHorses] = useState<Horse[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    experienceLevel: '',
    groupSize: 1,
    specialRequests: '',
    horseIds: [] as string[],
  })

  useEffect(() => {
    getAllHorses().then((h) => setHorses(h.filter((x) => x.available))).catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return !!form.date && !!form.time
      case 1: return !!form.service
      case 2: return !!form.name && !!form.phone && !!form.experienceLevel
      default: return true
    }
  }, [step, form])

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const location = await getIpLocation()
      await createBooking({
        service: form.service as 'SAFARI' | 'ACADEMY' | 'PRIVATE' | 'EVENT',
        name: form.name,
        email: form.email,
        phone: form.phone,
        experienceLevel: form.experienceLevel,
        groupSize: form.groupSize,
        specialRequests: form.specialRequests || undefined,
        date: form.date,
        time: form.time,
        status: 'PENDING',
        horseIds: form.horseIds.length ? form.horseIds : undefined,
        location: location ? {
          ip: location.ip,
          city: location.city,
          region: location.region,
          country: location.country,
          countryCode: location.countryCode,
          latitude: location.latitude,
          longitude: location.longitude,
          org: location.org,
        } : undefined,
      })
      setSubmitted(true)
    } catch {
      setError(t('error.submitFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-cream-100 mb-3">{t('success.heading')}</h2>
          <p className="text-cream-200 font-sans">
            {t('success.text')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <section className="w-full max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-cream-100 mb-4 text-center">
            {t('hero.title')}
          </h1>
          <p className="text-base md:text-lg text-cream-200 font-sans text-center mb-8 md:mb-12">
            {t('hero.subtitle')}
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8 md:mb-12 overflow-x-auto py-2">
            {stepKeys.map((key, i) => (
              <div key={key} className="flex items-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-sans font-bold text-xs sm:text-sm transition-all ${
                      i <= step
                        ? 'bg-gold-500 text-forest-900'
                        : 'bg-cream-400/10 text-cream-300'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-sans text-cream-300 mt-1 sm:mt-2 hidden md:block">
                    {t(key)}
                  </span>
                </div>
                {i < stepKeys.length - 1 && (
                  <div
                    className={`w-12 sm:w-20 md:w-32 h-0.5 mx-1 sm:mx-3 ${
                      i < step ? 'bg-gold-500' : 'bg-cream-400/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm text-center font-sans mb-6">
              {error}
            </div>
          )}

          <div className="glass-card rounded-2xl p-4 md:p-6 lg:p-8">
            {/* Step 0: Date & Time */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold text-cream-100 mb-6">
                  {t('dateTime.heading')}
                </h2>
                <div>
                  <label htmlFor="date" className="form-label">
                    <Calendar className="w-4 h-4" /> {t('dateTime.date')}
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">
                    <Clock className="w-4 h-4" /> {t('dateTime.timeSlot')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setForm((p) => ({ ...p, time: slot }))}
                        className={`py-3 rounded-xl font-sans text-sm font-semibold transition-all border ${
                          form.time === slot
                            ? 'border-gold-400 bg-gold-500/10 text-cream-100'
                            : 'border-cream-400/10 text-cream-200 hover:border-cream-400/30'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Service */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif font-bold text-cream-100 mb-6">
                  {t('serviceSelect.heading')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceOptions.map((svc) => (
                    <button
                      key={svc.value}
                      onClick={() => setForm((p) => ({ ...p, service: svc.value }))}
                      className={`p-5 rounded-xl text-left font-sans transition-all border-2 ${
                        form.service === svc.value
                          ? 'border-gold-400 bg-gold-500/10 text-cream-100'
                          : 'border-cream-400/10 text-cream-200 hover:border-cream-400/30'
                      }`}
                    >
                      <span className="font-semibold">{t(svc.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-serif font-bold text-cream-100 mb-6">
                  {t('details.heading')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bk-name" className="form-label">
                      <User className="w-4 h-4" /> {t('details.fullName')} *
                    </label>
                    <input id="bk-name" name="name" type="text" value={form.name} onChange={handleChange} className="form-input" required />
                  </div>
                  <div>
                    <label htmlFor="bk-email" className="form-label">{t('details.email')}</label>
                    <input id="bk-email" name="email" type="email" value={form.email} onChange={handleChange} className="form-input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bk-phone" className="form-label">{t('details.phone')} *</label>
                    <input id="bk-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" required />
                  </div>
                  <div>
                    <label htmlFor="bk-exp" className="form-label">{t('details.experienceLevel')} *</label>
                    <select id="bk-exp" name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="form-input" required>
                      <option value="">{t('details.selectLevel')}</option>
                      {experienceLevelOptions.map((lv) => (
                        <option key={lv.value} value={lv.value}>{t(lv.labelKey)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bk-group" className="form-label">
                      <Users className="w-4 h-4" /> {t('details.groupSize')}
                    </label>
                    <input id="bk-group" name="groupSize" type="number" min={1} max={20} value={form.groupSize} onChange={handleChange} className="form-input" />
                  </div>
                </div>
                <div>
                  <label htmlFor="bk-requests" className="form-label">
                    <MessageSquare className="w-4 h-4" /> {t('details.specialRequests')}
                  </label>
                  <textarea id="bk-requests" name="specialRequests" rows={3} value={form.specialRequests} onChange={handleChange} className="form-input resize-none" />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-serif font-bold text-cream-100 mb-6">
                  {t('confirmSection.heading')}
                </h2>
                <div className="space-y-3 text-cream-200 font-sans">
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.service')}</span>
                    <span className="font-semibold text-cream-100">
                      {serviceOptions.find((s) => s.value === form.service)
                        ? t(serviceOptions.find((s) => s.value === form.service)!.labelKey)
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.date')}</span>
                    <span className="font-semibold text-cream-100">{form.date}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.time')}</span>
                    <span className="font-semibold text-cream-100">{form.time}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.name')}</span>
                    <span className="font-semibold text-cream-100">{form.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.email')}</span>
                    <span className="font-semibold text-cream-100">{form.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.phone')}</span>
                    <span className="font-semibold text-cream-100">{form.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-400/10">
                    <span className="text-cream-300">{t('confirmSection.experience')}</span>
                    <span className="font-semibold text-cream-100">
                      {experienceLevelOptions.find((l) => l.value === form.experienceLevel)
                        ? t(experienceLevelOptions.find((l) => l.value === form.experienceLevel)!.labelKey)
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-cream-300">{t('confirmSection.groupSize')}</span>
                    <span className="font-semibold text-cream-100">{form.groupSize}</span>
                  </div>
                  {form.specialRequests && (
                    <div className="pt-2 border-t border-cream-400/10">
                      <span className="text-cream-300 block mb-1">{t('confirmSection.specialRequests')}</span>
                      <span className="text-cream-100 text-sm">{form.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-cream-400/10 gap-2">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-4 md:px-6 py-3 text-cream-200 font-sans font-semibold hover:text-cream-100 transition-colors touch-manipulation"
                >
                  <ChevronLeft className="w-5 h-5" /> <span className="hidden sm:inline">{t('nav.back')}</span>
                </button>
              ) : (
                <div />
              )}

              {step < stepKeys.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50 touch-manipulation"
                >
                  <span className="hidden sm:inline">{t('nav.next')}</span> <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors disabled:opacity-50 touch-manipulation"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="hidden sm:inline">{t('nav.confirmBooking')}</span>}
                </button>
              )}
            </div>
          </div>
      </section>
    </div>
  )
}
