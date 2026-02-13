'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getAllHorses } from '@/services/horseService'
import type { Horse } from '@/types'

// TODO: Migrate HorseCard component and full page from old project
// Now fetches from API instead of localStorage

export default function HorsesPage() {
  const { t } = useTranslation('horses')
  const [horses, setHorses] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllHorses()
      .then(setHorses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4 text-center">
            {t('title', 'Our Horses')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto text-center mb-12">
            {t('subtitle', 'Meet our amazing horses')}
          </p>

          {loading ? (
            <p className="text-center text-cream-300">Loading horses...</p>
          ) : horses.length === 0 ? (
            <p className="text-center text-cream-300">{t('empty', 'No horses available')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {horses.map((horse) => (
                <div key={horse.id} className="glass-card rounded-2xl p-6 card-hover">
                  <h3 className="text-xl font-serif font-bold text-cream-100 mb-2">{horse.name}</h3>
                  <p className="text-cream-200 font-sans text-sm">{horse.breed} • {horse.age} years</p>
                  <p className="text-cream-300 font-sans text-sm mt-2">{horse.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
