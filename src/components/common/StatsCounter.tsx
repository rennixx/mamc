'use client'

import { Users, Calendar, Heart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

interface Stat {
  icon: ReactNode
  value: number
  suffix?: string
  label: string
}

interface StatsCounterProps {
  stats: Stat[]
}

export const StatsCounter = ({ stats }: StatsCounterProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0))
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    stats.forEach((stat, index) => {
      let currentCount = 0
      const increment = stat.value / steps

      const timer = setInterval(() => {
        currentCount += increment
        if (currentCount >= stat.value) {
          currentCount = stat.value
          clearInterval(timer)
        }
        setCounts((prev) => {
          const newCounts = [...prev]
          newCounts[index] = Math.floor(currentCount)
          return newCounts
        })
      }, interval)

      return () => clearInterval(timer)
    })
  }, [isVisible, stats])

  return (
    <div
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-forest-900/60 to-transparent"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-card p-8 text-center transform transition-all duration-500 hover:scale-105"
              style={{
                transitionDelay: `${index * 100}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-400/20 mb-6">
                <div className="text-gold-400">{stat.icon}</div>
              </div>
              <div className="text-5xl font-serif font-bold text-cream-100 mb-2">
                {counts[index]}
                {stat.suffix}
              </div>
              <div className="text-lg font-sans text-cream-300 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const defaultStats: Stat[] = [
  { icon: <Users className="w-8 h-8" />, value: 500, suffix: '+', label: 'Happy Riders' },
  { icon: <Calendar className="w-8 h-8" />, value: 10, suffix: '', label: 'Years Experience' },
  { icon: <Heart className="w-8 h-8" />, value: 50, suffix: '+', label: 'Beautiful Horses' },
]

export const useDefaultStats = (): Stat[] => {
  const { t } = useTranslation('components')
  return [
    { icon: <Users className="w-8 h-8" />, value: 500, suffix: '+', label: t('stats.happyRiders') },
    { icon: <Calendar className="w-8 h-8" />, value: 10, suffix: '', label: t('stats.yearsExperience') },
    { icon: <Heart className="w-8 h-8" />, value: 50, suffix: '+', label: t('stats.horses') },
  ]
}
