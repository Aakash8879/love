import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MailOpen } from 'lucide-react'
import { config } from '../config'

/** Screen 3: an ivory, handwritten letter that writes itself in, line by line. */
export default function Letter() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { title, intro, greeting, paragraphs, closing, signature } = config.letter
  const blocks = [greeting, ...paragraphs]
  const step = reduce ? 0 : 0.85

  return (
    <section id="letter" aria-labelledby="letter-title" className="relative overflow-hidden bg-ivory px-5 py-24 text-burgundy sm:px-6 md:py-36">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(247,221,226,0.9),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)] md:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
          className="md:sticky md:top-28 md:self-start"
        >
          <h2 id="letter-title" className="text-balance font-serif text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.95]">
            {title}
          </h2>
          <p className="mt-6 max-w-xs text-base leading-relaxed text-burgundy/65">{intro}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="grain grain-paper relative rounded-[3px] bg-[#FFFDF8] shadow-[0_1px_0_rgba(75,23,40,0.06),0_40px_80px_-40px_rgba(75,23,40,0.45),0_12px_30px_-20px_rgba(75,23,40,0.25)]"
        >
          <div aria-hidden className="absolute inset-y-0 left-6 w-px bg-petal/60 sm:left-10" />
          <div className="paper-lines relative px-8 py-10 pl-12 font-hand text-[1.55rem] leading-[2.4rem] text-burgundy/90 sm:px-14 sm:py-14 sm:pl-20 sm:text-[1.7rem]">
            <AnimatePresence mode="wait" initial={false}>
              {!open ? (
                <motion.div key="preview" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                  <div className="relative max-h-[12rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_35%,transparent)]">
                    {blocks.slice(0, 3).map((b, i) => (
                      <p key={i} className="mb-[2.4rem] opacity-60">{b}</p>
                    ))}
                  </div>
                  <div className="flex justify-center pt-4 font-sans">
                    <motion.button
                      type="button"
                      onClick={() => setOpen(true)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex min-h-[48px] items-center gap-3 rounded-full bg-burgundy px-7 py-3 text-sm font-medium tracking-wide text-ivory shadow-[0_14px_30px_-12px_rgba(75,23,40,0.6)]"
                    >
                      <MailOpen className="h-4 w-4" aria-hidden />
                      Read my letter
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="letter" aria-live="polite">
                  {blocks.map((b, i) => (
                    <motion.p
                      key={i}
                      className="mb-[2.4rem]"
                      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * step, duration: reduce ? 0.1 : 1.1, ease: 'easeOut' }}
                    >
                      {b}
                    </motion.p>
                  ))}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: blocks.length * step, duration: 1.2 }}
                    className="text-right"
                  >
                    <p>{closing}</p>
                    <p className="text-[2rem] text-[#A8405F] sm:text-[2.2rem]">{signature}</p>
                    <p className="text-burgundy/60">{config.yourName}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
