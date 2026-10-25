import { useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { initSmoothScroll, lockScroll, scrollToTarget } from './lib/smoothScroll'
import { config } from './config'
import { MusicProvider } from './context/MusicContext'
import Atmosphere from './components/Atmosphere'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Invitation from './components/Invitation'
import NameReveal from './components/NameReveal'
import Letter from './components/Letter'
import Gallery from './components/Gallery'
import BirthdayCake from './components/BirthdayCake'
import Garden from './components/Garden'
import Music, { MiniPlayer } from './components/Music'
import Finale from './components/Finale'

export default function App() {
  const [opened, setOpened] = useState(false)
  const [run, setRun] = useState(0)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    lockScroll(!opened)
    if (mainRef.current) mainRef.current.inert = !opened
  }, [opened])

  const restart = () => {
    scrollToTarget(0, true)
    setOpened(false)
    setRun((r) => r + 1)
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
    <MusicProvider>
      {!opened && <Invitation key={`invite-${run}`} onOpen={() => setOpened(true)} />}
      <Atmosphere />
      <CustomCursor />
      {opened && <ScrollProgress />}

      <main ref={mainRef} key={run} aria-hidden={!opened}>
        <NameReveal opened={opened} />
        <Letter />
        <Gallery />
        <BirthdayCake />
        <Garden />
        <Music />
        <Finale onRestart={restart} />
      </main>

      <footer className="flex flex-col items-center gap-3 bg-plum px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-8 text-center text-xs text-ivory/45">
        <p>Made with all my love by {config.yourName}</p>
        <button type="button" onClick={restart} className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 hover:text-ivory">
          <RotateCcw className="h-3 w-3" aria-hidden />
          Start again
        </button>
      </footer>

      <MiniPlayer visible={opened} />
    </MusicProvider>
    </MotionConfig>
  )
}
