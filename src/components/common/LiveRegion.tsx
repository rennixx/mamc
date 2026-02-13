'use client'

import { useState, useEffect } from 'react'

export interface LiveRegionProps {
  message: string
  role: 'status' | 'alert'
  politeness?: 'polite' | 'assertive'
  className?: string
}

export const LiveRegion = ({
  message,
  role,
  politeness = 'polite',
  className,
}: LiveRegionProps) => {
  const [announced, setAnnounced] = useState(false)

  useEffect(() => {
    setAnnounced(false)
    const timer = setTimeout(() => {
      setAnnounced(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [message])

  if (!message) return null

  return (
    <div
      role={role}
      aria-live={politeness}
      aria-atomic="true"
      className={`sr-only ${className || ''}`}
    >
      {announced ? message : ''}
    </div>
  )
}
