'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getBookingStats } from '@/services/bookingService'
import type { BookingStats } from '@/types'
import { CalendarDays, Clock, CheckCircle, Users } from 'lucide-react'

// TODO: Migrate full admin dashboard from old project
// Features: Stats cards, recent bookings list, quick actions

export default function AdminDashboard() {
  const { t } = useTranslation('admin')
  const [stats, setStats] = useState<BookingStats | null>(null)

  useEffect(() => {
    getBookingStats().then(setStats).catch(console.error)
  }, [])

  const statCards = [
    { label: t('totalBookings', 'Total Bookings'), value: stats?.total ?? 0, icon: CalendarDays, color: 'text-blue-400' },
    { label: t('pending', 'Pending'), value: stats?.pending ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: t('confirmed', 'Confirmed'), value: stats?.confirmed ?? 0, icon: CheckCircle, color: 'text-green-400' },
    { label: t('today', 'Today'), value: stats?.today ?? 0, icon: Users, color: 'text-purple-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('dashboard', 'Dashboard')}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="admin-glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cream-300 font-sans text-sm">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-3xl font-bold text-cream-100">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="admin-glass-card rounded-xl p-6">
        <h2 className="text-lg font-serif font-bold text-cream-100 mb-4">
          {t('recentBookings', 'Recent Bookings')}
        </h2>
        <p className="text-cream-300">Recent bookings list placeholder</p>
      </div>
    </div>
  )
}
