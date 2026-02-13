'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'ar' | 'ku'
export type ThemeMode = 'light' | 'dark'

interface AppState {
  // Theme
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void

  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // User (future use)
  user: null | { id: string; name: string; email: string }
  setUser: (user: AppState['user']) => void

  // Booking draft (shared across pages)
  bookingDraft: null | {
    service: string
    date?: Date
    time?: string
  }
  setBookingDraft: (draft: AppState['bookingDraft']) => void

  // UI state
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void

  // Modal state
  isBookingModalOpen: boolean
  openBookingModal: () => void
  closeBookingModal: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      // Language
      language: 'ku',
      setLanguage: (language) => set({ language }),

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Booking draft
      bookingDraft: null,
      setBookingDraft: (bookingDraft) => set({ bookingDraft }),

      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      // Booking modal
      isBookingModalOpen: false,
      openBookingModal: () => set({ isBookingModalOpen: true }),
      closeBookingModal: () => set({ isBookingModalOpen: false }),
    }),
    {
      name: 'mam-center-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        user: state.user,
      }),
    }
  )
)
