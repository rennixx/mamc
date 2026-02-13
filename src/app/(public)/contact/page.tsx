'use client'

import { useTranslation } from 'react-i18next'

// TODO: Migrate full ContactPage from old project
// Sections: Hero, Contact Form (now submits to API), Contact Info, GoogleMaps

export default function ContactPage() {
  const { t } = useTranslation('contact')

  return (
    <div className="pt-24">
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('title', 'Contact Us')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('subtitle', 'Get in touch with us')}
          </p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-breathable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form - TODO */}
            <div className="glass-card rounded-2xl p-8">
              <p className="text-cream-300">Contact form placeholder (will submit to /api/contact)</p>
            </div>

            {/* Contact Info - TODO */}
            <div>
              <p className="text-cream-300">Contact info & map placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
