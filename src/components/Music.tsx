import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, Pause, Play, Sparkles, Volume2, VolumeX, Radio } from 'lucide-react'
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
          style={{
            height: '100%',
            ['--d' as string]: `${d}s`,
            animationPlayState: playing ? 'running' : 'paused',
            transform: playing ? undefined : 'scaleY(0.3)',
          }}
        />
      ))}
    </span>
  )
}

/** Musical symbols that float upward from the stylus needle contact point */
const MUSIC_NOTES = ['♪', '♫', '♩', '♬', '♡', '✦']

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

/** Screen 7: Realistic Vintage Vinyl Turntable with Needle Drop & Soundwave Ripples */
export default function Music() {
  const {
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
  } = useMusic()

  const { title, artist, caption } = config.music

  // Track progress (0 to 1) for tonearm groove tracking
  const progress = useMemo(() => {
    if (duration > 0 && currentTime > 0) {
      return Math.min(1, Math.max(0, currentTime / duration))
    }
    return 0
  }, [currentTime, duration])

  // Contact flash trigger when needle hits the groove
  const [showContactFlash, setShowContactFlash] = useState(false)
  const prevNeedleState = useRef(needleState)

  useEffect(() => {
    if (prevNeedleState.current === 'dropping' && needleState === 'playing') {
      setShowContactFlash(true)
      const timer = setTimeout(() => setShowContactFlash(false), 700)
      return () => clearTimeout(timer)
    }
    prevNeedleState.current = needleState
  }, [needleState])

  // Calculated tonearm rotation angle:
  // Parked at rest post: 0°
  // Dropping into lead-in groove: ~20°
  // Playing (tracking from outer groove to inner label): 20° -> 30°
  // Lifting up: holds current angle or lifts to 0°
  const needleAngle = useMemo(() => {
    switch (needleState) {
      case 'parked':
        return 0
      case 'dropping':
        return 20.5
      case 'playing':
        // Smoothly glide inward from outer groove (20.5°) to inner run-out groove (29.5°)
        return 20.5 + progress * 9.0
      case 'lifting':
        return 0
      default:
        return 0
    }
  }, [needleState, progress])

  // Tonearm vertical height offset (y translation) to simulate arm lift & drop:
  // When parked: 0px (in cradle)
  // When dropping / lifting: -10px (raised up by cueing lever)
  // When playing: 0px (stylus resting down on record surface)
  const tonearmY = needleState === 'dropping' || needleState === 'lifting' ? -10 : 0
  const tonearmScale = needleState === 'dropping' || needleState === 'lifting' ? 1.02 : 1

  // Turntable spin duration based on 33 vs 45 RPM
  const spinDuration = speed === 45 ? '3.5s' : '5.2s'

  // Procedural audio waveform heights
  const [waveSeed, setWaveSeed] = useState(0)
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setWaveSeed((s) => (s + 1) % 1000), 120)
    return () => clearInterval(id)
  }, [playing])

  const waveformBars = useMemo(() => {
    const totalBars = 32
    return Array.from({ length: totalBars }, (_, i) => {
      if (!playing) {
        // Resting gentle wave curve
        return 20 + Math.sin((i / totalBars) * Math.PI) * 25
      }
      // Dynamic dancing frequency bars
      const freq = Math.sin((i + waveSeed * 0.4) * 0.5) * 0.5 + 0.5
      const secondary = Math.cos((i * 1.3 - waveSeed * 0.6) * 0.8) * 0.5 + 0.5
      const heightPercent = 18 + freq * 55 + secondary * 27
      return Math.min(100, Math.max(15, heightPercent))
    })
  }, [playing, waveSeed])

  // Scrubbing handler on the waveform
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    if (duration > 0) {
      seek(percent * duration)
    }
  }

  return (
    <section
      aria-labelledby="music-title"
      className="relative overflow-hidden bg-blush px-5 py-24 text-burgundy sm:px-6 md:py-32"
    >
      {/* Ambient background acoustic ripples expanding from turntable */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 md:left-1/3"
      >
        <div
          className={`absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,249,245,0.85)_0%,rgba(247,221,226,0.45)_50%,transparent_75%)] transition-opacity duration-1000 ${
            playing ? 'opacity-100' : 'opacity-40'
          }`}
        />
        {playing && (
          <>
            <div
              className="aura-ripple absolute inset-0 rounded-full border border-champagne/40 bg-[radial-gradient(circle,rgba(215,183,122,0.18)_0%,transparent_70%)]"
              style={{ ['--duration' as string]: '3.8s', ['--delay' as string]: '0s' }}
            />
            <div
              className="aura-ripple absolute inset-0 rounded-full border border-petal/35 bg-[radial-gradient(circle,rgba(233,165,181,0.14)_0%,transparent_70%)]"
              style={{ ['--duration' as string]: '3.8s', ['--delay' as string]: '1.2s' }}
            />
            <div
              className="aura-ripple absolute inset-0 rounded-full border border-champagne/25"
              style={{ ['--duration' as string]: '3.8s', ['--delay' as string]: '2.4s' }}
            />
          </>
        )}
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ============================================================ */}
        {/* TURNTABLE DECK & VINYL RECORD WITH ARTICULATED TONEARM       */}
        {/* ============================================================ */}
        <div className="relative mx-auto w-full max-w-[430px] lg:col-span-6">
          {/* Turntable Plinth / Chassis */}
          <div
            className="group relative aspect-square w-full select-none rounded-[2.5rem] p-4 transition-shadow duration-500 sm:p-5"
            style={{
              background:
                'linear-gradient(145deg, #2a1427 0%, #1c0d1b 45%, #150914 100%)',
              boxShadow:
                '0 35px 80px -25px rgba(27,11,24,0.75), 0 0 0 1px rgba(215,183,122,0.22), inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          >
            {/* Turntable top deck brushed metallic veneer */}
            <div
              aria-hidden
              className="absolute inset-2.5 rounded-[2rem] border border-champagne/15 bg-gradient-to-br from-white/[0.04] via-transparent to-black/30 pointer-events-none"
            />

            {/* Brass corner accent bolts */}
            <span className="absolute left-5 top-5 h-2 w-2 rounded-full border border-champagne/60 bg-champagne/25 shadow-sm" />
            <span className="absolute right-5 top-5 h-2 w-2 rounded-full border border-champagne/60 bg-champagne/25 shadow-sm" />
            <span className="absolute bottom-5 left-5 h-2 w-2 rounded-full border border-champagne/60 bg-champagne/25 shadow-sm" />
            <span className="absolute bottom-5 right-5 h-2 w-2 rounded-full border border-champagne/60 bg-champagne/25 shadow-sm" />

            {/* Turntable Platter Well (recessed ring) */}
            <div
              className="absolute left-[5%] top-[7%] aspect-square w-[75%] rounded-full shadow-[inset_0_10px_25px_rgba(0,0,0,0.85)]"
              style={{
                background: 'radial-gradient(circle, #0e050c 0%, #160a14 85%, #251222 100%)',
              }}
            >
              {/* Platter Stroboscopic Rim dots */}
              <div
                aria-hidden
                className={`absolute inset-[-4px] rounded-full border-2 border-dashed border-[#573e52]/60 ${
                  playing ? 'spin' : ''
                }`}
                style={{
                  ['--speed' as string]: spinDuration,
                  animationPlayState: playing ? 'running' : 'paused',
                }}
              />

              {/* Platter Aluminum Edge */}
              <div
                aria-hidden
                className="absolute inset-[2px] rounded-full border border-champagne/20 bg-gradient-to-br from-[#3b2337] via-[#1c0d1b] to-[#2f192b] shadow-inner"
              />

              {/* ====================================================== */}
              {/* THE 12-INCH VINYL RECORD                               */}
              {/* ====================================================== */}
              <div
                role="button"
                tabIndex={0}
                onClick={toggle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle()
                  }
                }}
                aria-label={
                  playing ? 'Vinyl record is spinning. Click to lift needle' : 'Click to drop needle and play'
                }
                className="absolute inset-[6px] cursor-pointer rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
              >
                {/* Rotating Vinyl Body */}
                <div
                  className={`spin relative h-full w-full rounded-full ${playing ? '' : ''}`}
                  style={{
                    ['--speed' as string]: spinDuration,
                    animationPlayState: playing ? 'running' : 'paused',
                    background:
                      'radial-gradient(circle, #10060e 0%, #1a0b17 28%, #120610 32%, #1b0c18 68%, #10050e 72%, #170a15 100%)',
                  }}
                >
                  {/* Microgroove concentric rings texture */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'repeating-radial-gradient(circle, transparent 0 1.8px, rgba(255,255,255,0.035) 2.2px 3.2px, transparent 3.5px 5px)',
                    }}
                  />

                  {/* Recorded Track Dividers (Silent groove bands on vinyl) */}
                  <div
                    aria-hidden
                    className="absolute inset-[22%] rounded-full border border-black/60 shadow-[0_0_1px_rgba(255,255,255,0.1)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-[36%] rounded-full border border-black/70 shadow-[0_0_1px_rgba(255,255,255,0.08)]"
                  />

                  {/* Dual Anisotropic Light Sheen (Signature vinyl light reflection glints) */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[conic-gradient(from_40deg,transparent_0_18%,rgba(255,249,245,0.16)_26%,transparent_34%_68%,rgba(255,249,245,0.12)_76%,transparent_84%)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[conic-gradient(from_220deg,transparent_0_18%,rgba(255,249,245,0.15)_26%,transparent_34%_68%,rgba(255,249,245,0.11)_76%,transparent_84%)]"
                  />

                  {/* Center Vintage Audiophile Record Label */}
                  <div
                    className="absolute left-1/2 top-1/2 grid h-[35%] w-[35%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#a88447]/60 shadow-[0_0_12px_rgba(0,0,0,0.6)]"
                    style={{
                      background:
                        'radial-gradient(circle at 45% 40%, #fae8ec 0%, #f2c7d2 45%, #d79ca8 75%, #a86c7b 100%)',
                    }}
                  >
                    {/* Concentric label track lines */}
                    <div className="absolute inset-2 rounded-full border border-burgundy/25" />
                    <div className="absolute inset-3 rounded-full border border-burgundy/15" />

                    {/* Circular typography ring */}
                    <svg
                      aria-hidden
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full"
                    >
                      <path
                        id="labelCurveTop"
                        d="M 16,50 A 34,34 0 0,1 84,50"
                        fill="none"
                      />
                      <text className="fill-burgundy text-[5.8px] font-semibold tracking-[0.22em] uppercase">
                        <textPath href="#labelCurveTop" startOffset="50%" textAnchor="middle">
                          BHAVANA & VIKASH
                        </textPath>
                      </text>
                      <path
                        id="labelCurveBottom"
                        d="M 84,50 A 34,34 0 0,1 16,50"
                        fill="none"
                      />
                      <text className="fill-burgundy/70 text-[4.8px] font-medium tracking-[0.2em] uppercase">
                        <textPath href="#labelCurveBottom" startOffset="50%" textAnchor="middle">
                          OUR LITTLE UNIVERSE • SIDE A
                        </textPath>
                      </text>
                    </svg>

                    {/* Center spindle & golden heart emblem */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <Heart className="h-4 w-4 text-burgundy drop-shadow-sm transition-transform duration-300 hover:scale-125" />
                      <span className="mt-0.5 text-[5px] font-serif font-bold tracking-wider text-burgundy/80">
                        33 ⅓ RPM
                      </span>
                    </div>

                    {/* Polished brass center spindle hole & pin */}
                    <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ivory/80 bg-gradient-to-br from-champagne via-[#9c773a] to-plum shadow-md">
                      <span className="absolute inset-0.5 rounded-full bg-ivory/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ====================================================== */}
            {/* TONEARM REST POST / CRADLE                             */}
            {/* ====================================================== */}
            <div
              aria-hidden
              className="absolute right-[9%] top-[62%] h-12 w-4 -translate-y-1/2"
            >
              {/* Post pillar */}
              <div className="mx-auto h-9 w-2 rounded-t-sm bg-gradient-to-r from-[#6e502c] via-champagne to-[#4a341b] shadow-md" />
              {/* Cradle clamp clip */}
              <div className="absolute -left-1 top-0 h-2.5 w-4 rounded-sm border border-champagne/40 bg-plum shadow-inner" />
            </div>

            {/* ====================================================== */}
            {/* ARTICULATED TONEARM ASSEMBLY                           */}
            {/* ====================================================== */}
            <div className="absolute right-[11%] top-[9%] h-[74%] w-16 pointer-events-none">
              {/* Tonearm Gimbal & Pivot Tower (Fixed to chassis) */}
              <div className="absolute right-0 top-0 z-30 h-14 w-14 -translate-x-1 -translate-y-1">
                {/* Outer Gimbal Base Ring */}
                <div className="absolute inset-0 rounded-full border border-champagne/50 bg-gradient-to-br from-[#533924] via-champagne to-[#311f12] shadow-xl">
                  {/* Concentric knurled ring */}
                  <div className="absolute inset-1.5 rounded-full border border-black/40 bg-gradient-to-tr from-[#1f101b] to-[#3f2619]" />
                </div>
                {/* Pivot Gimbal Bearing Cap */}
                <div className="absolute inset-3 rounded-full border border-champagne/70 bg-gradient-to-br from-champagne via-[#eed7aa] to-[#7f5c29] shadow-md">
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#3b2315] to-[#1a0a14]" />
                  <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne shadow-[0_0_4px_#d7b77a]" />
                </div>

                {/* Cylindrical Counterweight extending backward */}
                <div className="absolute -top-3.5 right-1.5 h-6 w-11 rounded-sm border border-champagne/60 bg-gradient-to-b from-[#2b1828] via-[#4d3222] to-[#180a15] shadow-lg">
                  {/* Counterweight calibration ring markings */}
                  <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-champagne/40" />
                  <div className="absolute left-4.5 top-0 bottom-0 w-[1px] bg-champagne/70" />
                  <div className="absolute left-6.5 top-0 bottom-0 w-[1px] bg-champagne/40" />
                </div>

                {/* Cueing Lever */}
                <motion.div
                  className="absolute -left-2 top-8 h-6 w-1 rounded-full bg-gradient-to-b from-champagne to-[#84632f] shadow"
                  animate={{
                    rotate: needleState === 'playing' ? 18 : -15,
                    y: needleState === 'playing' ? 2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-ivory shadow-sm" />
                </motion.div>
              </div>

              {/* MOVING TONEARM (Wand, Headshell, Stylus, Ripples) */}
              <motion.div
                className="absolute right-6 top-6 z-20 h-full w-full origin-[calc(100%-8px)_6px]"
                animate={{
                  rotate: needleAngle,
                  y: tonearmY,
                  scale: tonearmScale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: needleState === 'dropping' ? 70 : 85,
                  damping: needleState === 'dropping' ? 14 : 16,
                  mass: 1.1,
                }}
              >
                {/* Dynamic tone-arm drop shadow on record */}
                <div
                  aria-hidden
                  className="absolute inset-0 translate-x-2 translate-y-3 opacity-40 blur-[3px]"
                >
                  <svg viewBox="0 0 100 240" className="h-full w-full">
                    <path
                      d="M 92,6 Q 90,95 72,150 T 40,215"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* S-Shaped Tone-Arm Wand (Brushed champagne gold) */}
                <svg viewBox="0 0 100 240" className="h-full w-full filter drop-shadow-md">
                  <defs>
                    <linearGradient id="armGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#faecd0" />
                      <stop offset="40%" stopColor="#d7b77a" />
                      <stop offset="70%" stopColor="#9c773a" />
                      <stop offset="100%" stopColor="#d7b77a" />
                    </linearGradient>
                  </defs>
                  {/* Metallic arm tube */}
                  <path
                    d="M 92,6 Q 90,95 72,150 T 40,215"
                    fill="none"
                    stroke="url(#armGold)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  {/* Subtle highlight line on arm wand */}
                  <path
                    d="M 92,6 Q 90,95 72,150 T 40,215"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeOpacity="0.45"
                  />
                </svg>

                {/* ==================================================== */}
                {/* HEADSHELL & STYLUS CARTRIDGE                         */}
                {/* ==================================================== */}
                <div className="absolute bottom-2 left-6 z-30 h-11 w-8 origin-top -rotate-[22deg]">
                  {/* Headshell Body */}
                  <div className="relative h-9 w-6 rounded-[3px] border border-champagne/70 bg-gradient-to-b from-[#351b30] via-plum to-[#120510] shadow-md">
                    {/* Finger-lift hook */}
                    <div className="absolute -right-3.5 top-1 h-1 w-4 rounded-r-full bg-champagne shadow-sm" />
                    {/* Cartridge face badge */}
                    <div className="absolute inset-x-1 top-1.5 h-1.5 rounded-sm bg-champagne/40" />

                    {/* Diamond Stylus Needle Tip */}
                    <div className="absolute -bottom-2 left-1/2 h-3 w-1.5 -translate-x-1/2">
                      {/* Cartridge needle shank */}
                      <span className="absolute top-0 left-1/2 h-2 w-1 -translate-x-1/2 bg-ivory shadow-sm" />
                      {/* Stylus needle diamond point */}
                      <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-champagne shadow-[0_0_6px_#d7b77a]" />
                    </div>
                  </div>

                  {/* ================================================== */}
                  {/* 🎵 SOUNDWAVE RIPPLES AT NEEDLE CONTACT POINT       */}
                  {/* ================================================== */}
                  <div
                    aria-hidden
                    className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2"
                  >
                    {/* Active needle diamond contact beacon */}
                    {playing && (
                      <span className="absolute -inset-1 rounded-full bg-champagne shadow-[0_0_10px_2px_#d7b77a] animate-pulse" />
                    )}

                    {/* Initial Needle Drop Contact Flash */}
                    {showContactFlash && (
                      <div className="needle-flash absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(255,249,245,0.95)_0%,rgba(215,183,122,0.8)_40%,transparent_75%)]" />
                    )}

                    {/* Continuous Soundwave Ripples radiating outward */}
                    {playing && (
                      <>
                        <div
                          className="soundwave-ripple h-14 w-14 border border-champagne/80 shadow-[0_0_12px_rgba(215,183,122,0.65)]"
                          style={{
                            ['--duration' as string]: '2.4s',
                            ['--delay' as string]: '0s',
                          }}
                        />
                        <div
                          className="soundwave-ripple h-20 w-20 border border-petal/70 shadow-[0_0_14px_rgba(233,165,181,0.55)]"
                          style={{
                            ['--duration' as string]: '2.4s',
                            ['--delay' as string]: '0.6s',
                          }}
                        />
                        <div
                          className="soundwave-ripple h-28 w-28 border border-champagne/60 shadow-[0_0_16px_rgba(215,183,122,0.4)]"
                          style={{
                            ['--duration' as string]: '2.4s',
                            ['--delay' as string]: '1.2s',
                          }}
                        />
                        <div
                          className="soundwave-ripple h-36 w-36 border border-ivory/50 shadow-[0_0_18px_rgba(255,249,245,0.35)]"
                          style={{
                            ['--duration' as string]: '2.4s',
                            ['--delay' as string]: '1.8s',
                          }}
                        />

                        {/* Floating Musical Melody Notes */}
                        {MUSIC_NOTES.map((symbol, idx) => (
                          <span
                            key={idx}
                            className="float-music-note absolute font-serif text-sm font-bold text-champagne drop-shadow-[0_2px_6px_rgba(75,23,40,0.8)]"
                            style={{
                              ['--duration' as string]: `${2.8 + (idx % 3) * 0.5}s`,
                              ['--delay' as string]: `${idx * 0.45}s`,
                              ['--dx' as string]: `${((idx % 2 === 0 ? 1 : -1) * (14 + idx * 6))}px`,
                            }}
                          >
                            {symbol}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Turntable Plinth Lower Controls & Badges */}
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-ivory/80">
              {/* Power / Status Indicator Dot */}
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${
                    playing
                      ? 'bg-[#4ade80] shadow-[0_0_8px_#4ade80]'
                      : needleState === 'dropping'
                      ? 'bg-champagne shadow-[0_0_8px_#d7b77a] animate-ping'
                      : 'bg-ivory/30'
                  }`}
                />
                <span className="text-[10px] font-semibold tracking-widest text-champagne/90 uppercase">
                  {playing ? 'Playing' : needleState === 'dropping' ? 'Dropping' : 'Standby'}
                </span>
              </div>

              {/* Speed Switch (33 ⅓ vs 45 RPM) */}
              <button
                type="button"
                onClick={() => setSpeed(speed === 33 ? 45 : 33)}
                aria-label={`Toggle turntable speed: currently ${speed} RPM`}
                className="flex items-center gap-1 rounded-full border border-champagne/30 bg-plum/70 px-2.5 py-1 text-[10px] font-bold text-champagne transition hover:border-champagne hover:bg-plum"
              >
                <span>{speed === 33 ? '33 ⅓' : '45'}</span>
                <span className="text-[8px] opacity-75">RPM</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: TRACK DETAILS, WAVEFORM & INTERACTIVE CONTROLS */}
        {/* ============================================================ */}
        <div className="text-center lg:col-span-6 lg:text-left">
          {/* Header */}
          <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-ivory/60 px-3.5 py-1 text-xs font-medium tracking-wide text-burgundy shadow-sm backdrop-blur">
            <Radio className="h-3.5 w-3.5 text-burgundy animate-pulse" />
            <span>Vinyl Record Player</span>
          </div>

          <h2 id="music-title" className="mt-4 font-serif text-[clamp(2.5rem,6vw,4.8rem)] leading-[0.95]">
            A little music,
            <br />
            a little magic
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-burgundy/75 lg:mx-0">
            {caption}
          </p>

          {/* Interactive Player Console */}
          <div className="mt-8 rounded-3xl border border-burgundy/15 bg-ivory/80 p-5 shadow-[0_25px_50px_-20px_rgba(75,23,40,0.35)] backdrop-blur-md sm:p-6">
            {/* Track Info & Tonearm State Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-burgundy/10 pb-4">
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <Disc3
                    className={`h-5 w-5 text-burgundy transition-transform ${
                      playing ? 'spin' : ''
                    }`}
                  />
                  <h3 className="truncate font-serif text-2xl font-bold tracking-tight text-burgundy">
                    {title}
                  </h3>
                </div>
                <p className="mt-0.5 truncate text-xs font-medium tracking-wide text-burgundy/70">
                  {artist}
                </p>
              </div>

              {/* Real-time Needle State Indicator */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                  needleState === 'playing'
                    ? 'border border-[#4ade80]/40 bg-[#4ade80]/15 text-[#166534]'
                    : needleState === 'dropping'
                    ? 'border border-champagne/70 bg-champagne/20 text-[#855e1c] animate-pulse'
                    : needleState === 'lifting'
                    ? 'border border-petal/60 bg-petal/20 text-burgundy'
                    : 'border border-burgundy/15 bg-burgundy/5 text-burgundy/70'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    needleState === 'playing'
                      ? 'bg-[#22c55e]'
                      : needleState === 'dropping'
                      ? 'bg-champagne'
                      : 'bg-burgundy/40'
                  }`}
                />
                <span>
                  {needleState === 'playing'
                    ? 'Needle on Groove'
                    : needleState === 'dropping'
                    ? 'Dropping Needle...'
                    : needleState === 'lifting'
                    ? 'Lifting Tonearm...'
                    : 'Needle Parked'}
                </span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* INTERACTIVE SOUNDWAVE EQUALIZER / WAVEFORM               */}
            {/* ======================================================== */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-burgundy/70">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-champagne" />
                  <span>Soundwave Ripples</span>
                </span>
                <span className="tabular-nums font-mono">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </span>
              </div>

              {/* Clickable Soundwave Ribbon */}
              <div
                role="slider"
                aria-label="Audio scrubber"
                aria-valuemin={0}
                aria-valuemax={duration || 100}
                aria-valuenow={currentTime}
                tabIndex={0}
                onClick={handleSeek}
                className="group relative mt-2.5 flex h-14 cursor-pointer items-end gap-[3px] rounded-2xl bg-burgundy/5 p-2 transition hover:bg-burgundy/[0.08]"
              >
                {/* Progress highlight bar behind */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 top-0 rounded-2xl bg-gradient-to-r from-petal/30 via-champagne/20 to-transparent transition-all"
                  style={{ width: `${progress * 100}%` }}
                />

                {/* 32 Dynamic Soundwave Equalizer Bars */}
                {waveformBars.map((h, i) => {
                  const isPassed = duration > 0 ? (i / waveformBars.length) <= progress : false
                  return (
                    <span
                      key={i}
                      className="relative z-10 flex-1 rounded-full transition-all duration-150"
                      style={{
                        height: `${h}%`,
                        background: isPassed
                          ? 'linear-gradient(to top, #4B1728, #D7B77A)'
                          : playing
                          ? 'linear-gradient(to top, rgba(75,23,40,0.35), rgba(215,183,122,0.6))'
                          : 'rgba(75, 23, 40, 0.2)',
                      }}
                    />
                  )
                })}

                {/* Scrubber Needle Indicator Pin */}
                {duration > 0 && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-1 top-1 z-20 w-0.5 rounded-full bg-burgundy shadow-sm transition-all"
                    style={{ left: `${progress * 100}%` }}
                  >
                    <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-ivory bg-champagne shadow" />
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls & Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Main Play / Drop Needle Button */}
                <motion.button
                  type="button"
                  onClick={toggle}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.03 }}
                  aria-label={
                    playing
                      ? 'Lift needle and pause'
                      : needleState === 'dropping'
                      ? 'Needle is dropping'
                      : 'Drop needle and play song'
                  }
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-burgundy px-6 py-3 font-medium text-ivory shadow-lg shadow-burgundy/25 transition-colors hover:bg-plum active:scale-95"
                >
                  {playing ? (
                    <>
                      <Pause className="h-4 w-4" aria-hidden />
                      <span>Lift Needle</span>
                    </>
                  ) : needleState === 'dropping' ? (
                    <>
                      <Disc3 className="h-4 w-4 spin" aria-hidden />
                      <span>Dropping...</span>
                    </>
                  ) : (
                    <>
                      <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden />
                      <span>Drop Needle & Play</span>
                    </>
                  )}
                </motion.button>

                {/* Direct Drop / Lift Needle Quick Action */}
                <button
                  type="button"
                  onClick={playing ? liftNeedle : dropNeedle}
                  className="hidden items-center gap-1.5 rounded-full border border-burgundy/20 px-4 py-2.5 text-xs font-semibold text-burgundy transition hover:bg-burgundy/5 sm:inline-flex"
                >
                  <Disc3 className="h-3.5 w-3.5" />
                  <span>{playing ? 'Lift Arm' : 'Cue Needle'}</span>
                </button>
              </div>

              {/* Volume / Mute Toggle */}
              {audioReady && (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Unmute music' : 'Mute music'}
                  aria-pressed={muted}
                  className="grid h-12 w-12 place-items-center rounded-full border border-burgundy/15 text-burgundy/80 transition hover:bg-burgundy/10 hover:text-burgundy"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              )}
            </div>

            {/* Helpful tip & visual-only mode indicator */}
            <div className="mt-4 border-t border-burgundy/10 pt-3 text-xs text-burgundy/60">
              {!audioReady && import.meta.env.DEV ? (
                <p>Visual-only mode. Add an audio file in config.ts to play sound.</p>
              ) : (
                <p className="flex items-center justify-center gap-1.5 lg:justify-start">
                  <span>💡</span>
                  <span>Tip: You can also tap the vinyl record or tonearm directly!</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ORGANIC CURVED HORIZON DIVIDER (Transitions cleanly to Finale #4B1728) */}
      {/* Replaces the murky fog band with a crisp, deep wine curve   */}
      {/* ============================================================ */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-16 w-full overflow-hidden sm:h-24"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full text-[#4B1728]"
        >
          <path
            d="M0,40 C340,95 620,10 900,60 C1180,110 1340,30 1440,55 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}

/** Floating mini player that appears once music has started, allowing play/pause anywhere */
export function MiniPlayer({ visible }: { visible: boolean }) {
  const { audioReady, playing, needleState, muted, toggle, toggleMute } = useMusic()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (playing || needleState === 'dropping') setStarted(true)
  }, [playing, needleState])

  const show = visible && (audioReady || started) && started

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Floating record player"
          className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-40 flex items-center gap-2 rounded-full border border-champagne/40 bg-plum/90 p-1.5 pr-4 text-ivory shadow-2xl backdrop-blur-md"
        >
          {/* Spinning Mini Record Badge */}
          <div
            onClick={toggle}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-champagne/40 bg-gradient-to-br from-[#2a1324] to-[#120510] ${
              playing ? 'spin' : ''
            }`}
            style={{ ['--speed' as string]: '5s' }}
          >
            <Disc3 className="h-5 w-5 text-champagne" />
          </div>

          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="grid h-10 w-10 place-items-center rounded-full text-ivory transition hover:bg-ivory/15"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
          </button>

          {audioReady && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute' : 'Mute'}
              className="grid h-10 w-10 place-items-center rounded-full text-ivory/70 transition hover:bg-ivory/15 hover:text-ivory"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          )}

          <Equalizer playing={playing && !muted} className="text-champagne" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
