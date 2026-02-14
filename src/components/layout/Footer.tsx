'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Signature } from './Signature'

// Social icon components (using SVG to avoid deprecated lucide-react icons)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="9.5 8.5, 15.5 12, 9.5 15.5" />
  </svg>
)

export function Footer() {
  const { t } = useTranslation('common')
  const footerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Scroll-triggered animation (fade in when entering, fade out when leaving)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  const handleNewsletterSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(emailValue)) {
      setSubmitStatus('success')
      setEmailValue('')
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } else {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    }
  }

  // Animation style for each section
  const getSectionStyle = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transitionDelay: `${index * 100}ms`,
  })

  // Social media links (placeholder URLs)
  const socialLinks = [
    { icon: InstagramIcon, href: 'https://instagram.com', label: t('social.instagram') },
    { icon: FacebookIcon, href: 'https://facebook.com', label: t('social.facebook') },
    { icon: TwitterIcon, href: 'https://twitter.com', label: t('social.twitter') },
    { icon: YoutubeIcon, href: 'https://youtube.com', label: t('social.youtube') },
  ]

  return (
    <footer
      ref={footerRef}
      className="bg-forest-900 border-t border-cream-400/20 py-10 md:py-14"
    >
      <div className="container-breathable px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {/* Brand */}
          <div
            style={getSectionStyle(0)}
            className="glass rounded-lg p-4 md:p-5 transition-all duration-300 hover:bg-white/5"
          >
            <h3 className="text-lg md:text-xl font-serif font-bold text-gold-400 mb-2 md:mb-3">
              Mam Center
            </h3>
            <p className="text-cream-200 font-sans text-xs md:text-sm">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div
            style={getSectionStyle(1)}
            className="glass rounded-lg p-4 md:p-5 transition-all duration-300 hover:bg-white/5"
          >
            <h4 className="text-cream-100 font-sans font-semibold mb-3 text-sm md:text-base">
              {t('quickLinks')}
            </h4>
            <div className="flex flex-col gap-1.5 items-start text-left">
              <FooterLink href="/services" label={t('links.services')} />
              <FooterLink href="/horses" label={t('links.horses')} />
              <FooterLink href="/gallery" label={t('links.gallery')} />
              <FooterLink href="/about" label={t('links.about')} />
              <FooterLink href="/contact" label={t('links.contact')} />
            </div>
          </div>

          {/* Contact Info */}
          <div
            style={getSectionStyle(2)}
            className="glass rounded-lg p-4 md:p-5 transition-all duration-300 hover:bg-white/5"
          >
            <h4 className="text-cream-100 font-sans font-semibold mb-3 text-sm md:text-base">
              {t('contactInfo')}
            </h4>
            <div className="flex flex-col gap-2 text-cream-200 text-xs md:text-sm font-sans">
              <div className="flex items-center gap-2 group">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="break-all">{t('phone')}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="break-all">{t('email')}</span>
              </div>
              <div className="flex items-center gap-2 group">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="break-all">{t('location')}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div
            style={getSectionStyle(3)}
            className="glass rounded-lg p-4 md:p-5 transition-all duration-300 hover:bg-white/5"
          >
            <h4 className="text-cream-100 font-sans font-semibold mb-2 text-sm md:text-base">
              {t('newsletter.title')}
            </h4>
            <p className="text-cream-300 text-xs mb-3 font-sans">
              {t('newsletter.description')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="w-full px-3 py-2 rounded-md bg-forest-800 border border-cream-400/20 text-cream-100 text-xs font-sans placeholder:text-cream-400/50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 rounded-md bg-gold-400 text-forest-900 text-xs font-sans font-semibold hover:bg-gold-300 active:translate-y-0.5 transition-all duration-300"
              >
                {t('newsletter.button')}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-400 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {t('newsletter.success')}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {t('newsletter.error')}
                </p>
              )}
            </form>
          </div>

          {/* Social + Hours */}
          <div
            style={getSectionStyle(4)}
            className="glass rounded-lg p-4 md:p-5 transition-all duration-300 hover:bg-white/5"
          >
            <h4 className="text-cream-100 font-sans font-semibold mb-3 text-sm md:text-base">
              {t('social.followUs')}
            </h4>
            <div className="flex gap-3 mb-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-forest-800 border border-cream-400/20 flex items-center justify-center text-gold-400 hover:text-gold-300 hover:bg-gold-400 hover:text-forest-900 hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <h5 className="text-cream-100 font-sans font-semibold mb-2 text-xs">
              {t('hours')}
            </h5>
            <div className="text-cream-200 text-xs font-sans space-y-1">
              <p>{t('businessHours.weekdays')}</p>
              <p>{t('businessHours.weekends')}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease 500ms',
          }}
          className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-cream-400/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <p className="text-cream-300 text-xs md:text-sm font-sans">
              {t('copyright', { year: new Date().getFullYear() })}
            </p>
            <span className="hidden md:inline text-cream-400/50">•</span>
            <div className="flex items-center gap-2">
              <span className="text-cream-400/70 text-xs font-sans">{t('madeBy')}</span>
              <a
                href="https://www.instagram.com/icyrendev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <Signature className="h-7 md:h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Footer link component with animated underline
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="footer-link text-cream-200 hover:text-gold-400 text-xs md:text-sm font-sans transition-colors touch-manipulation relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-px after:bg-gold-400 after:transition-all after:duration-300 hover:after:w-full"
    >
      {label}
    </Link>
  )
}
