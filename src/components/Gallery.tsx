import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart as HeartIcon, Maximize2, Sparkles, X } from 'lucide-react'
import { config, type Photo } from '../config'
import Heart from './Heart'

type Slot = {
  kind: 'wide' | 'polaroid' | 'tall'
  cls: string
  aspect: string
  tilt: number
  objectPosition: string
}

/** Tailored layout where each frame is custom-fit to the photo's orientation and aspect ratio */
const SLOTS: Slot[] = [
  // 0: Hero Beach Sunset Silhouette (1599x1066 - Wide Landscape)
  {
    kind: 'wide',
    cls: 'md:col-span-12',
    aspect: 'aspect-[16/10] md:aspect-[21/9]',
    tilt: 0,
    objectPosition: 'center 45%',
  },
  // 1: Bhavana with Sparklers (1599x1066 - Polaroid square focus)
  {
    kind: 'polaroid',
    cls: 'md:col-span-5 md:col-start-1',
    aspect: 'aspect-square',
    tilt: -2.5,
    objectPosition: 'center 32%',
  },
  // 2: Horse Riding Adventure (1200x1600 - Exact 3:4 Portrait)
  {
    kind: 'tall',
    cls: 'md:col-span-4 md:mt-24',
    aspect: 'aspect-[3/4]',
    tilt: 0,
    objectPosition: 'center center',
  },
  // 3: Late Night Video Call (738x1600 - 4:5 Polaroid focus on teddy ears & face)
  {
    kind: 'polaroid',
    cls: 'md:col-span-3 md:mt-10',
    aspect: 'aspect-[4/5]',
    tilt: 3,
    objectPosition: 'center 30%',
  },
  // 4: Traditional Festival Outfits (1300x1599 - 4:5 framed portrait)
  {
    kind: 'wide',
    cls: 'md:col-span-7 md:-mt-6',
    aspect: 'aspect-[4/5] sm:aspect-[3/4]',
    tilt: 0,
    objectPosition: 'center 22%',
  },
  // 5: Childhood Memory of Bhavana (720x1600 - 4:5 Polaroid, centers little Bhavana)
  {
    kind: 'polaroid',
    cls: 'md:col-span-5 md:mt-16',
    aspect: 'aspect-[4/5]',
    tilt: 1.5,
    objectPosition: 'center 28%',
  },
]

const GRADIENTS = [
  'radial-gradient(90% 80% at 15% 20%, #F7DDE2 0%, transparent 55%), radial-gradient(80% 90% at 90% 90%, #D7B77A 0%, transparent 55%), linear-gradient(135deg, #E9A5B5, #4B1728)',
  'radial-gradient(80% 70% at 80% 15%, #FFF9F5 0%, transparent 55%), linear-gradient(160deg, #E9A5B5 0%, #b86a82 60%, #4B1728 100%)',
  'radial-gradient(100% 80% at 30% 100%, #D7B77A 0%, transparent 55%), linear-gradient(200deg, #4B1728, #21131F)',
  'radial-gradient(70% 70% at 70% 30%, #F7DDE2 0%, transparent 60%), linear-gradient(120deg, #D7B77A, #E9A5B5)',
  'radial-gradient(90% 90% at 20% 80%, #E9A5B5 0%, transparent 55%), radial-gradient(60% 60% at 85% 20%, #D7B77A 0%, transparent 60%), linear-gradient(180deg, #2d1527, #4B1728)',
  'radial-gradient(80% 80% at 50% 0%, #FFF9F5 0%, transparent 60%), linear-gradient(180deg, #F7DDE2, #E9A5B5)',
]

function Media({
  photo,
  index,
  aspect,
  objectPosition,
  onOpen,
}: {
  photo: Photo
  index: number
  aspect: string
  objectPosition: string
  onOpen: () => void
}) {
  const [failed, setFailed] = useState(false)
  const showImage = photo.src.trim() !== '' && !failed

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      aria-label={`View photo: ${photo.caption}`}
      className={`relative cursor-pointer overflow-hidden ${aspect} focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne`}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {showImage ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            style={{ objectPosition }}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            role="img"
            aria-label={`Placeholder for ${photo.label}`}
            className="relative flex h-full w-full flex-col items-center justify-center gap-3 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/25"
            />
            <Heart className="relative h-5 w-5 text-ivory/80" />
            <span className="relative px-4 text-center font-serif text-2xl italic text-ivory/90 sm:text-3xl">
              {photo.label}
            </span>
          </div>
        )}
      </motion.div>

      {/* Hover overlay hint */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-plum/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ivory/40 bg-plum/70 px-3 py-1.5 text-xs font-medium text-ivory shadow-lg backdrop-blur-sm">
          <Maximize2 className="h-3 w-3 text-champagne" />
          <span>View Full Memory</span>
        </span>
      </div>

      {/* Soft ivory veil slide reveal on initial scroll */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-top bg-ivory"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}

/** Screen 4: our little universe photo gallery with luxury frames & interactive lightbox */
export default function Gallery() {
  const { title, subtitle, photos } = config.gallery
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null)
  const [heartLikes, setHeartLikes] = useState<{ [key: number]: number }>({})

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIndex(null)
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0))
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : 0
        )
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePhotoIndex, photos.length])

  const handleLike = (index: number) => {
    setHeartLikes((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }))
  }

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden px-5 py-24 text-burgundy sm:px-6 md:py-36"
      style={{
        background:
          'linear-gradient(180deg, #FFF9F5 0%, #F7DDE2 35%, #F7DDE2 75%, #FFF9F5 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Gallery Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
          className="mb-14 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-ivory/60 px-3.5 py-1 text-xs font-medium tracking-wide text-burgundy shadow-sm backdrop-blur">
              <Sparkles className="h-3 w-3 text-champagne" />
              <span>Memories of Us</span>
            </div>
            <h2
              id="gallery-title"
              className="mt-3 font-serif text-[clamp(3rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.02em]"
            >
              {title}
            </h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-burgundy/70 md:pb-2">
            {subtitle}
          </p>
        </motion.header>

        {/* ============================================================ */}
        {/* PHOTO GRID WITH LUXURY FRAMES & TAILORED CROPPING            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
          {photos.map((photo, i) => {
            const slot = SLOTS[i % SLOTS.length]

            // POLAROID FRAME (Slots 1, 3, 5)
            if (slot.kind === 'polaroid') {
              return (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 50, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: slot.tilt }}
                  whileHover={{ rotate: 0, scale: 1.025 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`group relative mx-auto w-full max-w-sm self-start rounded-sm bg-[#FFFDFB] p-3.5 pb-6 shadow-[0_25px_50px_-20px_rgba(75,23,40,0.45)] transition-shadow duration-300 hover:shadow-[0_35px_65px_-15px_rgba(75,23,40,0.55)] md:max-w-none ${slot.cls}`}
                >
                  {/* Decorative Washi Tape / Gold Stamp on top */}
                  <div
                    aria-hidden
                    className="absolute -top-3 left-1/2 h-5 w-16 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-champagne/40 backdrop-blur-sm shadow-sm"
                  />

                  {/* Photo Media inside Polaroid frame */}
                  <div className="overflow-hidden rounded-[1px] border border-burgundy/5 shadow-inner">
                    <Media
                      photo={photo}
                      index={i}
                      aspect={slot.aspect}
                      objectPosition={slot.objectPosition}
                      onOpen={() => setActivePhotoIndex(i)}
                    />
                  </div>

                  {/* Polaroid Hand-written Inscription */}
                  <figcaption className="px-2 pt-4 text-center">
                    <span className="block font-hand text-2xl font-bold leading-tight text-burgundy sm:text-[1.65rem]">
                      {photo.caption}
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      {photo.date && (
                        <span className="rounded-full bg-burgundy/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wider text-burgundy/60 uppercase">
                          {photo.date}
                        </span>
                      )}
                      {photo.note && (
                        <span className="font-hand text-lg text-[#9a6b2f]">
                          {photo.note}
                        </span>
                      )}
                    </div>
                  </figcaption>
                </motion.figure>
              )
            }

            // EDITORIAL FINE-ART GALLERY FRAME (Slots 0 & 2 & 4)
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1 }}
                className={`group self-start ${slot.cls}`}
              >
                {/* Deluxe Matted Picture Frame */}
                <div
                  className="relative overflow-hidden rounded-xl border border-champagne/40 p-2 shadow-[0_35px_70px_-30px_rgba(75,23,40,0.55)]"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(255,249,245,0.95), rgba(247,221,226,0.6))',
                  }}
                >
                  {/* Inner Photo Container */}
                  <div className="overflow-hidden rounded-lg shadow-inner">
                    <Media
                      photo={photo}
                      index={i}
                      aspect={slot.aspect}
                      objectPosition={slot.objectPosition}
                      onOpen={() => setActivePhotoIndex(i)}
                    />
                  </div>
                </div>

                {/* Editorial Typography Caption */}
                <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-1">
                  <div>
                    <span className="block font-serif text-2xl italic tracking-tight text-burgundy sm:text-3xl">
                      {photo.caption}
                    </span>
                    {photo.label && (
                      <span className="mt-0.5 block text-xs font-semibold tracking-widest text-burgundy/60 uppercase">
                        {photo.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-4">
                    {photo.note && (
                      <span className="-rotate-2 font-hand text-2xl text-[#9a6b2f]">
                        {photo.note}
                      </span>
                    )}
                    {photo.date && (
                      <span className="text-xs font-medium tracking-wide text-burgundy/50">
                        {photo.date}
                      </span>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* FULLSCREEN LUXURY LIGHTBOX MODAL                             */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-plum/90 p-4 backdrop-blur-xl sm:p-6"
          >
            {/* Modal Dialog Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-b from-[#2a1324] to-[#160815] text-ivory shadow-2xl"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-champagne/20 px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-medium text-champagne">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    Memory {activePhotoIndex + 1} of {photos.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLike(activePhotoIndex)}
                    aria-label="Send love to this photo"
                    className="flex items-center gap-1.5 rounded-full border border-champagne/30 bg-plum/80 px-3 py-1 text-xs text-ivory transition hover:border-champagne hover:bg-plum"
                  >
                    <HeartIcon
                      className={`h-4 w-4 ${
                        (heartLikes[activePhotoIndex] || 0) > 0
                          ? 'fill-petal text-petal'
                          : 'text-champagne'
                      }`}
                    />
                    <span>{heartLikes[activePhotoIndex] || 0}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIndex(null)}
                    aria-label="Close photo"
                    className="grid h-8 w-8 place-items-center rounded-full border border-champagne/30 text-ivory/80 transition hover:bg-ivory/10 hover:text-ivory"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Full Image Display */}
              <div className="relative flex min-h-[50vh] flex-1 items-center justify-center overflow-hidden bg-black/40 p-4">
                <img
                  src={photos[activePhotoIndex].src}
                  alt={photos[activePhotoIndex].alt}
                  className="max-h-[64vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex(
                      (activePhotoIndex - 1 + photos.length) % photos.length
                    )
                  }
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-champagne/30 bg-plum/80 text-ivory shadow-lg backdrop-blur-md transition hover:border-champagne hover:bg-plum active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((activePhotoIndex + 1) % photos.length)
                  }
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-champagne/30 bg-plum/80 text-ivory shadow-lg backdrop-blur-md transition hover:border-champagne hover:bg-plum active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Photo Caption & Inscription Footer */}
              <div className="border-t border-champagne/20 bg-plum/60 px-6 py-4">
                <p className="font-serif text-xl italic text-ivory sm:text-2xl">
                  {photos[activePhotoIndex].caption}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-hand text-lg text-champagne">
                    {photos[activePhotoIndex].note}
                  </span>
                  <span className="rounded-full bg-champagne/15 px-3 py-1 font-mono tracking-wider text-champagne">
                    {photos[activePhotoIndex].date}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
