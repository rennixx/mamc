'use client'

import { useAppStore } from '@/store'

// Signature image component - inverts on dark theme
export function Signature({ className }: { className?: string }) {
  const theme = useAppStore((s) => s.theme)

  return (
    <img
      src="/signature.png"
      alt="Signature"
      className={className}
      style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}
    />
  )
}
