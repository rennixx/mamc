'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full AboutPage from old project
// 5 chapters: HeroChapter, HorsesChapter, LandChapter, ValuesChapter, FacilityChapter

export default function AboutPage() {
  const { t } = useTranslation('about')

  return (
    <div className="pt-24">
      {/* Chapter 1: Hero/Vision */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('hero.title', 'Our Story')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('hero.subtitle', 'The journey of Mam Center')}
          </p>
        </div>
      </section>

      {/* Chapter 2: Horses - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Horses chapter placeholder</p>
        </div>
      </section>

      {/* Chapter 3: Land - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Land chapter placeholder</p>
        </div>
      </section>

      {/* Chapter 4: Values - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Values chapter placeholder</p>
        </div>
      </section>

      {/* Chapter 5: Facility - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <p className="text-center text-cream-300">Facility chapter placeholder</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-saddle-600/20">
        <div className="container-breathable text-center">
          <p className="text-cream-300">CTA section placeholder</p>
        </div>
      </section>
    </div>
  )
}
