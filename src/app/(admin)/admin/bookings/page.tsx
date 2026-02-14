'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState, useCallback } from 'react'
import {
  getAllBookings,
  getBookingsByStatus,
  updateBooking,
  deleteBooking,
} from '@/services/bookingService'
import type { Booking } from '@/types'
import {
  Search, Eye, CheckCircle, XCircle, Trash2,
  ChevronDown, Clock, MapPin, Users as UsersIcon, X,
} from 'lucide-react'

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const

export default function AdminBookingsPage() {
  const { t } = useTranslation('admin')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = filter === 'ALL'
        ? await getAllBookings()
        : await getBookingsByStatus(filter)
      setBookings(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const filtered = bookings.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q)
    )
  })

  async function handleStatus(id: string, status: string) {
    try {
      await updateBooking(id, { status } as Partial<Booking>)
      await load()
      if (selected?.id === id) setSelected(null)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('deleteConfirm'))) return
    try {
      await deleteBooking(id)
      await load()
      if (selected?.id === id) setSelected(null)
    } catch (e) {
      console.error(e)
    }
  }

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-green-500/20 text-green-400',
    COMPLETED: 'bg-blue-500/20 text-blue-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('bookings')}
      </h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-cream-400/10 border border-cream-400/20 rounded-lg text-cream-100 text-sm font-sans focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex rounded-lg overflow-hidden border border-cream-400/20">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-bold font-sans transition-all ${
                filter === s
                  ? 'bg-gold-500 text-forest-900'
                  : 'text-cream-200 hover:bg-cream-400/10'
              }`}
            >
              {t(s === 'ALL' ? 'all' : s.toLowerCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-cream-300 text-center py-12">{t('noResults')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-400/20 bg-cream-400/5">
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('customer')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('service')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('date')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('time')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('groupSize')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('status')}</th>
                  <th className="text-left px-4 py-3 text-cream-300 font-sans font-medium">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-cream-400/10 hover:bg-cream-400/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-cream-100 font-sans font-medium">{b.name}</div>
                      <div className="text-cream-400 text-xs">{b.email}</div>
                    </td>
                    <td className="px-4 py-3 text-cream-200 font-sans">{t(b.service.toLowerCase())}</td>
                    <td className="px-4 py-3 text-cream-200 font-sans">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-cream-200 font-sans">{b.time}</td>
                    <td className="px-4 py-3 text-cream-200 font-sans">{b.groupSize}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[b.status] ?? ''}`}>
                        {t(b.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelected(b)}
                          className="p-1.5 rounded-lg hover:bg-cream-400/10 text-cream-300 hover:text-cream-100 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {b.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatus(b.id, 'CONFIRMED')}
                            className="p-1.5 rounded-lg hover:bg-green-500/20 text-cream-300 hover:text-green-400 transition-colors"
                            title={t('confirm')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleStatus(b.id, 'COMPLETED')}
                            className="p-1.5 rounded-lg hover:bg-blue-500/20 text-cream-300 hover:text-blue-400 transition-colors"
                            title={t('complete')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <button
                            onClick={() => handleStatus(b.id, 'CANCELLED')}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-cream-300 hover:text-red-400 transition-colors"
                            title={t('cancel')}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-cream-300 hover:text-red-400 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div
            className="admin-glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-cream-100">{t('bookingDetails')}</h3>
              <button onClick={() => setSelected(null)} className="text-cream-300 hover:text-cream-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm font-sans">
              <Row label={t('name')} value={selected.name} />
              <Row label={t('email')} value={selected.email} />
              <Row label={t('phone')} value={selected.phone} />
              <Row label={t('service')} value={t(selected.service.toLowerCase())} />
              <Row label={t('date')} value={new Date(selected.date).toLocaleDateString()} />
              <Row label={t('time')} value={selected.time} />
              <Row label={t('groupSize')} value={String(selected.groupSize)} />
              <Row label={t('experience')} value={selected.experienceLevel} />
              <Row
                label={t('status')}
                value={
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[selected.status] ?? ''}`}>
                    {t(selected.status.toLowerCase())}
                  </span>
                }
              />
              {selected.specialRequests && (
                <Row label={t('specialRequests')} value={selected.specialRequests} />
              )}
              {selected.notes && <Row label={t('notes')} value={selected.notes} />}
              {selected.horses.length > 0 && (
                <Row
                  label={t('selectHorses')}
                  value={selected.horses.map((h) => h.horse.name).join(', ')}
                />
              )}
              {selected.location && (
                <Row
                  label={t('location')}
                  value={[selected.location.city, selected.location.country].filter(Boolean).join(', ') || selected.location.ip}
                />
              )}
              <Row label={t('createdAt')} value={new Date(selected.createdAt).toLocaleString()} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-cream-400/10">
      <span className="text-cream-300 shrink-0">{label}</span>
      <span className="text-cream-100 text-right">{value}</span>
    </div>
  )
}
