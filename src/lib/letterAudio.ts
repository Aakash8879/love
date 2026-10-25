/**
 * Web Audio synthesizer for the authentic 3D wax seal snap & parchment paper unfolding sounds.
 * Synthesizes tactile wax crackle, paper friction, and celebratory soft chimes.
 */

class LetterSoundFx {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  /**
   * Plays the realistic wax seal snap and parchment paper unfolding rustle.
   */
  playSealBreak(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime

      // 1. Wax seal crisp mechanical "snap" / fracture
      const snapLen = Math.floor(ctx.sampleRate * 0.05)
      const snapBuffer = ctx.createBuffer(1, snapLen, ctx.sampleRate)
      const snapData = snapBuffer.getChannelData(0)
      for (let i = 0; i < snapLen; i++) {
        snapData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (snapLen * 0.25))
      }
      const snapSource = ctx.createBufferSource()
      snapSource.buffer = snapBuffer

      const snapFilter = ctx.createBiquadFilter()
      snapFilter.type = 'highpass'
      snapFilter.frequency.setValueAtTime(1200, now)

      const snapGain = ctx.createGain()
      snapGain.gain.setValueAtTime(0.3, now)
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      snapSource.connect(snapFilter)
      snapFilter.connect(snapGain)
      snapGain.connect(ctx.destination)
      snapSource.start(now)

      // 2. Parchment paper sliding & unfolding rustle
      const paperLen = Math.floor(ctx.sampleRate * 0.35)
      const paperBuffer = ctx.createBuffer(1, paperLen, ctx.sampleRate)
      const paperData = paperBuffer.getChannelData(0)
      for (let i = 0; i < paperLen; i++) {
        paperData[i] = (Math.random() * 2 - 1) * 0.25 * (1 - i / paperLen)
      }
      const paperSource = ctx.createBufferSource()
      paperSource.buffer = paperBuffer

      const paperFilter = ctx.createBiquadFilter()
      paperFilter.type = 'bandpass'
      paperFilter.frequency.setValueAtTime(2200, now)
      paperFilter.frequency.exponentialRampToValueAtTime(800, now + 0.35)
      paperFilter.Q.setValueAtTime(1.5, now)

      const paperGain = ctx.createGain()
      paperGain.gain.setValueAtTime(0.001, now)
      paperGain.gain.linearRampToValueAtTime(0.18, now + 0.06)
      paperGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      paperSource.connect(paperFilter)
      paperFilter.connect(paperGain)
      paperGain.connect(ctx.destination)
      paperSource.start(now + 0.02)

      // 3. Delicate fairy chime note (warm music box tone on opening)
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1046.5, now + 0.1) // C6 note
      oscGain.gain.setValueAtTime(0.001, now + 0.1)
      oscGain.gain.linearRampToValueAtTime(0.08, now + 0.15)
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(now + 0.1)
      osc.stop(now + 0.95)
    } catch {
      // Audio fallback
    }
  }

  /**
   * Gentle paper folding sound when re-sealing the letter.
   */
  playReseal(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const len = Math.floor(ctx.sampleRate * 0.2)
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15 * Math.sin((i / len) * Math.PI)
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1200, now)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(now)
    } catch {
      // Audio fallback
    }
  }

  /**
   * Delicate crystal glass clink & paper unfolding sound when picking a note from the memory jar.
   */
  playJarPick(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime

      // 1. Crystal glass rim bell clink
      const glassOsc = ctx.createOscillator()
      const glassGain = ctx.createGain()
      glassOsc.type = 'sine'
      glassOsc.frequency.setValueAtTime(2489, now) // D#7 pure crystal tone
      glassGain.gain.setValueAtTime(0.08, now)
      glassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)

      glassOsc.connect(glassGain)
      glassGain.connect(ctx.destination)
      glassOsc.start(now)
      glassOsc.stop(now + 0.46)

      // 2. Origami paper flutter
      const len = Math.floor(ctx.sampleRate * 0.22)
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2 * Math.exp(-i / (len * 0.4))
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bpf = ctx.createBiquadFilter()
      bpf.type = 'bandpass'
      bpf.frequency.setValueAtTime(1800, now)
      bpf.Q.setValueAtTime(1.5, now)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.14, now + 0.05)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      noise.connect(bpf)
      bpf.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now + 0.05)

      // 3. Fairy bell tone
      const chime = ctx.createOscillator()
      const chimeGain = ctx.createGain()
      chime.type = 'sine'
      chime.frequency.setValueAtTime(1318.5, now + 0.12) // E6 note
      chimeGain.gain.setValueAtTime(0.06, now + 0.12)
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)

      chime.connect(chimeGain)
      chimeGain.connect(ctx.destination)
      chime.start(now + 0.12)
      chime.stop(now + 0.85)
    } catch {
      // Audio fallback
    }
  }

  /**
   * Slicing the birthday cake: soft knife gliding through buttercream and sponge,
   * gentle porcelain plate touch, and celebratory chimes.
   */
  playCakeCut(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime

      // 1. Soft culinary slice glide (filtered noise sweep)
      const len = Math.floor(ctx.sampleRate * 0.28)
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18 * Math.sin((i / len) * Math.PI)
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const bpf = ctx.createBiquadFilter()
      bpf.type = 'lowpass'
      bpf.frequency.setValueAtTime(800, now)
      bpf.frequency.exponentialRampToValueAtTime(250, now + 0.25)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.18, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

      noise.connect(bpf)
      bpf.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)

      // 2. Porcelain plate clink
      const plateOsc = ctx.createOscillator()
      const plateGain = ctx.createGain()
      plateOsc.type = 'sine'
      plateOsc.frequency.setValueAtTime(2093, now + 0.22) // C7 crystalline note
      plateGain.gain.setValueAtTime(0.04, now + 0.22)
      plateGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)

      plateOsc.connect(plateGain)
      plateGain.connect(ctx.destination)
      plateOsc.start(now + 0.22)
      plateOsc.stop(now + 0.62)

      // 3. Sweet celebratory chime (pentatonic chord arpeggio)
      const notes = [587.33, 783.99, 987.77, 1174.66] // D5, G5, B5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        const startTime = now + 0.25 + idx * 0.07

        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startTime)
        osc.stop(startTime + 0.82)
      })
    } catch {
      // Audio fallback
    }
  }

  /**
   * Firework rocket launch ascent whoosh.
   */
  playFireworkLaunch(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.55)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.6)
    } catch {
      // Audio fallback
    }
  }

  /**
   * Resonant low-frequency fireworks explosion boom & sparkling crackle.
   */
  playFireworkBurst(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime

      // 1. Low bass explosion thump
      const boom = ctx.createOscillator()
      const boomGain = ctx.createGain()
      boom.type = 'sine'
      boom.frequency.setValueAtTime(140, now)
      boom.frequency.exponentialRampToValueAtTime(32, now + 0.45)

      boomGain.gain.setValueAtTime(0.25, now)
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

      boom.connect(boomGain)
      boomGain.connect(ctx.destination)
      boom.start(now)
      boom.stop(now + 0.52)

      // 2. Sparkling crackle & shimmer trails
      const crackleCount = 7
      for (let i = 0; i < crackleCount; i++) {
        const offset = 0.12 + Math.random() * 0.45
        const popOsc = ctx.createOscillator()
        const popGain = ctx.createGain()
        popOsc.type = 'triangle'
        popOsc.frequency.setValueAtTime(1600 + Math.random() * 1400, now + offset)
        popGain.gain.setValueAtTime(0.03, now + offset)
        popGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08)

        popOsc.connect(popGain)
        popGain.connect(ctx.destination)
        popOsc.start(now + offset)
        popOsc.stop(now + offset + 0.09)
      }
    } catch {
      // Audio fallback
    }
  }
}

export const letterFx = new LetterSoundFx()
