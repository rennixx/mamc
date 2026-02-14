'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useState, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ArrowLeft, Images } from 'lucide-react'

type GalleryImage = {
  src: string
  altKey: string
}

type Album = {
  id: string
  titleKey: string
  descriptionKey: string
  coverImage: string
  images: GalleryImage[]
}

const albums: Album[] = [
  {
    id: 'training',
    titleKey: 'albums.training.title',
    descriptionKey: 'albums.training.description',
    coverImage: '/images/horses/equestrian-training.jpg',
    images: [
      { src: '/images/horses/equestrian-training.jpg', altKey: 'images.equestrianTraining' },
      { src: '/images/horses/riding-training.jpg', altKey: 'images.ridingTraining' },
      { src: '/images/services/horse-lesson.jpg', altKey: 'images.horseLesson' },
      { src: '/images/services/private-training.jpg', altKey: 'images.privateTraining' },
    ],
  },
  {
    id: 'jumping',
    titleKey: 'albums.jumping.title',
    descriptionKey: 'albums.jumping.description',
    coverImage: '/images/horses/show-jumping-1.jpg',
    images: [
      { src: '/images/horses/show-jumping-1.jpg', altKey: 'images.showJumping' },
      { src: '/images/horses/show-jumping-2.jpg', altKey: 'images.showJumpingCompetition' },
      { src: '/images/horses/show-jumping-3.jpg', altKey: 'images.showJumpingEvent' },
    ],
  },
  {
    id: 'horses',
    titleKey: 'albums.horses.title',
    descriptionKey: 'albums.horses.description',
    coverImage: '/images/horses/horse-1.jpg',
    images: [
      { src: '/images/horses/horse-1.jpg', altKey: 'images.horsePortrait' },
      { src: '/images/horses/horse-2.jpg', altKey: 'images.horsePortrait' },
    ],
  },
  {
    id: 'facility',
    titleKey: 'albums.facility.title',
    descriptionKey: 'albums.facility.description',
    coverImage: '/images/facility/entrance.jpg',
    images: [
      { src: '/images/facility/entrance.jpg', altKey: 'images.clubEntrance' },
      { src: '/images/facility/riding-arena.png', altKey: 'images.ridingArena' },
      { src: '/images/facility/stable-interior.png', altKey: 'images.stableInterior' },
      { src: '/images/facility/indoor-arena.png', altKey: 'images.indoorArena' },
      { src: '/images/horses/stable-facility.jpg', altKey: 'images.stableFacility' },
    ],
  },
  {
    id: 'safari',
    titleKey: 'albums.safari.title',
    descriptionKey: 'albums.safari.description',
    coverImage: '/images/services/riding-safari.jpg',
    images: [
      { src: '/images/services/riding-safari.jpg', altKey: 'images.ridingSafari' },
    ],
  },
]

export default function GalleryPage() {
  const { t } = useTranslation('gallery')
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const goNext = useCallback(() => {
    if (!activeAlbum) return
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % activeAlbum.images.length : null
    )
  }, [activeAlbum])

  const goPrev = useCallback(() => {
    if (!activeAlbum) return
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + activeAlbum.images.length) % activeAlbum.images.length : null
    )
  }, [activeAlbum])

  return (
    <div>
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

      {/* Albums View */}
      {!activeAlbum ? (
        <section className="pb-20">
          <div className="container-breathable">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setActiveAlbum(album)}
                  className="group text-left"
                >
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={album.coverImage}
                        alt={t(album.titleKey)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                          <Images className="w-4 h-4" />
                          <span>{album.images.length} {t('album.images')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-serif font-bold text-cream-100 mb-2">
                        {t(album.titleKey)}
                      </h3>
                      <p className="text-cream-200 font-sans text-sm">
                        {t(album.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Album Detail View */
        <section className="pb-20">
          <div className="container-breathable">
            {/* Back Button */}
            <button
              onClick={() => {
                setActiveAlbum(null)
                setLightboxIndex(null)
              }}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 font-sans text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('album.backToAlbums')}
            </button>

            {/* Album Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-serif font-bold text-cream-100 mb-2">
                {t(activeAlbum.titleKey)}
              </h2>
              <p className="text-cream-200 font-sans">
                {t(activeAlbum.descriptionKey)}
              </p>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeAlbum.images.map((img, index) => (
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
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && activeAlbum && (
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
              src={activeAlbum.images[lightboxIndex].src}
              alt={t(activeAlbum.images[lightboxIndex].altKey)}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-6 text-center text-white/70 font-sans text-sm">
            {t(activeAlbum.images[lightboxIndex].altKey)} — {lightboxIndex + 1} / {activeAlbum.images.length}
          </div>
        </div>
      )}
    </div>
  )
}
