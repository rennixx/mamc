'use client'

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Ban,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import * as calendarService from '@/services/calendarService'

interface BookingCalendarProps {
  onDateSelect?: (date: Date) => void
  onTimeSelect?: (time: string) => void
  selectedDate?: Date
  selectedTime?: string
  readonly?: boolean
  allowTimeSelection?: boolean
  showSummary?: boolean
}

export const BookingCalendar = ({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
  readonly = false,
  allowTimeSelection,
  showSummary = true,
}: BookingCalendarProps) => {
  const canSelectTime = allowTimeSelection ?? !readonly
  const { t, i18n } = useTranslation('components')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateConfigs, setDateConfigs] = useState<Record<string, Record<string, unknown>>>({})
  const [bookedSlots, setBookedSlots] = useState<string[]>([])

  // Load calendar configs for current month from API
  const loadCalendarConfigs = useCallback(async () => {
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      const startDate = new Date(year, month, 1).toISOString().split('T')[0]
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

      const days = await calendarService.getCalendarRange(startDate, endDate)
      const configs: Record<string, Record<string, unknown>> = {}
      if (Array.isArray(days)) {
        days.forEach((day) => {
          const dateStr = new Date(day.date as string).toISOString().split('T')[0]
          configs[dateStr] = day as unknown as Record<string, unknown>
        })
      }
      setDateConfigs(configs)
    } catch (error) {
      console.error('Error loading calendar configs:', error)
    }
  }, [currentMonth])

  useEffect(() => {
    loadCalendarConfigs()
  }, [loadCalendarConfigs])

  // Load booked slots for selected date
  useEffect(() => {
    if (!selectedDate) return
    const dateStr = selectedDate.toISOString().split('T')[0]
    calendarService
      .getBookedSlots(dateStr)
      .then((slots) => {
        if (Array.isArray(slots)) {
          setBookedSlots(slots.map((s) => s.time as string))
        }
      })
      .catch(console.error)
  }, [selectedDate])

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return []
    const dateStr = selectedDate.toISOString().split('T')[0]
    const config = dateConfigs[dateStr]
    const configuredSlots = (config?.availableSlots as string[]) || []
    if (configuredSlots.length === 0) return []

    const slotLabels: Record<string, string> = {
      '08:00': t('calendar.times.8am'),
      '10:00': t('calendar.times.10am'),
      '12:00': t('calendar.times.12pm'),
      '14:00': t('calendar.times.2pm'),
      '16:00': t('calendar.times.4pm'),
      '18:00': t('calendar.times.6pm'),
    }

    return configuredSlots.map((time) => ({
      time,
      label: slotLabels[time] || time,
      available: !bookedSlots.includes(time),
      booked: bookedSlots.includes(time),
    }))
  }

  const timeSlots = getAvailableTimeSlots()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    const days: (Date | null)[] = []
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null)
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day))
    return days
  }

  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  const isToday = (date: Date | null) => date ? date.toDateString() === new Date().toDateString() : false
  const isPast = (date: Date | null) => { if (!date) return false; const today = new Date(); today.setHours(0, 0, 0, 0); return date < today }
  const isSelected = (date: Date | null) => date && selectedDate ? date.toDateString() === selectedDate.toDateString() : false

  const monthNames = [
    t('calendar.months.january'), t('calendar.months.february'), t('calendar.months.march'),
    t('calendar.months.april'), t('calendar.months.may'), t('calendar.months.june'),
    t('calendar.months.july'), t('calendar.months.august'), t('calendar.months.september'),
    t('calendar.months.october'), t('calendar.months.november'), t('calendar.months.december'),
  ]
  const dayNames = [
    t('calendar.days.sun'), t('calendar.days.mon'), t('calendar.days.tue'),
    t('calendar.days.wed'), t('calendar.days.thu'), t('calendar.days.fri'), t('calendar.days.sat'),
  ]

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="w-6 h-6 text-gold-400" />
        <h3 className="text-2xl font-serif font-bold text-cream-100">{t('calendar.title')}</h3>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={previousMonth} className="glass p-2 hover:bg-cream-400/10 transition-colors" aria-label="Previous month">
            <ChevronLeft className="w-5 h-5 text-cream-100" />
          </button>
          <h4 className="text-xl font-sans font-bold text-cream-100">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h4>
          <button onClick={nextMonth} className="glass p-2 hover:bg-cream-400/10 transition-colors" aria-label="Next month">
            <ChevronRight className="w-5 h-5 text-cream-100" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-cream-300 font-sans text-sm font-semibold py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) return <div key={index} className="aspect-square" />
            const dateStr = date.toISOString().split('T')[0]
            const config = dateConfigs[dateStr]
            const blocked = config?.blocked as boolean
            const hasLimitedSlots = (config?.availableSlots as string[])?.length > 0
            const disabled = readonly || isPast(date) || blocked
            const selected = isSelected(date)
            const today = isToday(date)

            return (
              <button
                key={index}
                onClick={() => !disabled && onDateSelect?.(date)}
                disabled={disabled}
                className={`
                  aspect-square flex items-center justify-center font-sans text-sm transition-all relative
                  ${disabled ? 'text-cream-400/30 cursor-not-allowed' : 'text-cream-100 hover:bg-cream-400/10 cursor-pointer'}
                  ${selected ? 'bg-gold-500 text-forest-900 font-bold' : ''}
                  ${today && !selected ? 'border border-gold-400' : ''}
                  ${!disabled && hasLimitedSlots ? 'bg-yellow-500/10 border border-yellow-400/30' : ''}
                `}
                title={blocked ? ((config?.blockReason as string) || 'Not available') : undefined}
              >
                {date.getDate()}
                {blocked && <Ban className="absolute top-1 right-1 w-3 h-3 text-red-400" />}
                {hasLimitedSlots && !blocked && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && !readonly && (
        <div>
          <h4 className="text-lg font-sans font-bold text-cream-100 mb-4">{t('calendar.availableTimes')}</h4>
          {timeSlots.length === 0 ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-400 text-sm font-sans">
                {t('calendar.noSlotsAvailable', 'No time slots available for this date.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => canSelectTime && slot.available && onTimeSelect?.(slot.time)}
                  disabled={!slot.available || !canSelectTime}
                  className={`
                    px-4 py-3 font-sans font-semibold transition-all
                    ${slot.booked ? 'bg-red-500/10 text-red-400/70 cursor-not-allowed border border-red-400/30' : ''}
                    ${!slot.available && !slot.booked ? 'bg-cream-400/10 text-cream-400/50 cursor-not-allowed' : ''}
                    ${selectedTime === slot.time ? 'bg-gold-500 text-forest-900 cursor-default' : ''}
                    ${slot.available && selectedTime !== slot.time && canSelectTime ? 'glass hover:bg-cream-400/10 text-cream-100 cursor-pointer' : ''}
                  `}
                >
                  {slot.label}
                  {slot.booked && <span className="block text-xs mt-1">{t('calendar.booked', 'Booked')}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showSummary && canSelectTime && !readonly && selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-green-500/20 border border-green-400/50">
          <div className="flex items-center gap-2 text-green-400 font-sans font-semibold mb-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{t('calendar.bookingSummary')}</span>
          </div>
          <p className="text-cream-100 font-sans">
            <span className="font-bold">{selectedDate.toLocaleDateString(i18n.language)}</span>
            <br />
            {t('calendar.at')} <span className="font-bold">{timeSlots.find((s) => s.time === selectedTime)?.label}</span>
          </p>
        </div>
      )}
    </div>
  )
}
