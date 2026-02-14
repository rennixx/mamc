'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, Star, User, LogOut, Gift, ChevronDown } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useMobileMenu, useLanguage } from '@/hooks/useApp'
import { useAppStore } from '@/store'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { t } = useTranslation('nav')
  const { t: tAuth } = useTranslation('auth')
  const pathname = usePathname()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()
  const { language, setLanguage } = useLanguage()
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const { data: session, status } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const user = session?.user as { name?: string; email?: string; role?: string; points?: number } | undefined

  // Close user menu on outside click
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const navLinks = [
    { href: '/services', label: t('services', 'Services') },
    { href: '/horses', label: t('horses', 'Horses') },
    { href: '/rewards', label: t('rewards', 'Rewards') },
    { href: '/gallery', label: t('gallery', 'Gallery') },
    { href: '/about', label: t('about', 'About') },
    { href: '/contact', label: t('contact', 'Contact') },
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

  const isLoggedIn = status === 'authenticated' && !!user

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass-nav max-w-6xl mx-auto mt-4 rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu} className="flex-shrink-0">
            <Image
              src="/icons/logo.png"
              alt="Mam Center"
              width={120}
              height={48}
              className="h-10 w-auto object-contain dark:brightness-0 dark:invert"
              priority
            />
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
            <div className="flex rounded-lg overflow-hidden border border-cream-400/20">
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-cream-400/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-cream-100" /> : <Moon className="w-5 h-5 text-cream-100" />}
            </button>

            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-400/10 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-cream-100 text-sm font-medium max-w-[100px] truncate">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  {typeof user.points === 'number' && (
                    <span className="flex items-center gap-1 text-gold-400 text-xs font-bold">
                      <Star className="w-3 h-3" />
                      {user.points}
                    </span>
                  )}
                  <ChevronDown className={`w-3 h-3 text-cream-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute end-0 top-full mt-2 w-48 glass-card rounded-xl py-2 shadow-lg">
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-cream-100 hover:bg-cream-400/10 text-sm"
                    >
                      <User className="w-4 h-4" />
                      {tAuth('profile.title', 'My Profile')}
                    </Link>
                    <Link
                      href="/rewards"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-cream-100 hover:bg-cream-400/10 text-sm"
                    >
                      <Gift className="w-4 h-4" />
                      {t('rewards', 'Rewards')}
                    </Link>
                    {(user.role === 'ADMIN' || user.role === 'STAFF') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-cream-100 hover:bg-cream-400/10 text-sm border-t border-cream-400/10"
                      >
                        {tAuth('profile.title', 'Admin Panel')}
                      </Link>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-400/10 text-sm border-t border-cream-400/10"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('signOut', 'Sign Out')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-cream-100 hover:text-gold-400 font-sans text-sm transition-colors"
              >
                {tAuth('login.signIn', 'Sign In')}
              </Link>
            )}

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

            {/* Mobile Auth */}
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="text-xl font-sans text-cream-100 hover:text-gold-400 transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  {tAuth('profile.title', 'My Profile')}
                  {typeof user.points === 'number' && (
                    <span className="flex items-center gap-1 text-gold-400 text-sm">
                      <Star className="w-3 h-3" />{user.points}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => { closeMobileMenu(); signOut({ callbackUrl: '/' }) }}
                  className="text-lg font-sans text-red-400 hover:text-red-300 transition-colors"
                >
                  {t('signOut', 'Sign Out')}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="text-xl font-sans text-cream-100 hover:text-gold-400 transition-colors"
              >
                {tAuth('login.signIn', 'Sign In')}
              </Link>
            )}

            <Link
              href="/booking"
              onClick={closeMobileMenu}
              className="mt-4 px-8 py-3 bg-gold-500 text-forest-900 font-sans font-bold rounded-lg"
            >
              {t('bookNow', 'Book Now')}
            </Link>

            <div className="flex rounded-lg overflow-hidden border border-cream-400/20 mt-4">
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

            <button
              onClick={toggleTheme}
              className="mt-4 p-3 rounded-lg hover:bg-cream-400/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-6 h-6 text-cream-100" /> : <Moon className="w-6 h-6 text-cream-100" />}
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}
