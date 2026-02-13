'use client'

import { ReactNode, useEffect } from 'react'
import '@/i18n/config'
import { useAppStore } from '@/store'
import i18n from '@/i18n/config'

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useAppStore((s) => s.language)

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  return <>{children}</>
}
