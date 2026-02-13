'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full LifestylePage from old project
// Sections: Hero, ViewGallery, AtmosphereIndicators, CafeMenu, LocationContact

export default function LifestylePage() {
  const { t } = useTranslation('lifestyle')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Baran Coffee & Lifestyle')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Experience the equestrian lifestyle')}
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Lifestyle page content placeholder</p>
        </div>
      </section>
    </div>
  )
}
