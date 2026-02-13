import { cn } from '@/utils/cn'

export interface SkipLinkProps {
  targetId: string
  children: React.ReactNode
  className?: string
}

export const SkipLink = ({ targetId, children, className }: SkipLinkProps) => {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only-focusable absolute top-0 left-0 z-[100]',
        'bg-gold-500 text-forest-900 px-4 py-2',
        '-translate-y-full focus:translate-y-0',
        'transition-transform duration-200',
        'font-sans font-semibold',
        className
      )}
    >
      {children}
    </a>
  )
}
