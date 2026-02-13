'use client'

import { useAppStore } from '@/store'

// Granular selectors to prevent unnecessary re-renders

export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const setTheme = useAppStore((s) => s.setTheme)
  return { theme, toggleTheme, setTheme }
}

export function useLanguage() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  return { language, setLanguage }
}

export function useUser() {
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  return { user, setUser }
}

export function useBookingDraft() {
  const bookingDraft = useAppStore((s) => s.bookingDraft)
  const setBookingDraft = useAppStore((s) => s.setBookingDraft)
  return { bookingDraft, setBookingDraft }
}

export function useMobileMenu() {
  const isMobileMenuOpen = useAppStore((s) => s.isMobileMenuOpen)
  const toggleMobileMenu = useAppStore((s) => s.toggleMobileMenu)
  const closeMobileMenu = useAppStore((s) => s.closeMobileMenu)
  return { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }
}

export function useBookingModal() {
  const isBookingModalOpen = useAppStore((s) => s.isBookingModalOpen)
  const openBookingModal = useAppStore((s) => s.openBookingModal)
  const closeBookingModal = useAppStore((s) => s.closeBookingModal)
  return { isBookingModalOpen, openBookingModal, closeBookingModal }
}
