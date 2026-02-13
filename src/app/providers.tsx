'use client'

import { ReactNode } from 'react'
import { I18nProvider } from '@/components/common/I18nProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  )
}
