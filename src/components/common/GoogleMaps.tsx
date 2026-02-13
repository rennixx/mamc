'use client'

import { MapPin, Navigation } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface GoogleMapsProps {
  embedUrl: string
  title?: string
}

export const GoogleMaps = ({ embedUrl, title }: GoogleMapsProps) => {
  const { t } = useTranslation('components')

  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-gold-400" />
          <h3 className="text-2xl font-serif font-bold text-cream-100">
            {title || t('maps.title')}
          </h3>
        </div>
        <a
          href="https://maps.google.com/?q=36.191884621340066,43.98118538641222"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-cream-100 font-sans font-semibold transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>{t('maps.getDirections')}</span>
        </a>
      </div>

      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="MAM Center Location"
          className="w-full h-full"
        />

        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-sm bg-forest-900/95 backdrop-blur-md border border-gold-400/20 p-6 shadow-luxury-lg">
          <div className="flex items-start gap-3">
            <MapPin className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-sans font-bold text-cream-100 mb-2">
                {t('maps.centerName')}
              </h4>
              <p className="text-cream-200 font-sans text-sm leading-relaxed mb-4">
                {t('maps.address.line1')}
                <br />
                {t('maps.address.line2')}
                <br />
                {t('maps.address.line3')}
              </p>
              <div className="flex flex-col gap-2 text-sm font-sans">
                <a
                  href="tel:+9647501234567"
                  dir="ltr"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  📞 +964 750 123 4567
                </a>
                <a
                  href="mailto:info@mamcenter.com"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  ✉️ info@mamcenter.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-cream-400/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-sans">
          <div>
            <div className="text-gold-400 font-bold mb-2">
              🚗 {t('maps.info.fromErbilTitle')}
            </div>
            <div className="text-cream-300">{t('maps.info.fromErbil')}</div>
          </div>
          <div>
            <div className="text-gold-400 font-bold mb-2">
              🅿️ {t('maps.info.parkingTitle')}
            </div>
            <div className="text-cream-300">{t('maps.info.parking')}</div>
          </div>
          <div>
            <div className="text-gold-400 font-bold mb-2">
              🕐 {t('maps.info.hoursTitle')}
            </div>
            <div className="text-cream-300">{t('maps.info.hours')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
