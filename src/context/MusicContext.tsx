import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { config } from '../config'
import { vinylFx } from '../lib/vinylAudio'

export type NeedleState = 'parked' | 'dropping' | 'playing' | 'lifting'

type MusicState = {
  /** True when a real audio file is configured and loads correctly. */
  audioReady: boolean
  /** True while music (or visual-only mode) is actively playing. */
  playing: boolean
  /** Current state of the tonearm / stylus. */
  needleState: NeedleState
  muted: boolean
  currentTime: number
  duration: number
  speed: 33 | 45
  toggle: () => void
  toggleMute: () => void
  dropNeedle: () => void
  liftNeedle: () => void
  seek: (seconds: number) => void
  setSpeed: (speed: 33 | 45) => void
}

const MusicContext = createContext<MusicState | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const rawSrc = config.music.src.trim()
  const src = rawSrc.replace(/^(\.\.\/)*public\//, './')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)

  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [needleState, setNeedleState] = useState<NeedleState>('parked')
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeedState] = useState<33 | 45>(33)

  // Initialize audio element
  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'metadata'
    audioRef.current = audio

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => {
      setFailed(true)
      setPlaying(false)
      setNeedleState('parked')
    }
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const onEnded = () => {
      liftNeedle()
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [src])

  const audioReady = !!src && !failed

  const setSpeed = useCallback((newSpeed: 33 | 45) => {
    setSpeedState(newSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed === 45 ? 1.3 : 1.0
    }
  }, [])

  const seek = useCallback((seconds: number) => {
    if (audioRef.current && Number.isFinite(seconds)) {
      const clamped = Math.max(0, Math.min(seconds, audioRef.current.duration || seconds))
      audioRef.current.currentTime = clamped
      setCurrentTime(clamped)
    } else {
      setCurrentTime(seconds)
    }
  }, [])

  const dropNeedle = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const audio = audioRef.current

    setNeedleState('dropping')

    // If audio is available, initiate playback on user gesture but start muted/silent
    // until the needle physically makes contact with the record groove (~550ms).
    if (audioReady && audio) {
      audio.volume = 0
      audio.play().catch(() => {
        // User gesture or autoplay fallback
      })
    }

    timerRef.current = window.setTimeout(() => {
      // NEEDLE TOUCHES GROOVE:
      vinylFx.playDrop(muted)

      if (audioReady && audio) {
        audio.volume = muted ? 0 : 1
      }
      setNeedleState('playing')
      setPlaying(true)
    }, 550)
  }, [audioReady, muted])

  const liftNeedle = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const audio = audioRef.current

    setNeedleState('lifting')
    vinylFx.playLift(muted)

    // Quick audio fade
    if (audioReady && audio && !audio.paused) {
      try {
        audio.pause()
      } catch {
        // Ignore
      }
    }
    setPlaying(false)

    // Return to rest position after lift and swing back
    timerRef.current = window.setTimeout(() => {
      setNeedleState('parked')
    }, 520)
  }, [audioReady, muted])

  const toggle = useCallback(() => {
    if (needleState === 'playing' || needleState === 'dropping') {
      liftNeedle()
    } else {
      dropNeedle()
    }
  }, [needleState, dropNeedle, liftNeedle])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    const nextMuted = !muted
    setMuted(nextMuted)
    if (audio) {
      audio.muted = nextMuted
      audio.volume = nextMuted ? 0 : 1
    }
  }, [muted])

  return (
    <MusicContext.Provider
      value={{
        audioReady,
        playing,
        needleState,
        muted,
        currentTime,
        duration,
        speed,
        toggle,
        toggleMute,
        dropNeedle,
        liftNeedle,
        seek,
        setSpeed,
      }}
    >
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider')
  return ctx
}
