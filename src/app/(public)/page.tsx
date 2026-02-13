'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'

// TODO: Migrate full HomePage content from old project
// Sections: Hero, StatsCounter, Persona Selector, Featured Programs, Story Teaser, Testimonials, WhatsApp

export default function HomePage() {
  const { t } = useTranslation('home')

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-cream-100 mb-6">
            {t('hero.title', 'Mam Center')}
          </h1>
          <p className="text-xl md:text-2xl text-cream-200 font-sans mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle', 'Premium Equestrian Experience')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/academy"
              className="px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-lg hover:bg-gold-400 transition-colors shadow-tactile"
            >
              {t('hero.cta1', 'Explore Academy')}
            </Link>
            <Link
              href="/safari"
              className="px-8 py-3 border-2 border-gold-400 text-gold-400 font-sans font-bold rounded-lg hover:bg-gold-400/10 transition-colors"
            >
              {t('hero.cta2', 'Book Safari')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - TODO: Migrate StatsCounter component */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Stats section placeholder</p>
        </div>
      </section>

      {/* Featured Programs - TODO: Migrate program cards */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">{t('programs.title', 'Featured Programs')}</h2>
          <p className="text-center text-cream-300">Programs section placeholder</p>
        </div>
      </section>

      {/* Testimonials - TODO: Migrate Testimonials component */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Testimonials section placeholder</p>
        </div>
      </section>
    </>
  )
}
