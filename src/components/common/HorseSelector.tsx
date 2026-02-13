'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { horseService } from '@/services'
import { HorseCard } from './HorseCard'
import type { Horse } from '@/types'

type ExperienceLevel = 'BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED'

interface HorseSelectorProps {
  riderCount: number
  selectedHorses: string[]
  onHorseSelect: (riderIndex: number, horseId: string) => void
  showWarningFor?: ExperienceLevel
}

export const HorseSelector = ({
  riderCount,
  selectedHorses,
  onHorseSelect,
  showWarningFor,
}: HorseSelectorProps) => {
  const { t } = useTranslation('components')
  const [horses, setHorses] = useState<Horse[]>([])

  useEffect(() => {
    horseService.getAll()
      .then((res) => {
        const available = (res as Horse[]).filter((h) => h.available)
        setHorses(available)
      })
      .catch(console.error)
  }, [])

  const riders = Array.from({ length: riderCount }, (_, i) => i)

  return (
    <div className="space-y-6 md:space-y-8">
      {riders.map((riderIndex) => {
        const selectedHorseId = selectedHorses[riderIndex]

        return (
          <div key={riderIndex} className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gold-400 text-forest-900 font-sans font-bold rounded-full text-sm md:text-base">
                {riderIndex + 1}
              </div>
              <h4 className="text-base md:text-lg font-sans font-bold text-cream-100">
                {riderIndex === 0
                  ? t('horses.yourHorse', 'Your Horse')
                  : t('horses.riderHorse', `Rider ${riderIndex + 1}'s Horse`)}
              </h4>
              {selectedHorseId && (
                <span className="ml-auto px-2 py-0.5 md:px-3 md:py-1 bg-green-500/20 text-green-400 text-xs md:text-sm font-sans rounded-full">
                  ✓ {t('horses.selected')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {horses.map((horse) => (
                <HorseCard
                  key={horse.id}
                  horse={horse}
                  selected={selectedHorseId === horse.id}
                  selectable={true}
                  onClick={() => onHorseSelect(riderIndex, horse.id)}
                  showWarningFor={showWarningFor}
                />
              ))}
            </div>

            {horses.length === 0 && (
              <div className="p-4 md:p-6 bg-yellow-500/10 border border-yellow-400/30 rounded-lg text-center">
                <p className="text-yellow-400 font-sans text-sm md:text-base">
                  {t(
                    'horses.noHorsesAvailable',
                    'No horses are currently available. Please try again later.'
                  )}
                </p>
              </div>
            )}
          </div>
        )
      })}

      {selectedHorses.filter(Boolean).length === riderCount && (
        <div className="p-3 md:p-4 bg-green-500/20 border border-green-400/50 rounded-lg">
          <p className="text-green-400 font-sans font-semibold text-center text-sm md:text-base">
            {t(
              'horses.allSelected',
              'All horses selected! You can continue to the next step.'
            )}
          </p>
        </div>
      )}
    </div>
  )
}
