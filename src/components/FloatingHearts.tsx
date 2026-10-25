import { useMemo } from 'react'
import Heart from './Heart'

/** Delicate hearts that drift upward, behind content. Hidden for reduced motion via CSS. */
export default function FloatingHearts({ count = 6, className = 'text-petal' }: { count?: number; className?: string }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        size: 10 + ((i * 7) % 16),
        d: `${12 + ((i * 5) % 10)}s`,
        delay: `${-((i * 3.3) % 14)}s`,
        o: 0.25 + ((i * 13) % 30) / 100,
      })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`float-heart absolute -bottom-8 ${className}`}
          style={{ left: h.left, width: h.size, height: h.size, ['--d' as string]: h.d, ['--delay' as string]: h.delay, ['--o' as string]: h.o }}
        >
          <Heart className="h-full w-full" />
        </span>
      ))}
    </div>
  )
}
