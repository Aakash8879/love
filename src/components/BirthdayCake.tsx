import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Wind, Mic, MicOff, RotateCcw } from 'lucide-react'
import { config } from '../config'
import Heart, { HEART_PATH } from './Heart'

/** Generates a soft breath sound and magical chime arpeggio using Web Audio API */
function playCelebrationAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()

    // 1. Gentle breath puff (filtered noise buffer)
    const bufLen = Math.floor(ctx.sampleRate * 0.35)
    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const chData = buffer.getChannelData(0)
    for (let i = 0; i < bufLen; i++) {
      chData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(420, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.25, ctx.currentTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(ctx.destination)
    noise.start()

    // 2. Sweet sparkling music-box chimes (pentatonic notes: C5, E5, G5, B5, C6, E6)
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51]
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const start = ctx.currentTime + 0.22 + idx * 0.08

      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.2)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 1.25)
    })
  } catch {
    // Graceful fallback if audio is not permitted
  }
}

type Particle = {
  id: number
  x: number
  y: number
  rot: number
  scale: number
  color: string
  shape: 'heart' | 'star' | 'dot' | 'streamer'
  duration: number
  delay: number
}

const PARTICLE_COLORS = ['#D7B77A', '#E9A5B5', '#F7DDE2', '#4B1728', '#D48197', '#C9A35E']

export default function BirthdayCake() {
  const reduce = !!useReducedMotion()
  const [blown, setBlown] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [micVolume, setMicVolume] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)
  const [burstKey, setBurstKey] = useState(0)

  const micStreamRef = useRef<MediaStream | null>(null)
  const micCtxRef = useRef<AudioContext | null>(null)
  const micRafRef = useRef<number | null>(null)

  const { title, subtitle, candleInstruction, wishGrantedBadge, wishGrantedHeadline, wishGrantedMessage, relightButton } =
    config.cake

  const headline = wishGrantedHeadline.replace('{name}', config.herName)

  // Trigger candle blowout
  const blowCandle = () => {
    if (blown) return
    setBlown(true)
    playCelebrationAudio()
    setBurstKey((k) => k + 1)
    stopMic()
  }

  // Relight candle
  const relightCandle = () => {
    setBlown(false)
  }

  // Generate celebration particles when blown
  const particles = useMemo<Particle[]>(() => {
    if (!blown) return []
    const count = 46
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const dist = 90 + Math.random() * 240
      const shapes: ('heart' | 'star' | 'dot' | 'streamer')[] = ['heart', 'star', 'dot', 'streamer']
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 50,
        rot: (Math.random() - 0.5) * 540,
        scale: 0.7 + Math.random() * 0.7,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        shape: shapes[i % shapes.length],
        duration: 1.8 + Math.random() * 1.4,
        delay: Math.random() * 0.15,
      }
    })
  }, [blown, burstKey])

  // Microphone breath listener
  const toggleMic = async () => {
    if (micActive) {
      stopMic()
      return
    }

    try {
      setMicError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      micStreamRef.current = stream

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      micCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      const buffer = new Uint8Array(analyser.frequencyBinCount)
      setMicActive(true)

      let blowHits = 0
      const checkMic = () => {
        analyser.getByteFrequencyData(buffer)
        // Breath blowing creates strong low frequency power (bins 1-8)
        let lowEnergy = 0
        for (let i = 1; i <= 8; i++) {
          lowEnergy += buffer[i]
        }
        const avg = lowEnergy / 8
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)))

        if (avg > 55) {
          blowHits++
          if (blowHits >= 2) {
            blowCandle()
            return
          }
        } else {
          blowHits = Math.max(0, blowHits - 1)
        }

        micRafRef.current = requestAnimationFrame(checkMic)
      }
      micRafRef.current = requestAnimationFrame(checkMic)
    } catch {
      setMicError('Microphone permission was not granted. You can still tap to blow!')
      stopMic()
    }
  }

  const stopMic = () => {
    if (micRafRef.current) cancelAnimationFrame(micRafRef.current)
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop())
      micStreamRef.current = null
    }
    if (micCtxRef.current && micCtxRef.current.state !== 'closed') {
      micCtxRef.current.close().catch(() => {})
      micCtxRef.current = null
    }
    setMicActive(false)
    setMicVolume(0)
  }

  useEffect(() => {
    return () => stopMic()
  }, [])

  return (
    <section
      aria-labelledby="cake-title"
      className="relative overflow-hidden bg-ivory px-5 py-24 text-burgundy sm:px-6 md:py-36"
    >
      {/* Background ambient warm lights */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 'min(90vw, 680px)',
          height: 'min(90vw, 680px)',
          background: blown
            ? 'radial-gradient(circle, rgba(233,165,181,0.18) 0%, rgba(215,183,122,0.08) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,220,150,0.32) 0%, rgba(247,221,226,0.18) 45%, transparent 70%)',
          transition: 'background 1.5s ease',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-blush/40 px-4 py-1 text-xs font-medium tracking-widest text-[#8b465b]">
            <Sparkles className="h-3 w-3 text-champagne" />
            A MOMENT FOR YOUR BIRTHDAY
            <Sparkles className="h-3 w-3 text-champagne" />
          </span>
          <h2
            id="cake-title"
            className="text-balance mx-auto mt-5 max-w-2xl font-serif text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.95]"
          >
            {title}
          </h2>
          <p className="text-balance mx-auto mt-4 max-w-md text-base leading-relaxed text-burgundy/70 sm:text-lg">
            {subtitle}
          </p>
        </motion.div>

        {/* The Artisan Cake Showcase */}
        <div className="relative mx-auto mt-12 flex flex-col items-center justify-center">
          {/* Confetti & Celebration Burst */}
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[160px] -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence>
              {blown &&
                particles.map((p) => (
                  <motion.div
                    key={`${burstKey}-${p.id}`}
                    initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                    animate={{
                      x: p.x,
                      y: [0, p.y * 0.4, p.y + 160],
                      scale: [0, p.scale, p.scale * 0.8],
                      rotate: p.rot,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: reduce ? 0.01 : p.duration,
                      delay: p.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute left-0 top-0"
                  >
                    {p.shape === 'heart' && (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={p.color}>
                        <path d={HEART_PATH} />
                      </svg>
                    )}
                    {p.shape === 'star' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={p.color}>
                        <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
                      </svg>
                    )}
                    {p.shape === 'streamer' && (
                      <span
                        className="block h-3.5 w-1.5 rounded-full"
                        style={{ backgroundColor: p.color, transform: 'skewX(14deg)' }}
                      />
                    )}
                    {p.shape === 'dot' && (
                      <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
                    )}
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* Interactive Cake Graphic */}
          <div className="relative w-full max-w-[380px] sm:max-w-[430px]">
            {/* Tap instruction badge hovering near the flame */}
            <AnimatePresence>
              {!blown && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
                >
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-champagne/60 bg-ivory/95 px-3 py-1 text-xs font-medium text-burgundy shadow-sm backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-champagne" />
                    {candleInstruction}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cake SVG */}
            <svg
              viewBox="0 0 440 380"
              className="h-auto w-full select-none overflow-visible drop-shadow-[0_16px_36px_rgba(75,23,40,0.08)]"
            >
              <defs>
                {/* Gold pedestal gradient */}
                <linearGradient id="standGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C8A059" />
                  <stop offset="25%" stopColor="#EAD29A" />
                  <stop offset="50%" stopColor="#FFF9EB" />
                  <stop offset="75%" stopColor="#D7B77A" />
                  <stop offset="100%" stopColor="#A8813C" />
                </linearGradient>

                {/* Bottom Tier Buttercream gradient */}
                <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F9E9EC" />
                  <stop offset="25%" stopColor="#FFF9F5" />
                  <stop offset="70%" stopColor="#FFFDFB" />
                  <stop offset="100%" stopColor="#F4D3DC" />
                </linearGradient>

                {/* Top Tier Strawberry Blush gradient */}
                <linearGradient id="tier2Grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F2CBD5" />
                  <stop offset="30%" stopColor="#FFF0F3" />
                  <stop offset="70%" stopColor="#FFF5F7" />
                  <stop offset="100%" stopColor="#E9B7C5" />
                </linearGradient>

                {/* Dripping Glaze Gradient */}
                <linearGradient id="dripGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FDECEF" />
                  <stop offset="100%" stopColor="#ECAEBf" />
                </linearGradient>

                {/* Candle Body Gold Pattern */}
                <linearGradient id="candleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D7B77A" />
                  <stop offset="40%" stopColor="#FFF9F5" />
                  <stop offset="70%" stopColor="#EAD29A" />
                  <stop offset="100%" stopColor="#C49B50" />
                </linearGradient>

                {/* Flame Gradients */}
                <linearGradient id="flameOuter" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="55%" stopColor="#FFAB00" />
                  <stop offset="100%" stopColor="#FFD200" />
                </linearGradient>
                <linearGradient id="flameInner" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#FFF9D2" />
                  <stop offset="100%" stopColor="#FFEA79" />
                </linearGradient>
              </defs>

              {/* 1. PEDESTAL STAND */}
              {/* Pedestal Cast Shadow */}
              <ellipse cx="220" cy="358" rx="100" ry="12" fill="rgba(75, 23, 40, 0.07)" />
              {/* Stand Foot Base */}
              <ellipse cx="220" cy="350" rx="85" ry="11" fill="url(#standGrad)" />
              <ellipse cx="220" cy="348" rx="82" ry="9" fill="#FFF9EB" opacity="0.6" />
              {/* Stand Stem */}
              <path
                d="M205 348 C205 328 212 308 198 296 L242 296 C228 308 235 328 235 348 Z"
                fill="url(#standGrad)"
              />
              <path
                d="M216 348 C216 328 219 308 215 296 L225 296 C221 308 224 328 224 348 Z"
                fill="#FFF9EB"
                opacity="0.45"
              />
              {/* Stand Rim Shadow */}
              <ellipse cx="220" cy="298" rx="155" ry="16" fill="rgba(75, 23, 40, 0.08)" />
              {/* Stand Plate Rim */}
              <ellipse cx="220" cy="292" rx="150" ry="15" fill="url(#standGrad)" />
              {/* Stand Plate Top Surface */}
              <ellipse cx="220" cy="290" rx="146" ry="13" fill="#FFF9F5" />
              <ellipse cx="220" cy="290" rx="143" ry="11" stroke="#D7B77A" strokeWidth="1" fill="none" opacity="0.45" />

              {/* 2. TIER 1 (BOTTOM TIER) */}
              {/* Tier 1 Body Side */}
              <path
                d="M95 210 L95 268 C95 288 345 288 345 268 L345 210 Z"
                fill="url(#tier1Grad)"
              />
              {/* Tier 1 Base Trim Pearls */}
              {Array.from({ length: 17 }).map((_, i) => {
                const angle = Math.PI - (Math.PI * i) / 16
                const px = 220 + Math.cos(angle) * 122
                const py = 278 + Math.sin(angle) * 9
                return (
                  <g key={`pearl-b-${i}`}>
                    <circle cx={px} cy={py} r="3" fill="#D7B77A" />
                    <circle cx={px - 0.7} cy={py - 0.7} r="1" fill="#FFF9F5" />
                  </g>
                )
              })}

              {/* Tier 1 Decorative Draped Swags */}
              <path
                d="M102 232 Q138 250 174 236 Q220 255 266 236 Q302 250 338 232"
                fill="none"
                stroke="#E9A5B5"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                opacity="0.8"
              />
              {/* Swag rosette bows */}
              {[102, 174, 266, 338].map((rx, idx) => (
                <g key={`swag-node-${idx}`}>
                  <circle cx={rx} cy={idx === 0 || idx === 3 ? 232 : 236} r="3.5" fill="#D7B77A" />
                  <circle cx={rx} cy={idx === 0 || idx === 3 ? 232 : 236} r="1.5" fill="#FFF9F5" />
                </g>
              ))}

              {/* Tier 1 Top Surface */}
              <ellipse cx="220" cy="210" rx="125" ry="22" fill="#FFF9F5" stroke="#D7B77A" strokeWidth="1" />
              {/* Tier 1 Pearl Border on Top */}
              {Array.from({ length: 21 }).map((_, i) => {
                const angle = Math.PI - (Math.PI * i) / 20
                const px = 220 + Math.cos(angle) * 123
                const py = 210 + Math.sin(angle) * 21
                return <circle key={`pearl-top-${i}`} cx={px} cy={py} r="2" fill="#E9A5B5" opacity="0.6" />
              })}

              {/* 3. TIER 2 (TOP TIER) */}
              {/* Tier 2 Body Side */}
              <path
                d="M140 140 L140 192 C140 208 300 208 300 192 L300 140 Z"
                fill="url(#tier2Grad)"
              />

              {/* Tier 2 Artistic Dripping Glaze */}
              <path
                d="M140 140 
                   Q148 166 154 152 
                   Q164 178 174 150 
                   Q186 186 198 156 
                   Q212 192 226 150 
                   Q238 182 250 154 
                   Q262 176 272 148 
                   Q284 170 292 152 
                   L300 140 Z"
                fill="url(#dripGrad)"
                opacity="0.95"
              />

              {/* Little Sugar Hearts & Star Pearls on the Top Tier */}
              <g transform="translate(182, 172) scale(0.55)">
                <path d={HEART_PATH} fill="#E9A5B5" opacity="0.75" />
              </g>
              <g transform="translate(244, 168) scale(0.5)">
                <path d={HEART_PATH} fill="#D7B77A" opacity="0.8" />
              </g>
              <circle cx="218" cy="176" r="2.5" fill="#D7B77A" />
              <circle cx="162" cy="165" r="2" fill="#FFF9F5" />
              <circle cx="276" cy="163" r="2" fill="#FFF9F5" />

              {/* Tier 2 Top Surface */}
              <ellipse cx="220" cy="140" rx="80" ry="16" fill="#FFF9F5" stroke="#D7B77A" strokeWidth="1" />

              {/* Buttercream Rosettes around the top tier rim */}
              {[
                { x: 146, y: 140, c: '#E9A5B5' },
                { x: 165, y: 148, c: '#D7B77A' },
                { x: 190, y: 154, c: '#E9A5B5' },
                { x: 220, y: 156, c: '#D7B77A' },
                { x: 250, y: 154, c: '#E9A5B5' },
                { x: 275, y: 148, c: '#D7B77A' },
                { x: 294, y: 140, c: '#E9A5B5' },
              ].map((r, idx) => (
                <g key={`rosette-${idx}`}>
                  <circle cx={r.x} cy={r.y} r="5" fill={r.c} opacity="0.85" />
                  <circle cx={r.x} cy={r.y - 1} r="3" fill="#FFF9F5" opacity="0.7" />
                  <circle cx={r.x} cy={r.y - 1.5} r="1.2" fill={r.c} />
                </g>
              ))}

              {/* 4. THE BIRTHDAY CANDLE */}
              {/* Candle Body */}
              <rect x="214" y="85" width="12" height="52" rx="3" fill="url(#candleGrad)" stroke="#C49B50" strokeWidth="0.8" />
              {/* Candle Spiraled Ribbons */}
              <path
                d="M214 96 L226 90 M214 107 L226 101 M214 118 L226 112 M214 129 L226 123"
                stroke="#FFF9F5"
                strokeWidth="2.4"
                opacity="0.8"
                strokeLinecap="round"
              />
              {/* Candle Top Wax Rim */}
              <ellipse cx="220" cy="85" rx="6" ry="2.5" fill="#FFF9F5" />

              {/* Candle Wick */}
              <path
                d="M220 85 Q221 77 220 70"
                stroke="#4B1728"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Glowing Ember Tip when blown */}
              {blown && (
                <motion.circle
                  cx="220"
                  cy="70"
                  r="2"
                  initial={{ opacity: 1, fill: '#FF5500' }}
                  animate={{ opacity: [1, 0.4, 0.8, 0], fill: ['#FF5500', '#FF2200', '#882200', '#4B1728'] }}
                  transition={{ duration: 3.5, ease: 'easeOut' }}
                />
              )}

              {/* 5. SMOKE WISPS (Curling upwards when blown) */}
              <AnimatePresence>
                {blown && (
                  <g>
                    {/* Wisp 1 */}
                    <motion.path
                      d="M220 70 C214 52 226 36 215 15"
                      fill="none"
                      stroke="rgba(100, 60, 75, 0.6)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.8, y: 0, scale: 0.8 }}
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0.8, 0.4, 0],
                        y: -50,
                        scale: 1.4,
                      }}
                      transition={{ duration: 2.2, ease: 'easeOut' }}
                      style={{ originX: '220px', originY: '70px' }}
                    />
                    {/* Wisp 2 */}
                    <motion.path
                      d="M220 70 C226 56 212 40 224 10"
                      fill="none"
                      stroke="rgba(140, 90, 110, 0.5)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.7, y: 0, scale: 0.8 }}
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0.7, 0.35, 0],
                        y: -65,
                        scale: 1.6,
                      }}
                      transition={{ duration: 2.5, delay: 0.15, ease: 'easeOut' }}
                      style={{ originX: '220px', originY: '70px' }}
                    />
                    {/* Wisp 3 */}
                    <motion.path
                      d="M220 70 C218 60 224 48 218 25"
                      fill="none"
                      stroke="rgba(180, 130, 150, 0.4)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.6, y: 0 }}
                      animate={{
                        pathLength: [0, 1],
                        opacity: [0.6, 0.2, 0],
                        y: -40,
                      }}
                      transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
                      style={{ originX: '220px', originY: '70px' }}
                    />
                  </g>
                )}
              </AnimatePresence>

              {/* 6. THE FLAME (Alive and dancing when lit) */}
              <AnimatePresence>
                {!blown && (
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    exit={{
                      scaleX: [1, 2.4, 0],
                      scaleY: [1, 0.2, 0],
                      x: [0, 30, 45],
                      opacity: [1, 0.8, 0],
                      transition: { duration: 0.32, ease: 'easeOut' },
                    }}
                    style={{ originX: '220px', originY: '70px' }}
                  >
                    {/* Ambient Candle Halo Glow */}
                    <motion.circle
                      cx="220"
                      cy="60"
                      r="42"
                      fill="url(#cakeGlow)"
                      animate={{
                        r: [40, 48, 38, 46, 40],
                        opacity: [0.75, 0.95, 0.7, 0.9, 0.75],
                      }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                    />

                    {/* Outer Dancing Flame */}
                    <motion.path
                      d="M220 34 C234 50 236 64 220 71 C204 64 206 50 220 34 Z"
                      fill="url(#flameOuter)"
                      animate={{
                        scaleY: [1, 1.09, 0.93, 1.06, 1],
                        scaleX: [1, 0.93, 1.07, 0.96, 1],
                        rotate: [-2.5, 3, -1.8, 2.5, -2.5],
                      }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                      style={{ originX: '220px', originY: '71px' }}
                    />

                    {/* Inner Golden White Incandescent Core */}
                    <motion.path
                      d="M220 45 C227 55 228 65 220 69 C212 65 213 55 220 45 Z"
                      fill="url(#flameInner)"
                      animate={{
                        scaleY: [1, 1.05, 0.95, 1.03, 1],
                        scaleX: [1, 0.96, 1.04, 0.98, 1],
                        rotate: [1, -2, 1.5, -1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
                      style={{ originX: '220px', originY: '69px' }}
                    />

                    {/* Soft Base Spark */}
                    <ellipse cx="220" cy="70" rx="4" ry="2" fill="rgba(120, 100, 255, 0.45)" />

                    {/* Tiny Rising Sparkle Dust */}
                    <motion.circle
                      cx="217"
                      cy="38"
                      r="1.2"
                      fill="#FFF9F5"
                      animate={{ y: [-2, -18], x: [-1, 6], opacity: [0.9, 0], scale: [1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="223"
                      cy="44"
                      r="1"
                      fill="#FFD200"
                      animate={{ y: [-1, -15], x: [1, -5], opacity: [0.8, 0], scale: [1, 0.2] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>

            {/* Clickable / Tappable Flame Target Overlay */}
            {!blown && (
              <button
                type="button"
                onClick={blowCandle}
                aria-label="Blow out the candle flame"
                className="group absolute left-[45%] top-[6%] h-20 w-24 -translate-x-1/2 cursor-pointer focus-visible:outline-none"
              >
                <span className="sr-only">Blow out candle</span>
                {/* Subtle touch indicator on hover */}
                <span className="absolute inset-0 rounded-full border border-champagne/0 transition-all duration-300 group-hover:scale-110 group-hover:border-champagne/40 group-hover:bg-champagne/10" />
              </button>
            )}
          </div>

          {/* Interactive Controls Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {!blown ? (
              <>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={blowCandle}
                  className="btn-glow inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-gradient-to-r from-burgundy via-[#682339] to-burgundy px-7 py-3 font-serif text-lg text-ivory shadow-lg transition-transform"
                >
                  <Wind className="h-4 w-4 text-champagne" />
                  Make a Wish & Blow
                  <Heart className="h-4 w-4 fill-petal text-petal" />
                </motion.button>

                <button
                  type="button"
                  onClick={toggleMic}
                  className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
                    micActive
                      ? 'border-petal bg-petal/20 text-burgundy shadow-inner'
                      : 'border-champagne/40 bg-ivory/80 text-burgundy/80 hover:bg-blush/30 hover:text-burgundy'
                  }`}
                  aria-pressed={micActive}
                >
                  {micActive ? (
                    <>
                      <MicOff className="h-4 w-4 text-petal animate-pulse" />
                      Listening for breath... ({micVolume}%)
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 text-champagne" />
                      Blow with Mic 🎙️
                    </>
                  )}
                </button>
              </>
            ) : (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={relightCandle}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-champagne/50 bg-ivory/90 px-6 py-2.5 font-medium text-burgundy shadow-sm transition-colors hover:bg-blush/40"
              >
                <RotateCcw className="h-4 w-4 text-champagne" />
                {relightButton}
              </motion.button>
            )}
          </div>

          {micError && <p className="mt-2 text-xs text-burgundy/60">{micError}</p>}
        </div>

        {/* Wish Granted Reveal Letter / Card */}
        <AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto mt-14 max-w-xl overflow-hidden rounded-3xl border border-champagne/40 bg-ivory/90 p-8 text-center shadow-[0_20px_50px_rgba(75,23,40,0.08)] backdrop-blur-md sm:p-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(233,165,181,0.25),transparent_70%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(215,183,122,0.2),transparent_70%)]"
              />

              <span className="inline-block font-sans text-[11px] font-semibold tracking-[0.25em] text-[#9A6B2F]">
                ✦ {wishGrantedBadge} ✦
              </span>

              <h3 className="mt-3 font-serif text-[clamp(2.1rem,6vw,3.4rem)] leading-tight text-burgundy">
                {headline}
              </h3>

              <div className="mx-auto my-5 h-px w-20 bg-gradient-to-r from-transparent via-champagne to-transparent" />

              <p className="whitespace-pre-line font-hand text-[1.65rem] leading-snug text-burgundy/85 sm:text-[1.85rem]">
                {wishGrantedMessage}
              </p>

              <div className="mt-7 flex items-center justify-center gap-2 font-hand text-xl text-[#A8405F]">
                <span>With all my love,</span>
                <span className="font-semibold text-burgundy">{config.yourName}</span>
                <Heart className="h-4 w-4 fill-petal text-petal" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
