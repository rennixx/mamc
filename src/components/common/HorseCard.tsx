'use client'

import { Ban, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Horse } from '@/types'

type ExperienceLevel = 'BEGINNER' | 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED'

interface HorseCardProps {
  horse: Horse
  selected?: boolean
  selectable?: boolean
  onClick?: () => void
  showWarningFor?: ExperienceLevel
}

export const HorseCard = ({
  horse,
  selected = false,
  selectable = false,
  onClick,
  showWarningFor,
}: HorseCardProps) => {
  const { t } = useTranslation(['components', 'horses'])

  const isUnsuitable =
    showWarningFor && !horse.suitableFor.includes(showWarningFor)

  return (
    <button
      onClick={selectable ? onClick : undefined}
      disabled={selectable && !horse.available}
      className={`
        group relative w-full overflow-hidden transition-all duration-300
        ${selectable ? 'cursor-pointer' : 'cursor-default'}
        ${!selectable && !horse.available ? 'opacity-60' : ''}
        ${selected ? 'ring-2 ring-gold-400 scale-105' : 'hover:scale-105'}
        ${selectable && !horse.available ? 'cursor-not-allowed' : ''}
      `}
    >
      <div className="relative glass-card aspect-[3/4] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/50 to-forest-900/80 z-0" />

        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          {horse.image ? (
            <img
              src={horse.image}
              alt={horse.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-400/5 to-gold-400/10">
              <span className="text-6xl drop-shadow-2xl opacity-50">🐴</span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 z-20 flex items-end justify-center px-3 py-3 md:px-4 md:py-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-forest-900/90 via-forest-900/60 to-transparent md:from-forest-900/95 md:via-forest-900/70">
          <div className="w-full max-w-sm space-y-1.5 md:space-y-2 text-sm md:text-base text-center">
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-2 md:mb-3">
              <div className="bg-cream-400/5 rounded-lg p-1.5 md:p-2 text-center">
                <span className="block text-cream-400 text-[10px] md:text-xs">
                  {t('age', { ns: 'horses' })}
                </span>
                <span className="block text-cream-100 font-semibold text-xs md:text-sm">
                  {horse.age}
                </span>
              </div>
              <div className="bg-cream-400/5 rounded-lg p-1.5 md:p-2 text-center">
                <span className="block text-cream-400 text-[10px] md:text-xs">
                  {t('gender', { ns: 'horses' })}
                </span>
                <span className="block text-cream-100 font-semibold text-[10px] md:text-xs">
                  {t(`genders.${horse.gender}`, { ns: 'horses' })}
                </span>
              </div>
            </div>

            <div className="bg-cream-400/5 rounded-lg p-1.5 md:p-2 mb-1.5 md:mb-2 text-center">
              <span className="text-cream-400 text-[10px] md:text-xs">
                {t('color', { ns: 'horses' })}: 
              </span>
              <span className="text-cream-100 font-semibold text-xs md:text-sm">
                {horse.color}
              </span>
            </div>

            {horse.maxWeight && (
              <div className="bg-cream-400/5 rounded-lg p-1.5 md:p-2 mb-2 md:mb-3 text-center">
                <span className="text-cream-400 text-[10px] md:text-xs">
                  {t('maxWeight', { ns: 'horses' })}: 
                </span>
                <span className="text-cream-100 font-semibold text-xs md:text-sm">
                  {horse.maxWeight} kg
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-0.5 md:gap-1 justify-center">
              {horse.suitableFor.map((level) => (
                <span
                  key={level}
                  className="px-1.5 py-0.5 md:px-2 md:py-0.5 bg-gold-400/20 text-gold-300 text-[10px] md:text-xs font-sans rounded-full border border-gold-400/30"
                >
                  {t(`levels.${level}`, { ns: 'horses' })}
                </span>
              ))}
            </div>

            {isUnsuitable && (
              <div className="mt-2 md:mt-3 p-1.5 md:p-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 md:gap-1.5">
                  <Info className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-400 text-[10px] md:text-xs leading-snug">
                    {t(
                      'horses.unsuitableWarning',
                      'This horse may not be suitable for your experience level.'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!horse.available && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-30">
            <div className="flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-red-500/90 text-white text-[10px] md:text-xs font-sans font-semibold rounded-full shadow-lg">
              <Ban className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="truncate max-w-[80px] md:max-w-none">
                {horse.unavailableReason ||
                  t('availability.unavailable', { ns: 'horses' })}
              </span>
            </div>
          </div>
        )}

        {selected && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-30">
            <div className="flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 bg-gold-400 text-forest-900 text-[10px] md:text-xs font-sans font-bold rounded-full shadow-lg">
              <span className="text-green-600 text-xs md:text-sm">✓</span>
              <span>{t('selected', { ns: 'components' })}</span>
            </div>
          </div>
        )}
      </div>
    </button>
  )
}
