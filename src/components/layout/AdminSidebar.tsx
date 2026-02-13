'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, CalendarDays, Users, PlusCircle,
  ChevronLeft, Settings, HelpCircle, LogOut
} from 'lucide-react'
import { useMobileMenu } from '@/hooks/useApp'

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/admin/bookings', icon: CalendarDays, labelKey: 'bookings' },
  { href: '/admin/horses', icon: Users, labelKey: 'horses' },
  { href: '/admin/calendar', icon: CalendarDays, labelKey: 'calendar' },
  { href: '/admin/calendar-management', icon: Settings, labelKey: 'calendarManagement' },
  { href: '/admin/new', icon: PlusCircle, labelKey: 'newBooking' },
]

export function AdminSidebar() {
  const { t } = useTranslation('admin')
  const pathname = usePathname()
  const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-forest-900/95 backdrop-blur-lg border-r border-white/10
          transform transition-transform lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Brand */}
          <div className="mb-8 px-3">
            <h2 className="text-xl font-serif font-bold text-gold-400">
              {t('title', 'Admin Panel')}
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm
                  transition-colors
                  ${isActive(link.href)
                    ? 'bg-gold-500/20 text-gold-400 font-semibold'
                    : 'text-cream-200 hover:bg-white/5 hover:text-cream-100'}
                `}
              >
                <link.icon className="w-5 h-5" />
                {t(link.labelKey, link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-cream-300 hover:text-cream-100 font-sans text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('backToSite', 'Back to Website')}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
