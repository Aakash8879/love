import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { config } from '../config'
import { useMusic } from '../context/MusicContext'
import Heart from './Heart'

export function Equalizer({ playing, className = '' }: { playing: boolean; className?: string }) {
  return (
    <span aria-hidden className={`flex h-4 items-end gap-[3px] ${className}`}>
      {[0.9, 0.6, 1.1, 0.75, 0.95].map((d, i) => (
        <span
          key={i}
          className="eq w-[3px] rounded-full bg-current"
          style={{ height: '100%', ['--d' as string]: `${d}s`, animationPlayState: playing ? 'running' : 'paused', transform: playing ? undefined : 'scaleY(0.3)' }}
        />
      ))}
    </span>
  )
}

/** Screen 7: a minimal record player. Never autoplays. Without an audio file it becomes visual-only. */
export default function Music() {
  const { audioReady, playing, muted, toggle, toggleMute } = useMusic()
  const { title, artist, caption } = config.music

  return (
    <section aria-labelledby="music-title" className="relative overflow-hidden bg-blush px-5 py-24 text-burgundy sm:px-6 md:py-32">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,249,245,0.9),transparent_60%)]"
        animate={{ opacity: playing ? 1 : 0.55 }}
        transition={{ duration: 1.2 }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 md:gap-20">
        <div className="relative mx-auto w-[min(78vw,400px)]">
          <div
            className="spin relative aspect-square w-full rounded-full shadow-[0_40px_80px_-30px_rgba(33,19,31,0.7)]"
            style={{
              animationPlayState: playing ? 'running' : 'paused',
              background:
                'radial-gradient(circle, transparent 0 31%, rgba(255,255,255,0.04) 31.5%, transparent 32%), repeating-radial-gradient(circle, #21131F 0 2px, #2c1a29 2.5px 4px), #21131F',
            }}
          >
            <div aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_15%,rgba(255,249,245,0.12)_20%,transparent_28%_65%,rgba(255,249,245,0.08)_70%,transparent_78%)]" />
            <div className="absolute left-1/2 top-1/2 grid h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-petal via-blush to-champagne">
              <Heart className="h-1/4 w-1/4 text-burgundy" />
              <span className="absolute h-2 w-2 rounded-full bg-plum" />
            </div>
          </div>
          <motion.div
            aria-hidden
            className="absolute -right-2 -top-4 h-[55%] w-2 origin-top rounded-full bg-gradient-to-b from-champagne to-[#a88447] shadow-md sm:-right-4"
            animate={{ rotate: playing ? 24 : 6 }}
            transition={{ type: 'spring', stiffness: 60, damping: 12 }}
          >
            <span className="absolute -bottom-2 left-1/2 h-5 w-4 -translate-x-1/2 rounded-sm bg-plum" />
            <span className="absolute -left-2 -top-2 h-6 w-6 rounded-full border-2 border-champagne bg-ivory" />
          </motion.div>
        </div>

        <div className="text-center md:text-left">
          <h2 id="music-title" className="font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95]">
            A little music,
            <br />a little magic
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-burgundy/70 md:mx-0">{caption}</p>

          <div className="mt-9 inline-flex items-center gap-4 rounded-full border border-burgundy/10 bg-ivory/70 p-2 pr-6 shadow-[0_20px_40px_-25px_rgba(75,23,40,0.6)] backdrop-blur">
            <motion.button
              type="button"
              onClick={toggle}
              whileTap={{ scale: 0.92 }}
              aria-label={playing ? 'Pause' : audioReady ? 'Play our song' : 'Play the moment'}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-burgundy text-ivory"
            >
              {playing ? <Pause className="h-5 w-5" aria-hidden /> : <Play className="ml-0.5 h-5 w-5" aria-hidden />}
            </motion.button>
            <div className="min-w-0 text-left">
              <p className="truncate font-serif text-xl leading-tight">{title}</p>
              <p className="truncate text-xs tracking-wide text-burgundy/60">{artist}</p>
            </div>
            <Equalizer playing={playing} className="ml-2 text-burgundy" />
            {audioReady && (
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Unmute' : 'Mute'}
                aria-pressed={muted}
                className="grid h-11 w-11 place-items-center rounded-full text-burgundy/70 hover:bg-burgundy/5 hover:text-burgundy"
              >
                {muted ? <VolumeX className="h-5 w-5" aria-hidden /> : <Volume2 className="h-5 w-5" aria-hidden />}
              </button>
            )}
          </div>
          {!audioReady && import.meta.env.DEV && (
            <p className="mt-4 text-xs text-burgundy/60">Visual-only right now. Add a song in src/config.ts (music.src) to play real audio.</p>
          )}
        </div>
      </div>
    </section>
  )
}

/** A small floating player that appears once the song has started, so she can pause anywhere. */
export function MiniPlayer({ visible }: { visible: boolean }) {
  const { audioReady, playing, muted, toggle, toggleMute } = useMusic()
  const [started, setStarted] = useState(false)
  useEffect(() => { if (playing) setStarted(true) }, [playing])
  const show = visible && audioReady && started
  return (
    <motion.div
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 20, pointerEvents: show ? 'auto' : 'none' }}
      transition={{ duration: 0.4 }}
      aria-hidden={!show}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-40 flex items-center gap-1 rounded-full border border-champagne/30 bg-plum/80 p-1.5 pr-3 text-ivory shadow-xl backdrop-blur-md"
    >
      <button type="button" onClick={toggle} tabIndex={show ? 0 : -1} aria-label={playing ? 'Pause music' : 'Play music'} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ivory/10">
        {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
      </button>
      <button type="button" onClick={toggleMute} tabIndex={show ? 0 : -1} aria-label={muted ? 'Unmute' : 'Mute'} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ivory/10">
        {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      </button>
      <Equalizer playing={playing && !muted} className="text-champagne" />
    </motion.div>
  )
}
