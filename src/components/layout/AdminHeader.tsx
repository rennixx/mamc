'use client'

import { useTranslation } from 'react-i18next'
import { Menu, Bell, Sun, Moon, LogOut, User, Shield } from 'lucide-react'
import { useMobileMenu, useLanguage } from '@/hooks/useApp'
import { useAppStore } from '@/store'
import { useState } from 'react'

interface AdminHeaderProps {
  adminEmail: string
  adminName: string
  adminRole: string
}

export function AdminHeader({ adminEmail, adminName, adminRole }: AdminHeaderProps) {
  const { t } = useTranslation('admin')
  const { toggleMobileMenu } = useMobileMenu()
  const { language, setLanguage } = useLanguage()
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const languages = [
    { code: 'en' as const, label: 'EN' },
    { code: 'ku' as const, label: 'KU' },
    { code: 'ar' as const, label: 'AR' },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/admin-logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: clear cookie and redirect
      document.cookie = 'admin-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      window.location.href = '/admin/login'
    }
  }

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

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-400/10 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center">
              <User className="w-4 h-4 text-forest-900" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-cream-100">{adminName || 'Admin'}</p>
              <p className="text-xs text-cream-400">{adminRole}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-forest-900 border border-cream-400/20 shadow-lg z-50">
              <div className="px-4 py-3 border-b border-cream-400/10">
                <p className="text-sm font-medium text-cream-100">{adminName || 'Admin'}</p>
                <p className="text-xs text-cream-400 truncate">{adminEmail}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-gold-400" />
                  <p className="text-xs text-gold-400">{adminRole}</p>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-cream-200 hover:text-cream-100 hover:bg-cream-400/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout') || 'Logout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
