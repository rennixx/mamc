'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate BookingsPage from old admin
export default function AdminBookingsPage() {
  const { t } = useTranslation('admin')

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('bookings', 'Bookings')}
      </h1>
      <div className="admin-glass-card rounded-xl p-6">
        <p className="text-cream-300">Bookings management placeholder (fetches from /api/bookings)</p>
      </div>
    </div>
  )
}
