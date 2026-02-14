'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-forest-900 border-t border-cream-400/20 py-12">
      <div className="container-breathable">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-serif font-bold text-gold-400 mb-3">
              Mam Center
            </h3>
            <p className="text-cream-200 font-sans text-sm">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-3">
              {t('quickLinks')}
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/services" className="text-cream-200 hover:text-gold-400 text-sm font-sans transition-colors">{t('links.services')}</Link>
              <Link href="/horses" className="text-cream-200 hover:text-gold-400 text-sm font-sans transition-colors">{t('links.horses')}</Link>
              <Link href="/gallery" className="text-cream-200 hover:text-gold-400 text-sm font-sans transition-colors">{t('links.gallery')}</Link>
              <Link href="/about" className="text-cream-200 hover:text-gold-400 text-sm font-sans transition-colors">{t('links.about')}</Link>
              <Link href="/contact" className="text-cream-200 hover:text-gold-400 text-sm font-sans transition-colors">{t('links.contact')}</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-3">
              {t('contactInfo')}
            </h4>
            <div className="flex flex-col gap-2 text-cream-200 text-sm font-sans">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400" />
                <span>{t('phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>{t('email')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span>{t('location')}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-cream-100 font-sans font-semibold mb-3">
              {t('hours')}
            </h4>
            <div className="text-cream-200 text-sm font-sans space-y-1">
              <p>{t('businessHours.weekdays')}</p>
              <p>{t('businessHours.weekends')}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-cream-400/20 text-center">
          <p className="text-cream-300 text-sm font-sans">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}
