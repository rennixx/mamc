'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full SafariPage from old project
// Sections: Hero, RouteMap, DifficultyToggle, WhatToBring, BookingCalendar, FAQ, CTA

export default function SafariPage() {
  const { t } = useTranslation('safari')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Horse Safari')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Explore the beautiful landscape on horseback')}
          </p>
        </div>
      </section>

      {/* Route Map - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Route map & safari details placeholder</p>
        </div>
      </section>

      {/* FAQ - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">FAQ section placeholder</p>
        </div>
      </section>
    </div>
  )
}
