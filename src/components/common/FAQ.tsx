'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
}

export const FAQ = ({
  title = 'Frequently Asked Questions',
  subtitle,
  items,
}: FAQProps) => {
  const { t } = useTranslation('components')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream-100 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-cream-200 font-sans">{subtitle}</p>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-sans font-bold text-cream-100 text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gold-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-cream-200 font-sans leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center glass-card p-8">
          <p className="text-cream-200 font-sans mb-4">
            {t('faq.stillHaveQuestions')}
          </p>
          <a
            href="tel:+9647501234567"
            dir="ltr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-forest-900 font-sans font-bold transition-colors"
          >
            {t('faq.contactUs')}
          </a>
        </div>
      </div>
    </section>
  )
}
