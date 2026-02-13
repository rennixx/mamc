'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate NewBookingPage from old admin
export default function AdminNewBookingPage() {
  const { t } = useTranslation('admin')

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-cream-100 mb-6">
        {t('newBooking', 'New Booking')}
      </h1>
      <div className="admin-glass-card rounded-xl p-6">
        <p className="text-cream-300">Admin booking creation form placeholder</p>
      </div>
    </div>
  )
}
