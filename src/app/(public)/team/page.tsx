'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Users, User } from 'lucide-react'

const memberKeys = ['ahmad', 'sara', 'omar', 'lana', 'karwan', 'dina'] as const

const memberImages: Record<string, string | null> = {
  ahmad: null,
  sara: null,
  omar: null,
  lana: null,
  karwan: null,
  dina: null,
}

export default function TeamPage() {
  const { t } = useTranslation('team')

  return (
    <div>
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] mb-6">
            <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-sm font-sans text-[var(--color-text-secondary)]">{t('badge')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] font-sans max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberKeys.map((key) => {
              const image = memberImages[key]
              return (
                <div
                  key={key}
                  className="group rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-text-tertiary)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/5] bg-[var(--color-bg-tertiary)] overflow-hidden">
                    {image ? (
                      <Image
                        src={image}
                        alt={t(`members.${key}.name`)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User className="w-24 h-24 text-[var(--color-text-tertiary)] opacity-40" />
                      </div>
                    )}
                    {/* Role badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 text-xs font-sans font-semibold rounded-full bg-[var(--color-bg-primary)]/80 text-[var(--color-text-primary)] backdrop-blur-sm border border-[var(--color-border)]">
                        {t(`members.${key}.role`)}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-[var(--color-text-primary)] mb-2">
                      {t(`members.${key}.name`)}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] font-sans leading-relaxed">
                      {t(`members.${key}.description`)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 md:p-14 text-center">
            <h2 className="text-3xl font-serif font-bold text-[var(--color-text-primary)] mb-4">
              {t('cta.heading')}
            </h2>
            <p className="text-[var(--color-text-secondary)] font-sans max-w-lg mx-auto mb-8">
              {t('cta.text')}
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-sans font-bold text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('cta.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
