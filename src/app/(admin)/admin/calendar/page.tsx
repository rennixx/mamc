'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState, useMemo } from 'react'
import { getBookingsByDateRange } from '@/services/bookingService'
import type { Booking } from '@/types'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function AdminCalendarPage() {
  const { t } = useTranslation('admin')
  const [current, setCurrent] = useState(() => new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = current.getFullYear()
  const month = current.getMonth()

  useEffect(() => {
    setLoading(true)
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    getBookingsByDateRange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0],
    )
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [year, month])

  // Group bookings by date string
  const byDate = useMemo(() => {
    const map: Record<string, Booking[]> = {}
    bookings.forEach((b) => {
      const d = new Date(b.date).toISOString().split('T')[0]
      if (!map[d]) map[d] = []
      map[d].push(b)
    })
    return map
  }, [bookings])

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = Array(firstDay).fill(null)

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
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

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-green-500/20 text-green-400',
    COMPLETED: 'bg-blue-500/20 text-blue-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  }

  const selectedBookings = selectedDate ? byDate[selectedDate] ?? [] : []

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('calendar')}
      </h1>

      <div className="admin-glass-card rounded-xl p-6">
        {/* Month nav */}
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
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d) => (
                <div key={d} className="text-center text-xs font-sans font-medium text-cream-400 py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {weeks.flat().map((day, i) => {
                if (day === null) return <div key={i} className="h-20" />
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const count = byDate[dateStr]?.length ?? 0
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selectedDate

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-20 rounded-lg border text-left p-2 transition-all flex flex-col ${
                      isSelected
                        ? 'border-gold-400 bg-gold-500/10'
                        : isToday
                          ? 'border-blue-400/50 bg-blue-500/5'
                          : 'border-cream-400/10 hover:border-cream-400/30 hover:bg-cream-400/5'
                    }`}
                  >
                    <span className={`text-xs font-sans font-bold ${isToday ? 'text-blue-400' : 'text-cream-200'}`}>
                      {day}
                    </span>
                    {count > 0 && (
                      <div className="mt-auto">
                        <span className="text-[10px] font-bold bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded-full">
                          {count}
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Selected date bookings */}
      {selectedDate && (
        <div className="admin-glass-card rounded-xl p-6 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-cream-100">
              {t('bookingsOnDate')} — {new Date(selectedDate + 'T00:00').toLocaleDateString()}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="text-cream-300 hover:text-cream-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          {selectedBookings.length === 0 ? (
            <p className="text-cream-300 text-center py-4">{t('noBookingsOnDate')}</p>
          ) : (
            <div className="space-y-3">
              {selectedBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-cream-400/5 border border-cream-400/10">
                  <div>
                    <p className="text-cream-100 font-sans font-medium">{b.name}</p>
                    <p className="text-cream-400 text-xs font-sans">{t(b.service.toLowerCase())} · {b.time} · {b.groupSize} {t('groupSize').toLowerCase()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[b.status] ?? ''}`}>
                    {t(b.status.toLowerCase())}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
