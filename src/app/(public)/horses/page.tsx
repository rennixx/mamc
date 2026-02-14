'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getAllHorses } from '@/services/horseService'
import type { Horse } from '@/types'
import { Loader2 } from 'lucide-react'

const experienceLevels = ['ALL', 'BEGINNER', 'NOVICE', 'INTERMEDIATE', 'ADVANCED'] as const
const filterKeyMap: Record<string, string> = {
  ALL: 'filter.all',
  BEGINNER: 'filter.beginner',
  NOVICE: 'filter.novice',
  INTERMEDIATE: 'filter.intermediate',
  ADVANCED: 'filter.advanced',
}

const placeholderImages = [
  '/images/horses/horse-1.jpg',
  '/images/horses/horse-2.jpg',
]

export default function HorsesPage() {
  const { t } = useTranslation('horses')
  const [horses, setHorses] = useState<Horse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  useEffect(() => {
    getAllHorses()
      .then(setHorses)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredHorses =
    filter === 'ALL'
      ? horses
      : horses.filter((h) => h.suitableFor.includes(filter as Horse['suitableFor'][number]))

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="pb-8">
        <div className="container-breathable">
          <div className="flex flex-wrap justify-center gap-2">
            {experienceLevels.map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all ${
                  filter === level
                    ? 'bg-gold-500 text-forest-900 shadow-tactile'
                    : 'bg-cream-400/10 text-cream-200 hover:bg-cream-400/20'
                }`}
              >
                {t(filterKeyMap[level])}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Horse Cards */}
      <section className="pb-20">
        <div className="container-breathable">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-cream-300" />
            </div>
          ) : filteredHorses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cream-300 font-sans text-lg">
                {horses.length === 0
                  ? t('empty.noHorses')
                  : t('empty.noMatch')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHorses.map((horse, index) => (
                <div
                  key={horse.id}
                  className="glass-card rounded-2xl overflow-hidden card-hover group"
                >
                  {/* Portrait Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={horse.image || placeholderImages[index % placeholderImages.length]}
                      alt={horse.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-serif font-bold text-white mb-1">
                        {horse.name}
                      </h3>
                      <p className="text-white/80 font-sans text-sm">
                        {horse.breed} · {horse.age} · {horse.color}
                      </p>
                    </div>

                    {/* Availability badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
                          horse.available
                            ? 'bg-green-500/90 text-white'
                            : 'bg-red-500/90 text-white'
                        }`}
                      >
                        {horse.available ? t('status.available') : t('status.unavailable')}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    {horse.description && (
                      <p className="text-cream-300 font-sans text-sm mb-3 line-clamp-2">
                        {horse.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {horse.suitableFor.map((level) => (
                        <span
                          key={level}
                          className="px-2.5 py-1 bg-cream-400/10 text-cream-200 text-xs font-sans rounded-full"
                        >
                          {t(`filter.${level.toLowerCase()}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
