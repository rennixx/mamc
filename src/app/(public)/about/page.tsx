'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Heart, Shield, Users, Award, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const { t } = useTranslation('about')

  const values = [
    { icon: Shield, titleKey: 'values.professionalism.title', descKey: 'values.professionalism.desc' },
    { icon: Heart, titleKey: 'values.passion.title', descKey: 'values.passion.desc' },
    { icon: Users, titleKey: 'values.community.title', descKey: 'values.community.desc' },
    { icon: Award, titleKey: 'values.excellence.title', descKey: 'values.excellence.desc' },
  ]

  const facilityImages = [
    { src: '/images/facility/entrance.jpg', altKey: 'facility.entrance' },
    { src: '/images/facility/stable-interior.png', altKey: 'facility.stableInterior' },
    { src: '/images/facility/stable-exterior.png', altKey: 'facility.stableExterior' },
    { src: '/images/facility/indoor-arena.png', altKey: 'facility.indoorArena' },
    { src: '/images/facility/riding-arena.png', altKey: 'facility.ridingArena' },
    { src: '/images/facility/clubhouse.png', altKey: 'facility.clubhouse' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-cream-200 font-sans max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Image + Mission */}
      <section className="pb-20">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury">
              <Image
                src="/images/facility/riding-arena.png"
                alt="Mam Center riding arena"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream-100 mb-6">
                {t('mission.heading')}
              </h2>
              <p className="text-cream-200 font-sans text-base leading-relaxed mb-6">
                {t('mission.text1')}
              </p>
              <p className="text-cream-200 font-sans text-base leading-relaxed">
                {t('mission.text2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">{t('values.heading')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value) => (
              <div key={value.titleKey} className="glass-card rounded-2xl p-8 text-center card-hover">
                <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-cream-100 mb-3">{t(value.titleKey)}</h3>
                <p className="text-cream-300 font-sans text-sm">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {['ahmad', 'sara', 'omar', 'lana', 'karwan', 'dina'].map((key) => {
              const hasImage = key === 'ahmad'
              return (
                <div
                  key={key}
                  className="group rounded-2xl overflow-hidden border border-cream-400/20 bg-forest-800/50 hover:bg-forest-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/5] bg-forest-900/50 overflow-hidden">
                    {hasImage ? (
                      <Image
                        src="/images/facility/riding-arena.png"
                        alt={t(`team.members.${key}.name`)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Users className="w-24 h-24 text-cream-400/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-cream-100 mb-2">
                      {t(`team.members.${key}.name`)}
                    </h3>
                    <p className="text-cream-300 font-sans text-sm leading-relaxed">
                      {t(`team.members.${key}.role`)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Facility Gallery */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <h2 className="section-heading">{t('facility.heading')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {facilityImages.map((img) => (
              <div key={img.altKey} className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <Image
                  src={img.src}
                  alt={t(img.altKey)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="absolute bottom-4 left-4 text-white font-sans font-semibold">
                    {t(img.altKey)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Responsibility */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable">
          <div className="glass-card rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto">
            <Heart className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-cream-100 mb-6">
              {t('socialResponsibility.heading')}
            </h2>
            <p className="text-cream-200 font-sans text-base leading-relaxed">
              {t('socialResponsibility.text')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing border-t border-cream-400/10">
        <div className="container-breathable text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream-100 mb-4">
            {t('cta.heading')}
          </h2>
          <p className="text-cream-200 font-sans text-lg max-w-xl mx-auto mb-8">
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
