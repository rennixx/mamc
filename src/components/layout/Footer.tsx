'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-forest-900 border-t border-cream-400/20 py-8 md:py-12">
      <div className="container-breathable px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold text-gold-400 mb-2 md:mb-3">
              Mam Center
            </h3>
            <p className="text-cream-200 font-sans text-xs md:text-sm">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-2 md:mb-3 text-sm md:text-base">
              {t('quickLinks')}
            </h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <Link href="/services" className="text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation">{t('links.services')}</Link>
              <Link href="/horses" className="text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation">{t('links.horses')}</Link>
              <Link href="/gallery" className="text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation">{t('links.gallery')}</Link>
              <Link href="/about" className="text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation">{t('links.about')}</Link>
              <Link href="/contact" className="text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation">{t('links.contact')}</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-2 md:mb-3 text-sm md:text-base">
              {t('contactInfo')}
            </h4>
            <div className="flex flex-col gap-1.5 md:gap-2 text-cream-200 text-xs md:text-sm font-sans">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-400 flex-shrink-0" />
                <span className="break-all">{t('phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-400 flex-shrink-0" />
                <span className="break-all">{t('email')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-400 flex-shrink-0" />
                <span className="break-all">{t('location')}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-2 md:mb-3 text-sm md:text-base">
              {t('hours')}
            </h4>
            <div className="text-cream-200 text-xs md:text-sm font-sans space-y-0.5 md:space-y-1">
              <p>{t('businessHours.weekdays')}</p>
              <p>{t('businessHours.weekends')}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-cream-400/20 text-center">
          <p className="text-cream-300 text-xs md:text-sm font-sans">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
