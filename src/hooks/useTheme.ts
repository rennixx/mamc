'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store'

export function useTheme() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const initTheme = useCallback(() => {
    if (typeof window === 'undefined') return
    const stored = useAppStore.getState().theme
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return { theme, setTheme, toggleTheme, initTheme }
}
