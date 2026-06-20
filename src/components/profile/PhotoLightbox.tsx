'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, Heart } from 'lucide-react'

interface PhotoLightboxProps {
  photos: { url: string; caption?: string }[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  onSendInterest?: () => void
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  onSendInterest,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const currentPhoto = photos[currentIndex]

  const goNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsZoomed(false)
    }
  }, [currentIndex, photos.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsZoomed(false)
    }
  }, [currentIndex])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goNext()
    else if (e.key === 'ArrowLeft') goPrev()
    else if (e.key === 'Escape') onClose()
  }, [goNext, goPrev, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev()
      else goNext()
    }
    setTouchStart(null)
  }

  if (!isOpen || !currentPhoto) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
            <span className="text-white/60 text-sm">
              {currentIndex + 1} / {photos.length}
            </span>
          </div>

          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-6 left-20 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ZoomIn size={18} className="text-white" />
          </button>

          {photos.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
              )}
              {currentIndex < photos.length - 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              )}
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: isZoomed ? 1.5 : 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full p-4"
            >
              <img
                src={currentPhoto.url}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-2xl"
                style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex items-center justify-between">
              {currentPhoto.caption && (
                <p className="text-white/70 text-sm">{currentPhoto.caption}</p>
              )}
              {onSendInterest && (
                <button
                  onClick={onSendInterest}
                  className="px-5 py-2.5 bg-brand-gradient text-white font-bold rounded-full flex items-center gap-2 shadow-lg"
                >
                  <Heart size={16} /> Send Interest
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
