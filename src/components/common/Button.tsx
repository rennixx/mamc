'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'action'
  children: ReactNode
}

export const Button = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles =
    'px-8 py-4 font-sans font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary:
      'bg-forest-600 hover:bg-forest-700 text-cream-200 shadow-tactile hover:shadow-tactile-hover active:shadow-tactile-pressed active:translate-y-0.5',
    secondary:
      'bg-saddle-500 hover:bg-saddle-600 text-cream-200 shadow-tactile hover:shadow-tactile-hover active:shadow-tactile-pressed active:translate-y-0.5',
    outline:
      'border-2 border-forest-600 text-forest-600 dark:border-cream-300 dark:text-cream-300 hover:bg-forest-600 hover:text-cream-200 dark:hover:bg-cream-300 dark:hover:text-slate-900 shadow-tactile hover:shadow-tactile-hover',
    action:
      'bg-action-500 hover:bg-action-600 text-white shadow-tactile-hover hover:shadow-luxury active:shadow-tactile-pressed active:translate-y-0.5 font-bold tracking-wide',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
