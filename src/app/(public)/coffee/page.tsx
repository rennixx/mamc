'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full CoffeePage from old project
// Sections: Hero, About, Menu (14 items), Features, CTA

export default function CoffeePage() {
  const { t } = useTranslation('coffee')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Baran Coffee')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Coffee with a view')}
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Coffee menu & features placeholder</p>
        </div>
      </section>
    </div>
  )
}
