'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ArrowRight, Users, Trophy, Shield, Heart, Truck, TreePine, ChevronLeft, ChevronRight, PawPrint, Award } from 'lucide-react'

export default function HomePage() {
  const { t } = useTranslation('home')
  const [currentSlide, setCurrentSlide] = useState(0)

  const stats = [
    { icon: Trophy, labelKey: 'experience.stats.years', descKey: 'experience.stats.yearsDesc' },
    { icon: Users, labelKey: 'experience.stats.riders', descKey: 'experience.stats.ridersDesc' },
    { icon: PawPrint, labelKey: 'experience.stats.horses', descKey: 'experience.stats.horsesDesc' },
    { icon: Award, labelKey: 'experience.stats.trainers', descKey: 'experience.stats.trainersDesc' },
  ]

  const services = [
    { icon: Users, titleKey: 'services.beginners.title', descKey: 'services.beginners.desc' },
    { icon: Trophy, titleKey: 'services.jumping.title', descKey: 'services.jumping.desc' },
    { icon: Shield, titleKey: 'services.stableRental.title', descKey: 'services.stableRental.desc' },
    { icon: Truck, titleKey: 'services.transportation.title', descKey: 'services.transportation.desc' },
    { icon: TreePine, titleKey: 'services.safari.title', descKey: 'services.safari.desc' },
    { icon: Heart, titleKey: 'services.socialResponsibility.title', descKey: 'services.socialResponsibility.desc' },
  ]

  return (
    <div className="-mt-20 md:-mt-24">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-6rem)] md:min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/horses/equestrian-training.jpg"
          alt="Mam Center Equestrian Club"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        <div className="relative text-center z-10 px-4 md:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-4 md:mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-sans mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/booking"
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 bg-white text-black font-sans font-bold rounded-xl hover:bg-white/90 transition-all shadow-luxury text-base md:text-lg touch-manipulation"
            >
              {t('hero.bookNow')}
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 md:px-10 py-3 md:py-4 border-2 border-white text-white font-sans font-bold rounded-xl hover:bg-white/10 transition-all text-base md:text-lg touch-manipulation"
            >
              {t('hero.ourServices')}
            </Link>
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* Experience Section - Carousel */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">{t('experience.heading')}</h2>
          <p className="section-subheading">
            {t('experience.subheading')}
          </p>

          {/* Carousel Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="glass-card rounded-2xl p-12 md:p-16 text-center">
                      <stat.icon className="w-16 h-16 md:w-20 md:h-20 text-gold-400 mx-auto mb-6" />
                      <div className="text-5xl md:text-7xl font-serif font-bold text-cream-100 mb-4">
                        {t(stat.labelKey)}
                      </div>
                      <p className="text-lg md:text-xl text-cream-200 font-sans">
                        {t(stat.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={() => setCurrentSlide((s) => s === 0 ? stats.length - 1 : s - 1)}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-500 text-forest-900 flex items-center justify-center hover:bg-gold-400 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide((s) => (s + 1) % stats.length)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-500 text-forest-900 flex items-center justify-center hover:bg-gold-400 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-gold-500' : 'bg-cream-400/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-spacing">
        <div className="container-breathable">
          <h2 className="section-heading">{t('services.heading')}</h2>
          <p className="section-subheading">
            {t('services.subheading')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.titleKey}
                className="glass-card rounded-2xl p-8 card-hover group"
              >
                <service.icon className="w-10 h-10 text-cream-100 mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-serif font-bold text-cream-100 mb-3">
                  {t(service.titleKey)}
                </h3>
                <p className="text-cream-300 font-sans text-sm leading-relaxed">
                  {t(service.descKey)}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-tactile"
            >
              {t('services.viewAll')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Teaser */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/facility/riding-arena.png"
                alt="Mam Center riding arena"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-cream-100 mb-6">
                {t('story.heading')}
              </h2>
              <p className="text-cream-200 font-sans text-lg leading-relaxed mb-6">
                {t('story.text')}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-gold-400 font-sans font-semibold hover:gap-3 transition-all"
              >
                {t('story.learnMore')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-cream-100 mb-6">
            {t('cta.heading')}
          </h2>
          <p className="text-cream-200 font-sans text-lg max-w-xl mx-auto mb-10">
            {t('cta.text')}
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-10 py-4 bg-gold-500 text-forest-900 font-sans font-bold rounded-xl hover:bg-gold-400 transition-colors shadow-luxury text-lg"
          >
            {t('cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
