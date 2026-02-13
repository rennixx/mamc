'use client'

import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

interface LightboxProps {
  images: { src: string; alt: string }[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) => {
  const currentImage = images[currentIndex]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrevious()
      if (e.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrevious])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 glass-card p-3 hover:bg-white/20 transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 text-cream-100" />
      </button>

      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 glass-card p-4 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous image"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-8 h-8 text-cream-100" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 glass-card p-4 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next image"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight className="w-8 h-8 text-cream-100" />
      </button>

      <div className="max-w-7xl max-h-[90vh] mx-4 relative">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-w-full max-h-[85vh] object-contain shadow-luxury-lg"
        />

        <div className="glass-nav mt-4 p-4 text-center">
          <p className="text-cream-100 font-sans">{currentImage.alt}</p>
          <p className="text-cream-300 font-sans text-sm mt-1">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Click to close"
      />
    </div>
  )
}
