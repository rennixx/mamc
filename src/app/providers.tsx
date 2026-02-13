'use client'

import { ReactNode, useEffect } from 'react'
import { I18nProvider } from '@/components/common/I18nProvider'
import { useAppStore } from '@/store'

function ThemeInitializer() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeInitializer />
      {children}
    </I18nProvider>
  )
}
