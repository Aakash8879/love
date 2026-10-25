/** A soft color fade at the top or bottom of a section, so sections melt into each other. */
export default function EdgeFade({ color, edge }: { color: string; edge: 'top' | 'bottom' }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-[1] h-28 md:h-40"
      style={{ [edge]: 0, background: `linear-gradient(${edge === 'top' ? '180deg' : '0deg'}, ${color}, transparent)` }}
    />
  )
}
