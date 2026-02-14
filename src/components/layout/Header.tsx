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
import { createPortal } from 'react-dom'

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

  // Mobile menu accessibility: lock scroll, close on Escape, and trap focus
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeMobileButtonRef = useRef<HTMLButtonElement>(null)
  const [mobileMounted, setMobileMounted] = useState(false)
  const [ignoreBackdrop, setIgnoreBackdrop] = useState(false)

  // manage mount state for animation
  useEffect(() => {
    if (isMobileMenuOpen) setMobileMounted(true)
    else {
      const t = setTimeout(() => setMobileMounted(false), 320)
      return () => clearTimeout(t)
    }
    return
  }, [isMobileMenuOpen])

  // When opening, briefly ignore backdrop clicks to avoid immediate close
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIgnoreBackdrop(false)
      return
    }
    setIgnoreBackdrop(true)
    const id = setTimeout(() => setIgnoreBackdrop(false), 250)
    return () => clearTimeout(id)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!mobileMounted) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu()
      }

      if (e.key === 'Tab') {
        const container = overlayRef.current
        if (!container) return
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    // Move focus to close button when opened
    setTimeout(() => closeMobileButtonRef.current?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [mobileMounted, closeMobileMenu])

  const navLinks = [
    { href: '/', label: t('home', 'Home') },
    { href: '/about', label: t('about', 'About') },
    { href: '/services', label: t('services', 'Services') },
    { href: '/horses', label: t('horses', 'Horses') },
    { href: '/rewards', label: t('rewards', 'Rewards') },
    { href: '/gallery', label: t('gallery', 'Gallery') },
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
      <>
        {/* Desktop / large header (full container) */}
        <nav className="hidden lg:block glass-nav max-w-6xl mx-auto mt-4 rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={closeMobileMenu} className="flex-shrink-0">
              <Image
                src={theme === 'dark' ? '/icons/logo-white.png' : '/icons/logo.png'}
                alt="Mam Center"
                width={120}
                height={48}
                className={`object-contain w-auto ${theme === 'dark' ? 'h-12' : 'h-10'}`}
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
                    <span className="flex items-center gap-1 text-gold-400 text-xs font-bold">
                      <Star className="w-3 h-3" />
                      {user.points ?? 0}
                    </span>
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
          </div>
        </nav>

        {/* Mobile header bar with dropdown menu */}
        <nav
          className="block lg:hidden w-full"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          {/* Header bar - turns black when menu opens */}
          <div
            className={`flex items-center justify-between px-4 py-3 transition-all duration-300 ${isMobileMenuOpen ? 'bg-forest-900 border-b border-white/20' : ''}`}
            style={isMobileMenuOpen ? { borderWidth: '0 0 1.5px 0' } : undefined}
          >
              {/* Logo */}
              <Link href="/" onClick={closeMobileMenu} className="flex-shrink-0">
                <Image
                  src={theme === 'dark' ? '/icons/logo-white.png' : '/icons/logo.png'}
                  alt="Mam Center"
                  width={100}
                  height={36}
                  className="object-contain w-auto h-8"
                  priority
                />
              </Link>

              {/* Menu Button with animated hamburger */}
              <button
                className="text-cream-100 p-3 min-w-[48px] h-12 flex items-center justify-center rounded-lg hover:bg-cream-400/10 transition-colors touch-manipulation"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {/* Top line */}
                  <span
                    className="absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      transform: isMobileMenuOpen
                        ? 'rotate(45deg)'
                        : 'translateY(-6px)',
                    }}
                  />
                  {/* Middle line - fades out */}
                  <span
                    className="absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      opacity: isMobileMenuOpen ? 0 : 1,
                    }}
                  />
                  {/* Bottom line */}
                  <span
                    className="absolute w-6 h-0.5 bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      transform: isMobileMenuOpen
                        ? 'rotate(-45deg)'
                        : 'translateY(6px)',
                    }}
                  />
                </div>
              </button>
          </div>

          {/* Dropdown menu panel */}
          <div
            id="mobile-menu"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-forest-900 border-x border-b border-white/20 ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
            style={{ maxHeight: isMobileMenuOpen ? '80vh' : '0px', borderWidth: '0 1.5px 1.5px 1.5px' }}
          >
            {/* Menu content */}
            <div className="p-4 pb-8 space-y-4">
              {/* Navigation */}
              <nav>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${pathname === link.href ? 'text-gold-400 bg-gold-400/10' : 'text-cream-100 hover:bg-cream-400/5'}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Divider */}
              <div className="border-t border-cream-400/10 pt-4 space-y-4">
                {/* Account section */}
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-cream-100 rounded-lg hover:bg-cream-400/5 transition-all"
                    >
                      <User className="w-5 h-5 opacity-60" />
                      <span className="flex-1">{tAuth('profile.title', 'My Profile')}</span>
                      <span className="text-gold-400 text-sm font-semibold">{user.points ?? 0} pts</span>
                    </Link>
                    <button
                      onClick={() => { closeMobileMenu(); signOut({ callbackUrl: '/' }) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg hover:bg-red-400/10 transition-all border border-red-400/20"
                    >
                      <LogOut className="w-5 h-5" />
                      {t('signOut', 'Sign Out')}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-cream-100 rounded-lg hover:bg-cream-400/5 transition-all"
                  >
                    <User className="w-5 h-5 opacity-60" />
                    {tAuth('login.signIn', 'Sign In')}
                  </Link>
                )}

                {/* Book Now */}
                <Link
                  href="/booking"
                  onClick={closeMobileMenu}
                  className="block w-full py-4 px-6 bg-gold-500 text-forest-900 font-bold text-center rounded-lg hover:bg-gold-400 transition-colors"
                >
                  {t('bookNow', 'Book Now')}
                </Link>

                {/* Settings */}
                <div className="space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-cream-100 rounded-lg hover:bg-cream-400/5 transition-all border border-white/30"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5 opacity-60" /> : <Moon className="w-5 h-5 opacity-60" />}
                    <span className="flex-1 text-left">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${language === lang.code ? 'bg-gold-500 text-forest-900' : 'text-cream-300 hover:bg-cream-400/10'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </>
      </header>
  )
}
