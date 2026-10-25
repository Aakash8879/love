# Our Little Universe ♡

A personal, cinematic surprise website: an invitation behind a velvet curtain, her name, a handwritten letter, a photo gallery, an interactive birthday cake with candle blow & celebration, a night garden of hidden notes, an optional song, and a final surprise with a blooming rose, an envelope and a virtual hug.

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion and Lucide icons.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173). To test on your phone, run `npm run dev -- --host` and open the "Network" address on a phone connected to the same Wi‑Fi.

## Personalize it (one file)

Everything she will read lives in **`src/config.ts`**. Replace every `[PLACEHOLDER]`:

| What | Where in `config.ts` |
| --- | --- |
| Her name, your name | `herName`, `yourName` |
| Opening message and button | `invitation` |
| Name screen lines | `intro` |
| The love letter | `letter.paragraphs` (one string per paragraph) |
| Photos and captions | `gallery.photos` |
| Birthday cake & wishes | `cake` |
| Garden notes | `garden.notes` (add as many as you like) |
| Song | `music.src`, `music.title`, `music.artist` |
| Final message | `finale.finalMessage` |

Nothing about your relationship is invented. Every personal detail is a placeholder until you write it.

### Adding your photos

1. Put your images in `public/photos/`, for example `public/photos/photo-1.jpg`.
2. In `config.ts`, set `src: '/photos/photo-1.jpg'` and write a short `alt` description.
3. Use JPG or WebP, around 1600px on the longest side and under 500 KB each, so the site stays fast on mobile data.

Any photo with an empty `src` (or a file that fails to load) shows an elegant abstract placeholder instead of a broken image. The gallery layout repeats its pattern if you add more than six photos.

### Adding music

1. Put an MP3 in `public/music/`, for example `public/music/our-song.mp3`.
2. Set `music.src: '/music/our-song.mp3'`.

Use a song you have the right to use (a track you bought, or a royalty-free or Creative Commons track). Music never autoplays: she presses play. Once it's playing, a small player appears in the corner with pause and mute. With no song configured, the play button still animates the record and equalizer as a visual-only moment.

## Build and put it online

```bash
npm run build
```

This creates a `dist/` folder you can host anywhere. The easiest free options:

**Netlify Drop (no account setup, 1 minute):** go to https://app.netlify.com/drop and drag the `dist` folder onto the page. You get a link immediately. You can rename the site in Site settings.

**Vercel:** push the project to GitHub, import it at https://vercel.com/new, keep the detected Vite settings (build command `npm run build`, output `dist`), and deploy.

**GitHub Pages:** push the project to GitHub, run `npm run build`, and publish the `dist` folder (for example with the `gh-pages` package, or a GitHub Action for Vite). The project uses relative asset paths (`base: './'`), so it works from a sub-folder.

### Single-file version

```bash
npm run build:single
```

Creates `dist-single/index.html` with all code and styles inside one file. Handy for hosts that take one HTML file. Photos and music stay in `public/` folders, so copy `photos/` and `music/` next to it if you use them.

## Project structure

```
src/
  config.ts              ← all personal content (edit this)
  App.tsx                ← page order, start-again logic
  index.css              ← Tailwind, grain, paper and animation keyframes
  context/MusicContext.tsx
  components/
    Invitation.tsx       Screen 1: curtain + invitation
    NameReveal.tsx       Screen 2: her name
    Letter.tsx           Screen 3: handwritten letter
    Gallery.tsx          Screen 4: photo collage
    BirthdayCake.tsx     Screen 5: interactive birthday cake & candle blow
    Garden.tsx           Screen 6: interactive love garden
    Music.tsx            Screen 7: record player + floating mini player
    Finale.tsx           Screen 8: rose, envelope, virtual hug
    Atmosphere.tsx       floating petals and light (one canvas)
    CustomCursor.tsx     desktop-only trailing ring
    ScrollProgress.tsx, FloatingHearts.tsx, Heart.tsx
```

## Accessibility and comfort

Works with keyboard and screen readers, has visible focus outlines, keeps tap targets at least 44px, and respects the phone's "reduce motion" setting by turning off the drifting effects and showing text without long animations. The custom cursor only appears on devices with a mouse, and the normal cursor always stays visible.
