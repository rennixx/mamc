'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full BookingPage from old project
// 4-step wizard: Horse Selection → Date/Time → Service → Personal Details
// Now uses API instead of localStorage

export default function BookingPage() {
  const { t } = useTranslation('booking')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4 text-center">
            {t('title', 'Book Your Experience')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto text-center mb-12">
            {t('subtitle', 'Reserve your spot at Mam Center')}
          </p>

          {/* Booking wizard placeholder */}
          <div className="glass-card rounded-2xl p-8 max-w-3xl mx-auto">
            <p className="text-cream-300 text-center">
              4-step booking wizard placeholder
              <br />
              (Horse Selection → Date/Time → Service → Personal Details)
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
