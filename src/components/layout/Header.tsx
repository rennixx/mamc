'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { useMobileMenu, useLanguage } from '@/hooks/useApp'
import { useAppStore } from '@/store'

export function Header() {
  const { t } = useTranslation('nav')
  const pathname = usePathname()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()
  const { language, setLanguage } = useLanguage()

  const navLinks = [
    { href: '/academy', label: t('academy', 'Academy') },
    { href: '/safari', label: t('safari', 'Safari') },
    { href: '/horses', label: t('horses', 'Horses') },
    { href: '/about', label: t('about', 'About') },
    { href: '/contact', label: t('contact', 'Contact') },
    { href: '/coffee', label: t('coffee', 'Coffee') },
    { href: '/gallery', label: t('gallery', 'Gallery') },
  ]

  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ku' as const, label: 'کوردی' },
    { code: 'ar' as const, label: 'عربي' },
  ]

  const handleLanguageChange = (lang: 'en' | 'ku' | 'ar') => {
    setLanguage(lang)
    closeMobileMenu()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass-nav mx-4 mt-4 rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-serif font-bold text-gold-400" onClick={closeMobileMenu}>
            Mam Center
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'text-gold-400' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex rounded-lg overflow-hidden border border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`lang-button ${language === lang.code ? 'lang-button-active' : 'lang-button-inactive'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Book Now CTA */}
            <Link
              href="/booking"
              className="px-5 py-2 bg-gold-500 text-forest-900 font-sans font-bold text-sm rounded-lg hover:bg-gold-400 transition-colors shadow-tactile"
            >
              {t('bookNow', 'Book Now')}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-cream-100 p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-0 bg-forest-900/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center gap-6">
            <button
              className="absolute top-6 right-6 text-cream-100 p-2"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-2xl font-sans ${pathname === link.href ? 'text-gold-400' : 'text-cream-100'} hover:text-gold-400 transition-colors`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/booking"
              onClick={closeMobileMenu}
              className="mt-4 px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-lg"
            >
              {t('bookNow', 'Book Now')}
            </Link>

            <div className="flex rounded-lg overflow-hidden border border-white/10 mt-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`lang-button ${language === lang.code ? 'lang-button-active' : 'lang-button-inactive'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
