'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking } from '@/services/bookingService'
import { getAllHorses } from '@/services/horseService'
import type { Horse } from '@/types'
import { Save, CheckCircle } from 'lucide-react'

const SERVICES = ['SAFARI', 'ACADEMY', 'PRIVATE', 'EVENT'] as const
const LEVELS = ['BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED'] as const
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

export default function AdminNewBookingPage() {
  const { t } = useTranslation('admin')
  const router = useRouter()
  const [horses, setHorses] = useState<Horse[]>([])
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    service: 'SAFARI' as string,
    name: '',
    email: '',
    phone: '',
    experienceLevel: 'BEGINNER',
    groupSize: 1,
    date: '',
    time: '10:00',
    specialRequests: '',
    notes: '',
    status: 'CONFIRMED',
    horseIds: [] as string[],
  })

  useEffect(() => {
    getAllHorses().then(setHorses).catch(console.error)
  }, [])

  function toggleHorse(id: string) {
    setForm((f) => ({
      ...f,
      horseIds: f.horseIds.includes(id)
        ? f.horseIds.filter((h) => h !== id)
        : [...f.horseIds, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await createBooking({
        service: form.service as 'SAFARI' | 'ACADEMY' | 'PRIVATE' | 'EVENT',
        name: form.name,
        email: form.email,
        phone: form.phone,
        experienceLevel: form.experienceLevel,
        groupSize: form.groupSize,
        date: form.date,
        time: form.time,
        specialRequests: form.specialRequests || undefined,
        notes: form.notes || undefined,
        status: form.status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
        horseIds: form.horseIds.length > 0 ? form.horseIds : undefined,
      })
      setSuccess(true)
      setTimeout(() => router.push('/admin/bookings'), 1500)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
        <p className="text-xl font-serif font-bold text-cream-100">{t('bookingCreated')}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('newBooking')}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="admin-glass-card rounded-xl p-6 space-y-4">
          {/* Service */}
          <div>
            <label className="text-cream-200 font-sans text-sm mb-2 block">{t('selectService')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, service: s })}
                  className={`px-3 py-2 rounded-lg text-sm font-bold font-sans transition-all ${
                    form.service === s
                      ? 'bg-gold-500 text-forest-900'
                      : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                  }`}
                >
                  {t(s.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label={t('name')} value={form.name} required onChange={(v) => setForm({ ...form, name: v })} />
            <InputField label={t('email')} type="email" value={form.email} required onChange={(v) => setForm({ ...form, email: v })} />
            <InputField label={t('phone')} type="tel" value={form.phone} required onChange={(v) => setForm({ ...form, phone: v })} />
            <div>
              <label className="text-cream-200 font-sans text-sm mb-1 block">{t('groupSize')}</label>
              <input
                type="number" min={1} max={20}
                value={form.groupSize}
                onChange={(e) => setForm({ ...form, groupSize: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Experience level */}
          <div>
            <label className="text-cream-200 font-sans text-sm mb-2 block">{t('experience')}</label>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setForm({ ...form, experienceLevel: l })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    form.experienceLevel === l
                      ? 'bg-gold-500 text-forest-900'
                      : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                  }`}
                >
                  {t(l.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-cream-200 font-sans text-sm mb-1 block">{t('date')}</label>
              <input
                type="date"
                value={form.date}
                required
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="text-cream-200 font-sans text-sm mb-2 block">{t('time')}</label>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setForm({ ...form, time: slot })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      form.time === slot
                        ? 'bg-gold-500 text-forest-900'
                        : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-cream-200 font-sans text-sm mb-2 block">{t('status')}</label>
            <div className="flex flex-wrap gap-2">
              {(['PENDING', 'CONFIRMED'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    form.status === s
                      ? 'bg-gold-500 text-forest-900'
                      : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                  }`}
                >
                  {t(s.toLowerCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Horses */}
          {horses.length > 0 && (
            <div>
              <label className="text-cream-200 font-sans text-sm mb-2 block">{t('selectHorses')}</label>
              <div className="flex flex-wrap gap-2">
                {horses.filter((h) => h.available).map((horse) => (
                  <button
                    key={horse.id}
                    type="button"
                    onClick={() => toggleHorse(horse.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      form.horseIds.includes(horse.id)
                        ? 'bg-gold-500 text-forest-900'
                        : 'bg-cream-400/10 text-cream-300 hover:bg-cream-400/20'
                    }`}
                  >
                    {horse.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special requests & notes */}
          <div>
            <label className="text-cream-200 font-sans text-sm mb-1 block">{t('specialRequests')}</label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400 resize-none"
            />
          </div>
          <div>
            <label className="text-cream-200 font-sans text-sm mb-1 block">{t('notes')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !form.name || !form.email || !form.phone || !form.date}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gold-500 text-forest-900 rounded-lg text-sm font-bold hover:bg-gold-400 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? '...' : t('createBooking')}
          </button>
        </div>
      </form>
    </div>
  )
}

function InputField({
  label, value, onChange, type = 'text', required = false,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="text-cream-200 font-sans text-sm mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
      />
    </div>
  )
}
