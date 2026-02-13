'use client'

import { useTranslation } from 'react-i18next'
import { Menu, Bell, Sun, Moon } from 'lucide-react'
import { useMobileMenu, useLanguage } from '@/hooks/useApp'
import { useAppStore } from '@/store'

export function AdminHeader() {
  const { t } = useTranslation('admin')
  const { toggleMobileMenu } = useMobileMenu()
  const { language, setLanguage } = useLanguage()
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ku' as const, label: 'KU' },
    { code: 'ar' as const, label: 'AR' },
  ]

  return (
    <header className="h-16 border-b border-cream-400/20 flex items-center justify-between px-6">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden text-cream-100 p-2"
        onClick={toggleMobileMenu}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="hidden lg:block" />

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Language switcher */}
        <div className="flex rounded-lg overflow-hidden border border-cream-400/20">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2 py-1 text-xs font-bold transition-all ${
                language === lang.code
                  ? 'bg-gold-500 text-forest-900'
                  : 'text-cream-100 hover:bg-cream-400/10'
              }`}
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

        {/* Notifications */}
        <button className="relative text-cream-200 hover:text-cream-100 p-2" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
