'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  Menu,
  X,
  Sun,
  Moon,
  Star,
  User,
  LogOut,
  Gift,
  ChevronDown,
  Info,
  Briefcase,
  Heart,
  Image as ImageIcon,
  Phone,
} from 'lucide-react'
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

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { href: '/about', label: t('about', 'About'), icon: Info },
    { href: '/services', label: t('services', 'Services'), icon: Briefcase },
    { href: '/horses', label: t('horses', 'Horses'), icon: Heart },
    { href: '/rewards', label: t('rewards', 'Rewards'), icon: Gift },
    { href: '/gallery', label: t('gallery', 'Gallery'), icon: ImageIcon },
    { href: '/contact', label: t('contact', 'Contact'), icon: Phone },
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

          <div className="hidden lg:flex items-center gap-3">
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

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-cream-400/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-cream-100" /> : <Moon className="w-5 h-5 text-cream-100" />}
            </button>

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
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
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

            <Link
              href="/booking"
              className="px-5 py-2 bg-gold-500 text-forest-900 font-sans font-bold text-sm rounded-lg hover:bg-gold-400 transition-colors shadow-tactile"
            >
              {t('bookNow', 'Book Now')}
            </Link>
          </div>

          <button
            className="lg:hidden text-cream-100 p-2 rounded-xl bg-cream-100/5 border border-cream-200/20 hover:bg-cream-100/10 transition"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-forest-950/80 backdrop-blur-xl px-4 pt-6 pb-4">
            <div className="mx-auto flex h-full w-full max-w-md flex-col overflow-hidden rounded-3xl border border-cream-200/15 bg-gradient-to-b from-forest-900/95 to-forest-950/95 shadow-2xl">
              <div className="flex items-center justify-between border-b border-cream-200/10 px-5 py-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cream-300/80">Menu</span>
                <button
                  className="rounded-full border border-cream-200/20 bg-cream-100/5 p-2 text-cream-100 hover:bg-cream-100/10"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mb-4 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-3">
                  {isLoggedIn ? (
                    <Link href="/profile" onClick={closeMobileMenu} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/20">
                        <User className="h-5 w-5 text-gold-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-cream-100">{user?.name || user?.email?.split('@')[0]}</p>
                        <p className="flex items-center gap-1 text-xs font-medium text-gold-300">
                          <Star className="h-3.5 w-3.5" /> {user?.points ?? 0} points
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-cream-300/80" />
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between text-sm font-semibold text-cream-100"
                    >
                      {tAuth('login.signIn', 'Sign In')}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-cream-300/80" />
                    </Link>
                  )}
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const active = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`group flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                          active
                            ? 'border-gold-400/40 bg-gold-500/15 text-gold-300'
                            : 'border-cream-200/10 bg-cream-100/5 text-cream-100 hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-300'
                        }`}
                      >
                        <span className="flex items-center gap-3 text-base font-medium">
                          <Icon className="h-4.5 w-4.5" />
                          {link.label}
                        </span>
                        <ChevronDown className="h-4 w-4 -rotate-90 opacity-70 transition group-hover:translate-x-0.5" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-cream-200/10 px-4 py-4">
                <Link
                  href="/booking"
                  onClick={closeMobileMenu}
                  className="mb-3 flex w-full items-center justify-center rounded-2xl bg-gold-500 px-5 py-3 text-sm font-bold text-forest-900 shadow-tactile hover:bg-gold-400"
                >
                  {t('bookNow', 'Book Now')}
                </Link>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex rounded-xl overflow-hidden border border-cream-400/20">
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
                    className="rounded-xl border border-cream-300/20 bg-cream-100/5 p-2.5 text-cream-100 hover:bg-cream-100/10"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                </div>

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      closeMobileMenu()
                      signOut({ callbackUrl: '/' })
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/20"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('signOut', 'Sign Out')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
