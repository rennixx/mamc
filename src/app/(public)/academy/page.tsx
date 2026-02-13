'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full AcademyPage from old project
// Sections: Programs (4 cards), Instructors (3), Schedule table, BookingCalendar, FAQ

export default function AcademyPage() {
  const { t } = useTranslation('academy')

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Riding Academy')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Learn to ride with our expert instructors')}
          </p>
        </div>
      </section>

      {/* Programs - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">{t('programs.title', 'Our Programs')}</h2>
          <p className="text-center text-cream-300">Programs section placeholder</p>
        </div>
      </section>

      {/* Instructors - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">{t('instructors.title', 'Meet Our Instructors')}</h2>
          <p className="text-center text-cream-300">Instructors section placeholder</p>
        </div>
      </section>

      {/* Schedule - TODO */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">{t('schedule.title', 'Weekly Schedule')}</h2>
          <p className="text-center text-cream-300">Schedule section placeholder</p>
        </div>
      </section>
    </div>
  )
}
