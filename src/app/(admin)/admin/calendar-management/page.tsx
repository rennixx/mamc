'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import type { CalendarDay } from '@/types'
import {
  ChevronLeft, ChevronRight, Lock, Unlock, Plus, Trash2, Save,
} from 'lucide-react'

const DEFAULT_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

export default function AdminCalendarManagementPage() {
  const { t } = useTranslation('admin')
  const [current, setCurrent] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [calendarDays, setCalendarDays] = useState<Record<string, CalendarDay>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state for selected date
  const [blocked, setBlocked] = useState(false)
  const [blockReason, setBlockReason] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [capacity, setCapacity] = useState<number>(10)
  const [newSlot, setNewSlot] = useState('09:00')

  const year = current.getFullYear()
  const month = current.getMonth()

  useEffect(() => {
    setLoading(true)
    const start = new Date(year, month, 1).toISOString().split('T')[0]
    const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
    fetch(`/api/calendar?startDate=${start}&endDate=${end}`)
      .then((r) => r.json())
      .then((json) => {
        const map: Record<string, CalendarDay> = {}
        ;(json.data ?? []).forEach((d: CalendarDay) => {
          const key = new Date(d.date).toISOString().split('T')[0]
          map[key] = d
        })
        setCalendarDays(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [year, month])

  // When a date is selected, populate form
  useEffect(() => {
    if (!selectedDate) return
    const cfg = calendarDays[selectedDate]
    if (cfg) {
      setBlocked(cfg.blocked)
      setBlockReason(cfg.blockReason ?? '')
      setSlots(cfg.availableSlots?.length ? cfg.availableSlots : DEFAULT_SLOTS)
      setCapacity(cfg.capacity ?? 10)
    } else {
      setBlocked(false)
      setBlockReason('')
      setSlots(DEFAULT_SLOTS)
      setCapacity(10)
    }
  }, [selectedDate, calendarDays])

  async function handleSave() {
    if (!selectedDate) return
    setSaving(true)
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          blocked,
          blockReason: blocked ? blockReason : null,
          availableSlots: slots,
          capacity,
        }),
      })
      const json = await res.json()
      if (json.data) {
        const key = new Date(json.data.date).toISOString().split('T')[0]
        setCalendarDays((prev) => ({ ...prev, [key]: json.data }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  function addSlot() {
    if (!slots.includes(newSlot)) {
      setSlots([...slots, newSlot].sort())
    }
  }

  function removeSlot(slot: string) {
    setSlots(slots.filter((s) => s !== slot))
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('calendarManagement')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 admin-glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg hover:bg-cream-400/10 text-cream-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-serif font-bold text-cream-100">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg hover:bg-cream-400/10 text-cream-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {dayNames.map((d) => (
                  <div key={d} className="text-center text-xs font-sans font-medium text-cream-400 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeks.flat().map((day, i) => {
                  if (day === null) return <div key={i} className="h-16" />
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const cfg = calendarDays[dateStr]
                  const isBlocked = cfg?.blocked
                  const isToday = dateStr === todayStr
                  const isSelected = dateStr === selectedDate

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`h-16 rounded-lg border text-left p-2 transition-all flex flex-col ${
                        isSelected
                          ? 'border-gold-400 bg-gold-500/10'
                          : isBlocked
                            ? 'border-red-400/30 bg-red-500/10'
                            : isToday
                              ? 'border-blue-400/50 bg-blue-500/5'
                              : 'border-cream-400/10 hover:border-cream-400/30'
                      }`}
                    >
                      <span className={`text-xs font-sans font-bold ${
                        isBlocked ? 'text-red-400' : isToday ? 'text-blue-400' : 'text-cream-200'
                      }`}>
                        {day}
                      </span>
                      {isBlocked && <Lock className="w-3 h-3 text-red-400 mt-auto" />}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Config panel */}
        <div className="admin-glass-card rounded-xl p-6">
          {selectedDate ? (
            <>
              <h3 className="text-lg font-serif font-bold text-cream-100 mb-4">
                {t('dateConfig')}
              </h3>
              <p className="text-sm text-cream-300 mb-4 font-sans">
                {new Date(selectedDate + 'T00:00').toLocaleDateString()}
              </p>

              {/* Blocked toggle */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-cream-200 font-sans text-sm">{t('blocked')}</span>
                <button
                  onClick={() => setBlocked(!blocked)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    blocked
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {blocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {blocked ? t('blocked') : t('available')}
                </button>
              </div>

              {/* Block reason */}
              {blocked && (
                <div className="mb-4">
                  <label className="text-cream-200 font-sans text-sm mb-1 block">{t('blockReason')}</label>
                  <input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                  />
                </div>
              )}

              {/* Capacity */}
              <div className="mb-4">
                <label className="text-cream-200 font-sans text-sm mb-1 block">{t('capacity')}</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                />
              </div>

              {/* Available slots */}
              <div className="mb-4">
                <label className="text-cream-200 font-sans text-sm mb-2 block">{t('availableSlots')}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {slots.map((slot) => (
                    <div key={slot} className="flex items-center gap-1 bg-cream-400/10 rounded-lg px-2 py-1">
                      <span className="text-cream-100 text-xs font-sans">{slot}</span>
                      <button onClick={() => removeSlot(slot)} className="text-cream-400 hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="flex-1 px-3 py-2 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400"
                  />
                  <button
                    onClick={addSlot}
                    className="px-3 py-2 bg-gold-500/20 text-gold-400 rounded-lg text-sm font-bold hover:bg-gold-500/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold-500 text-forest-900 rounded-lg text-sm font-bold hover:bg-gold-400 disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" />
                {saving ? '...' : t('saveConfig')}
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-cream-300 font-sans text-sm text-center">{t('selectDate')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
