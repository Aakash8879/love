import { useState } from 'react'
import { motion } from 'framer-motion'
import { config, type Photo } from '../config'
import Heart from './Heart'

type Slot = { kind: 'wide' | 'polaroid' | 'tall'; cls: string; aspect: string; tilt: number }

/** Asymmetrical editorial layout. Photos beyond six reuse the pattern. */
const SLOTS: Slot[] = [
  { kind: 'wide', cls: 'md:col-span-12', aspect: 'aspect-[4/3] md:aspect-[21/9]', tilt: 0 },
  { kind: 'polaroid', cls: 'md:col-span-5 md:col-start-1', aspect: 'aspect-square', tilt: -2.5 },
  { kind: 'tall', cls: 'md:col-span-4 md:mt-28', aspect: 'aspect-[3/4]', tilt: 0 },
  { kind: 'polaroid', cls: 'md:col-span-3 md:mt-10', aspect: 'aspect-[4/5]', tilt: 3 },
  { kind: 'wide', cls: 'md:col-span-7 md:-mt-6', aspect: 'aspect-[4/3]', tilt: 0 },
  { kind: 'polaroid', cls: 'md:col-span-5 md:mt-16', aspect: 'aspect-square', tilt: 1.5 },
]

const GRADIENTS = [
  'radial-gradient(90% 80% at 15% 20%, #F7DDE2 0%, transparent 55%), radial-gradient(80% 90% at 90% 90%, #D7B77A 0%, transparent 55%), linear-gradient(135deg, #E9A5B5, #4B1728)',
  'radial-gradient(80% 70% at 80% 15%, #FFF9F5 0%, transparent 55%), linear-gradient(160deg, #E9A5B5 0%, #b86a82 60%, #4B1728 100%)',
  'radial-gradient(100% 80% at 30% 100%, #D7B77A 0%, transparent 55%), linear-gradient(200deg, #4B1728, #21131F)',
  'radial-gradient(70% 70% at 70% 30%, #F7DDE2 0%, transparent 60%), linear-gradient(120deg, #D7B77A, #E9A5B5)',
  'radial-gradient(90% 90% at 20% 80%, #E9A5B5 0%, transparent 55%), radial-gradient(60% 60% at 85% 20%, #D7B77A 0%, transparent 60%), linear-gradient(180deg, #2d1527, #4B1728)',
  'radial-gradient(80% 80% at 50% 0%, #FFF9F5 0%, transparent 60%), linear-gradient(180deg, #F7DDE2, #E9A5B5)',
]

function Media({ photo, index, aspect }: { photo: Photo; index: number; aspect: string }) {
  const [failed, setFailed] = useState(false)
  const showImage = photo.src.trim() !== '' && !failed
  return (
    <div className={`relative overflow-hidden ${aspect}`}>
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
      {showImage ? (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
      ) : (
        <div
          role="img"
          aria-label={`Placeholder for ${photo.label}`}
          className="relative flex h-full w-full flex-col items-center justify-center gap-3 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          style={{ background: GRADIENTS[index % GRADIENTS.length] }}
        >
          <div aria-hidden className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/25" />
          <Heart className="relative h-5 w-5 text-ivory/80" />
          <span className="relative px-4 text-center font-serif text-2xl italic text-ivory/90 sm:text-3xl">{photo.label}</span>
          {import.meta.env.DEV && (
            <span className="relative rounded-full bg-plum/40 px-3 py-1 text-[11px] text-ivory/80">Add the photo in src/config.ts</span>
          )}
        </div>
      )}
      </motion.div>
      {/* A soft ivory veil that slides away to reveal the photo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 origin-top bg-ivory"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      />
    </div>
  )
}

/** Screen 4: our little universe. */
export default function Gallery() {
  const { title, subtitle, photos } = config.gallery
  return (
    <section aria-labelledby="gallery-title" className="relative overflow-hidden px-5 py-24 text-burgundy sm:px-6 md:py-36" style={{ background: 'linear-gradient(180deg, #FFF9F5 0%, #F7DDE2 35%, #F7DDE2 75%, #FFF9F5 100%)' }}>
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
          className="mb-14 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <h2 id="gallery-title" className="font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-[-0.02em]">{title}</h2>
          <p className="max-w-xs text-base leading-relaxed text-burgundy/65">{subtitle}</p>
        </motion.header>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
          {photos.map((photo, i) => {
            const slot = SLOTS[i % SLOTS.length]
            if (slot.kind === 'polaroid') {
              return (
                <motion.figure
                  key={i}
                  initial={{ opacity: 0, y: 50, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: slot.tilt }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`group mx-auto w-full max-w-sm self-start bg-ivory p-3 pb-4 shadow-[0_30px_60px_-30px_rgba(75,23,40,0.5)] md:max-w-none ${slot.cls}`}
                >
                  <Media photo={photo} index={i} aspect={slot.aspect} />
                  <figcaption className="px-2 pt-4 text-center">
                    <span className="block font-hand text-2xl leading-tight text-burgundy">{photo.caption}</span>
                    {photo.date && <span className="mt-1 block text-xs tracking-wide text-burgundy/50">{photo.date}</span>}
                    {photo.note && <span className="mt-2 block font-hand text-xl text-[#9a6b2f]">{photo.note}</span>}
                  </figcaption>
                </motion.figure>
              )
            }
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1 }}
                className={`group self-start ${slot.cls}`}
              >
                <div className="overflow-hidden rounded-[2px] shadow-[0_40px_80px_-50px_rgba(75,23,40,0.7)]">
                  <Media photo={photo} index={i} aspect={slot.aspect} />
                </div>
                <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="font-serif text-2xl italic sm:text-3xl">{photo.caption}</span>
                  <span className="flex items-baseline gap-4">
                    {photo.note && <span className="-rotate-2 font-hand text-2xl text-[#9a6b2f]">{photo.note}</span>}
                    {photo.date && <span className="text-xs tracking-wide text-burgundy/50">{photo.date}</span>}
                  </span>
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
