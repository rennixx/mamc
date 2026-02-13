'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full GalleryPage from old project
// Features: Album grid, album detail view, Lightbox, Instagram CTA

export default function GalleryPage() {
  const { t } = useTranslation('gallery')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Gallery')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Moments captured at Mam Center')}
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Gallery albums placeholder</p>
        </div>
      </section>
    </div>
  )
}
