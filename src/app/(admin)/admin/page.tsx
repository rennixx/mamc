'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBookingStats, getAllBookings } from '@/services/bookingService'
import type { BookingStats, Booking } from '@/types'
import { CalendarDays, Clock, CheckCircle, Users, XCircle, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useTranslation('admin')
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getBookingStats(),
      getAllBookings(),
    ])
      .then(([s, bookings]) => {
        setStats(s)
        setRecentBookings(bookings.slice(0, 8))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: t('totalBookings'), value: stats?.total ?? 0, icon: CalendarDays, color: 'text-blue-400' },
    { label: t('pending'), value: stats?.pending ?? 0, icon: Clock, color: 'text-yellow-400' },
    { label: t('confirmed'), value: stats?.confirmed ?? 0, icon: CheckCircle, color: 'text-green-400' },
    { label: t('today'), value: stats?.today ?? 0, icon: Users, color: 'text-purple-400' },
  ]

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-green-500/20 text-green-400',
    COMPLETED: 'bg-blue-500/20 text-blue-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('dashboard')}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-cream-100">
            {t('recentBookings')}
          </h2>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-sans transition-colors"
          >
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentBookings.length === 0 ? (
          <p className="text-cream-300 text-center py-8">{t('noBookings')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-400/20">
                  <th className="text-left py-3 text-cream-300 font-sans font-medium">{t('customer')}</th>
                  <th className="text-left py-3 text-cream-300 font-sans font-medium">{t('service')}</th>
                  <th className="text-left py-3 text-cream-300 font-sans font-medium">{t('date')}</th>
                  <th className="text-left py-3 text-cream-300 font-sans font-medium">{t('time')}</th>
                  <th className="text-left py-3 text-cream-300 font-sans font-medium">{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-cream-400/10 hover:bg-cream-400/5">
                    <td className="py-3 text-cream-100 font-sans">{b.name}</td>
                    <td className="py-3 text-cream-200 font-sans">{b.service}</td>
                    <td className="py-3 text-cream-200 font-sans">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-cream-200 font-sans">{b.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[b.status] ?? ''}`}>
                        {t(b.status.toLowerCase())}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
