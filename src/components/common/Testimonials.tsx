'use client'

import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  rating: number
  date: string
  profilePhotoUrl?: string
  authorUrl?: string
}

// Fallback testimonials when Google Places API is not available
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmad Hassan',
    role: 'Regular Rider',
    text: 'Amazing experience at Mam Center. The horses are well-trained and the staff is incredibly friendly.',
    rating: 5,
    date: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sara Ali',
    role: 'Family Visit',
    text: 'Perfect place for family outings. My kids loved the horse riding lessons!',
    rating: 5,
    date: '2024-02-20',
  },
  {
    id: '3',
    name: 'Mohammed K.',
    role: 'Safari Guest',
    text: 'The safari tour was breathtaking. Highly recommend for anyone visiting Erbil.',
    rating: 4,
    date: '2024-03-10',
  },
]

interface TestimonialsProps {
  title: string
  subtitle?: string
}

export const Testimonials = ({ title, subtitle }: TestimonialsProps) => {
  const { t } = useTranslation('components')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ]

  if (testimonials.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-forest-800/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream-100 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 glass-card p-3 hover:bg-cream-400/20 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-cream-100" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 glass-card p-3 hover:bg-cream-400/20 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-cream-100" />
          </button>

          {/* Desktop: 3 cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`glass-card p-8 transition-all ${
                  index === 0 ? 'md:scale-105 border-gold-400' : ''
                }`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-gold-400 fill-gold-400'
                          : 'text-cream-400'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-cream-200 font-sans mb-6 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-forest-900 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-cream-100">
                      {testimonial.name}
                    </h4>
                    <p className="text-cream-300 font-sans text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: single card */}
          <div className="md:hidden">
            <div className="glass-card p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? 'text-gold-400 fill-gold-400'
                        : 'text-cream-400'
                    }`}
                  />
                ))}
              </div>
              <p className="text-cream-200 font-sans mb-6 leading-relaxed">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-forest-900 font-bold text-lg">
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-cream-100">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-cream-300 font-sans text-sm">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 transition-all ${
                  index === currentIndex
                    ? 'bg-gold-400 w-8'
                    : 'bg-cream-400/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-cream-200 font-sans mb-4">
            {t('testimonials.joinSatisfied', 'Join our satisfied customers')}
          </p>
        </div>
      </div>
    </section>
  )
}
