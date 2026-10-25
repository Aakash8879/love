/* ==========================================================================
   ✿  PERSONALIZE EVERYTHING HERE  ✿
   This is the only file you need to edit. Replace anything in [BRACKETS].
   Tip: keep the quote marks around each piece of text.
   ========================================================================== */

export interface Photo {
  /** Put your photo in /public/photos and write its path, e.g. '/photos/photo-1.jpg'.
   *  Leave it empty ('') to show an elegant placeholder instead. */
  src: string
  /** Short description of the photo for screen readers. */
  alt: string
  /** Text shown on the placeholder until a real photo is added. */
  label: string
  caption: string
  /** Optional handwritten note next to the photo. Use '' to hide it. */
  note: string
  /** Optional date label. Use '' to hide it. */
  date: string
}

export const config = {
  herName: 'BHAVANA',
  yourName: 'Vikash',

  /* ---------- Screen 1: the invitation ---------- */
  invitation: {
    title: 'Happy Birthday to the girl who makes my world beautiful.',
    subtitle: 'Today is your day. I made this little universe just for your special day. Take a little journey with me.',
    button: 'Open your birthday surprise ♡',
  },

  /* ---------- Screen 2: her name ---------- */
  intro: {
    greeting: 'Happy Birthday, my love,',
    headlineLines: ['Today the world became brighter,', 'because it gave me you.'],
    support: 'Out of all the people and stars in this universe, my heart found its home in you.',
  },

  /* ---------- Screen 3: the letter ---------- */
  letter: {
    title: 'A birthday letter from my heart',
    intro: 'Some things are easier to write than to say out loud.',
    greeting: 'My Dearest Bhavana,',
    paragraphs: [
      'Happy Birthday, my love. Another year of you being the sweetest, most wonderful person in my world.',
      'I don’t know if I will ever find enough words to explain what you mean to me, but I know this: you have made ordinary days feel special, little moments feel unforgettable, and my life so much warmer just by being in it.',
      'If I could give you any gift today, it would be the ability to see yourself through my eyes. Then you would understand how deeply loved, incredibly special, and irreplaceable you are to me.',
      'You are not just someone I love. You are someone I want to keep choosing, in every sweet moment, on every quiet day, and in all the beautiful birthdays we have yet to share.',
      'This little website may have taken time to make, but you are the reason behind every detail. Happy Birthday, my whole universe.',
    ],
    closing: 'Forever and always yours,',
    signature: 'Vikash ♡',
  },

  /* ---------- Screen 4: photo gallery ---------- */
  gallery: {
    title: 'Our little universe',
    subtitle: 'A few moments I would keep forever, if time let me.',
    photos: [
      { src: '', alt: 'Your beautiful smile', label: 'Your Radiant Smile', caption: 'The smile that lights up my entire day.', note: 'My favorite view in the world ♡', date: 'Always' },
      { src: '', alt: 'Our quiet moments', label: 'Our Sweet Talks', caption: 'The first conversation I never wanted to end.', note: 'Just you and me ♡', date: 'Unforgettable' },
      { src: '', alt: 'Our favorite memories', label: 'Precious Memories', caption: 'A moment I wish I could pause forever.', note: 'Pure happiness ♡', date: 'Treasured' },
      { src: '', alt: 'Where my heart belongs', label: 'My Comfort & Home', caption: 'How safe, warm, and at ease I feel around you.', note: 'Where I belong ♡', date: 'Every day' },
      { src: '', alt: 'The start of our story', label: 'The Beginning of Us', caption: 'The start of so many beautiful tomorrows together.', note: 'Falling for you more ♡', date: 'Forever' },
      { src: '', alt: 'Celebrating your birthday', label: 'Celebrating You Today', caption: 'Today belongs to you, and you deserve all the love in the universe.', note: 'Happy Birthday, my love! 🎂', date: 'Your Special Day' },
    ] as Photo[],
  },

  /* ---------- Screen 5: birthday cake ---------- */
  cake: {
    title: 'Make a wish, my love',
    subtitle: 'Close your eyes, think of your sweetest dream, and blow out the candle.',
    candleInstruction: 'Tap the flame or blow to make your wish',
    wishGrantedBadge: 'A BIRTHDAY WISH FOR BHAVANA',
    wishGrantedHeadline: 'Happy Birthday, {name}! 🎂✨',
    wishGrantedMessage:
      'May all your silent wishes, secret dreams, and sweetest prayers come true this year.\nYou deserve all the happiness, tenderness, and magic this world has to offer.',
    relightButton: 'Make another wish 🕯️',
  },

  /* ---------- Screen 6: love garden ---------- */
  garden: {
    title: 'A birthday garden of notes',
    subtitle: 'Each glowing flower holds a sweet little thought just for you. Tap them all to bloom.',
    notes: [
      'You deserve all the beautiful, magical things life has to offer.',
      'Happy Birthday to the girl who stole my heart and made it her home.',
      'Somehow, you make my favorite moments even better just by being there.',
      'Your laugh is my favorite sound in the entire world.',
      'I hope this year brings you as much happiness as you give to me every single day.',
      'You are so much more wonderful and special than you realize.',
      'Thank you for being the sweetest, most caring girlfriend in the world.',
      'Wherever you are reading this right now, know that I’m smiling thinking of you. Happy Birthday, Bhavana ♡',
    ],
  },

  /* ---------- Screen 7: music ---------- */
  music: {
    /** Put an mp3 in /public/music and write its path, e.g. '/music/our-song.mp3'.
     *  Leave empty for a visual-only experience. Music never autoplays. */
    src: './music/Naine_Ra_Lobhi.mp3',
    title: 'Naine Ra Lobhi',
    artist: 'Vikash & Bhavana',
    caption: 'Press play whenever you’re ready. Some feelings sound better than they read.',
  },

  /* ---------- Screen 8: the final surprise ---------- */
  finale: {
    lines: ['After all the words…', 'All the wishes and little moments…', 'And everything this little website could never fully say…'],
    headline: 'MY FAVORITE PART OF THIS WORLD IS YOU.',
    promise:
      'I can’t promise that every day will be without clouds, but I promise that on every birthday, every morning, and every quiet night, you will always have all of my love.',
    surpriseButton: 'One last birthday surprise ♡',
    finalMessage:
      'Happy Birthday, Bhavana ♡\n\nYou are my sweetest reality, my warmest comfort, and my favorite reason to smile. I am so endlessly grateful to walk this journey with you.\n\nHere’s to another beautiful year of laughing together, making memories, and loving you more and more every single day.',
    hugButton: 'Receive your birthday hug ♡',
    hugMessage: 'Sending you the biggest, warmest birthday hug, wrapped in all my love. Happy Birthday, my Bhavana! ♡',
  },
}
