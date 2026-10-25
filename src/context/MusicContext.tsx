import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { config } from '../config'

type MusicState = {
  /** True when a real audio file is configured and loads correctly. */
  audioReady: boolean
  /** True while music (or the visual-only mode) is playing. */
  playing: boolean
  muted: boolean
  toggle: () => void
  toggleMute: () => void
}

const MusicContext = createContext<MusicState | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const rawSrc = config.music.src.trim()
  const src = rawSrc.replace(/^(\.\.\/)*public\//, './')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!src) return
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'none'
    audioRef.current = audio
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => { setFailed(true); setPlaying(false) }
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [src])

  const audioReady = !!src && !failed

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audioReady || !audio) { setPlaying((p) => !p); return }
    if (audio.paused) audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [audioReady])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }, [])

  return (
    <MusicContext.Provider value={{ audioReady, playing, muted, toggle, toggleMute }}>
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside MusicProvider')
  return ctx
}
