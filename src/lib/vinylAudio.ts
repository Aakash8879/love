/**
 * Web Audio synthesizer for vintage vinyl record needle drop, groove static, and needle lift effects.
 * Synthesizes authentic mechanical thump and surface noise without external sound files.
 */

class VinylSoundFx {
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
   * Authentic vinyl needle drop sound:
   * 1. Low-end mechanical thump as the stylus tip settles into the PVC microgroove.
   * 2. Quick burst of micro-crackle and friction noise as the diamond slides into the wax.
   */
  playDrop(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime

      // 1. Mechanical cartridge thump (stylus suspension bounce)
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(68, now)
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.08)

      oscGain.gain.setValueAtTime(0.25, now)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)

      // 2. Vinyl groove friction & dust crackle burst
      const length = Math.floor(ctx.sampleRate * 0.16)
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        // Natural dust pops & groove friction noise
        const isPop = Math.random() < 0.04
        const popAmp = isPop ? (Math.random() * 0.9 + 0.4) : (Math.random() * 0.25 - 0.125)
        const decay = Math.exp(-i / (length * 0.4))
        data[i] = popAmp * decay
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      // Warm analog bandpass filter (removes harsh digital treble)
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1600, now)
      filter.Q.setValueAtTime(1.3, now)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.18, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)
    } catch {
      // AudioContext policy or device error fallback
    }
  }

  /**
   * Subtle needle lift sound (clean whisper of the diamond pulling out of the groove).
   */
  playLift(muted = false) {
    if (muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const length = Math.floor(ctx.sampleRate * 0.06)
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.18 * (1 - i / length)
      }

      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.setValueAtTime(1400, now)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start(now)
    } catch {
      // AudioContext policy or device error fallback
    }
  }
}

export const vinylFx = new VinylSoundFx()
