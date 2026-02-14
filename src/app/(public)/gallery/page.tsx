'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryImages = [
  { src: '/images/horses/equestrian-training.jpg', altKey: 'images.equestrianTraining', category: 'training' },
  { src: '/images/horses/show-jumping-1.jpg', altKey: 'images.showJumping', category: 'jumping' },
  { src: '/images/horses/show-jumping-2.jpg', altKey: 'images.showJumpingCompetition', category: 'jumping' },
  { src: '/images/horses/show-jumping-3.jpg', altKey: 'images.showJumpingEvent', category: 'jumping' },
  { src: '/images/horses/riding-training.jpg', altKey: 'images.ridingTraining', category: 'training' },
  { src: '/images/horses/horse-1.jpg', altKey: 'images.horsePortrait', category: 'horses' },
  { src: '/images/horses/horse-2.jpg', altKey: 'images.horsePortrait', category: 'horses' },
  { src: '/images/horses/stable-facility.jpg', altKey: 'images.stableFacility', category: 'facility' },
  { src: '/images/facility/entrance.jpg', altKey: 'images.clubEntrance', category: 'facility' },
  { src: '/images/facility/riding-arena.png', altKey: 'images.ridingArena', category: 'facility' },
  { src: '/images/facility/stable-interior.png', altKey: 'images.stableInterior', category: 'facility' },
  { src: '/images/facility/indoor-arena.png', altKey: 'images.indoorArena', category: 'facility' },
  { src: '/images/services/horse-lesson.jpg', altKey: 'images.horseLesson', category: 'training' },
  { src: '/images/services/riding-safari.jpg', altKey: 'images.ridingSafari', category: 'safari' },
  { src: '/images/services/private-training.jpg', altKey: 'images.privateTraining', category: 'training' },
]

const categoryKeys = ['all', 'training', 'jumping', 'horses', 'facility', 'safari'] as const

export default function GalleryPage() {
  const { t } = useTranslation('gallery')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages =
    activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredImages.length : null
    )
  }, [filteredImages.length])

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
    )
  }, [filteredImages.length])

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-spacing">
        <div className="container-breathable text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream-100 mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-cream-200 font-sans max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-8">
        <div className="container-breathable">
          <div className="flex flex-wrap justify-center gap-2">
            {categoryKeys.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-sans text-sm font-semibold transition-all capitalize ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-forest-900 shadow-tactile'
                    : 'bg-cream-400/10 text-cream-200 hover:bg-cream-400/20'
                }`}
              >
                {t(`categories.${cat}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-20">
        <div className="container-breathable">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((img, index) => (
              <button
                key={img.src}
                onClick={() => openLightbox(index)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={t(img.altKey)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <span className="text-white font-sans text-sm p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t(img.altKey)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10"
            aria-label={t('lightbox.close')}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white p-2 z-10"
            aria-label={t('lightbox.previous')}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white p-2 z-10"
            aria-label={t('lightbox.next')}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={t(filteredImages[lightboxIndex].altKey)}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 text-center text-white/70 font-sans text-sm">
            {t(filteredImages[lightboxIndex].altKey)} — {lightboxIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </div>
  )
}
