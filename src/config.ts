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
    title: 'Happy Birthday, my love.',
    subtitle: 'A little universe made just for you and your special day ♡',
    button: 'Open your surprise ♡',
    /** The exact birthday date & time (YYYY-MM-DDTHH:mm:ss). When reached live, the main page opens automatically! */
    targetDate: '2026-11-02T00:00:00',
    countdownBadge: "Counting down to Bhavana's special day",
    birthdayArrivedBadge: "🎉 Happy Birthday, Bhavana! 🎂",
  },

  /* ---------- Screen 2: her name ---------- */
  intro: {
    greeting: 'Happy Birthday, my love,',
    headlineLines: ['The world is brighter', 'because it gave me you.'],
    support: 'Out of all the stars in this universe, my heart found its home in you.',
  },

  /* ---------- Screen 3: the letter ---------- */
  letter: {
    title: 'A birthday letter from my heart',
    intro: 'Written with all my love, just for you.',
    greeting: 'My Dearest Bhavana,',
    paragraphs: [
      'Happy Birthday, my love. Another beautiful year of you being the sweetest, most wonderful person in my world.',
      'If I could give you any gift today, it would be the power to see yourself through my eyes—so you would know how deeply loved, incredibly special, and irreplaceable you truly are.',
      'Thank you for being my warmest comfort, my favorite reason to smile, and my whole universe. Forever and always, I choose you.',
    ],
    closing: 'Forever yours,',
    signature: 'Vikash ♡',
  },

  /* ---------- Screen 4: photo gallery ---------- */
  gallery: {
    title: 'Our little universe',
    subtitle: 'Moments I would keep forever if time let me.',
    photos: [
      {
        src: './photos/beach-sunset.jpg',
        alt: 'Vikash and Bhavana embracing by the sea at sunset',
        label: 'Where My World Feels Complete',
        caption: 'Of all the sunsets in the world, this one with you is my forever favorite.',
        note: 'Lost in this moment with you ♡',
        date: 'Our Sunset Horizon',
      },
      {
        src: './photos/sparklers-smile.jpg',
        alt: 'Bhavana smiling radiantly holding sparklers at night',
        label: 'Your Radiant Smile',
        caption: 'Even the brightest sparklers in the night sky can’t match the light in your smile.',
        note: 'My favorite view in the universe ♡',
        date: 'Night of Lights',
      },
      {
        src: './photos/horse-riding.jpg',
        alt: 'Vikash and Bhavana riding horses together in the misty hills',
        label: 'Our Adventures Together',
        caption: 'Misty hills, shared laughter, and my favorite adventure partner by my side.',
        note: 'Riding through life together ♡',
        date: 'The Misty Trail',
      },
      {
        src: './photos/video-call.jpg',
        alt: 'Bhavana in cute teddy bear ears on video call with Vikash',
        label: 'Midnight Whispers',
        caption: 'Calls where hours feel like minutes, and I never want to say goodbye.',
        note: 'Cutest girl in the universe ♡',
        date: 'Late Night Talks',
      },
      {
        src: './photos/traditional-love.jpg',
        alt: 'Vikash in maroon kurta and Bhavana in traditional dress under festival lights',
        label: 'Standing Beside You',
        caption: 'Dressed in our best, but all I could look at was you.',
        note: 'You take my breath away ♡',
        date: 'Festive Magic',
      },
      {
        src: './photos/childhood.jpg',
        alt: 'Little Bhavana as a child holding a plate of treats',
        label: 'Little Bhavana',
        caption: 'This sweet little girl was already destined to steal my heart.',
        note: 'Always my sweetest soul ♡',
        date: 'Where It All Began',
      },
    ] as Photo[],
  },

  /* ---------- Screen 4.5: Reasons I Love You Memory Jar ---------- */
  memoryJar: {
    badge: 'A Jar of Sweet Memories',
    title: 'Reasons I love you',
    subtitle: 'Tap the jar to open a little folded memory from my heart.',
    tagText: 'For Bhavana ♡',
    jarLabel: 'Tap jar to pick a note ✨',
    reasons: [
      'The radiant smile on your face holding Diwali sparklers.',
      'How adorable you look in your teddy headband during late-night calls.',
      'Riding horses together through misty mountain trails.',
      'How you outshone every single star under the festive lights.',
      'The way hours feel like minutes whenever we talk.',
      'That golden sunset together watching the ocean waves with you.',
      'How safe, warm, and peaceful my heart feels beside you.',
      'The little girl with her sweets who grew up to be my whole world.',
      'The sweet way you say my name that turns any day around.',
      'The gentle way you care for the people you love with all your heart.',
      'How you make me want to be the best version of myself every single day.',
      'Because choosing you every morning and every night is the easiest thing I will ever do.',
    ],
  },

  /* ---------- Screen 5: birthday cake ---------- */
  cake: {
    title: 'Make a wish, my love',
    subtitle: 'Close your eyes, think of your sweetest dream, and blow out the candle.',
    candleInstruction: 'Tap flame or blow to make a wish',
    wishGrantedBadge: 'A BIRTHDAY WISH FOR BHAVANA',
    wishGrantedHeadline: 'Happy Birthday, {name}! 🎂✨',
    wishGrantedMessage:
      'May all your silent wishes and sweetest dreams come true.\nYou deserve all the magic this world has to offer.',
    cutInstruction: 'Tap the golden knife to cut your birthday slice ♡',
    cutButton: 'Cut Birthday Cake 🎂✨',
    sliceHeading: 'The First Slice for Bhavana 🍰',
    sliceMessage: 'Sweet strawberry-rose sponge, baked with all my love.\nMay every year ahead be even sweeter than the last ♡',
    biteButton: 'Take a bite together ♡ 🍴',
    bittenMessage: 'Mmm, delicious! Sweetest birthday slice for the sweetest girl ♡',
    relightButton: 'Make another wish 🕯️',
  },

  /* ---------- Screen 6: love garden ---------- */
  garden: {
    title: 'A garden of birthday notes',
    subtitle: 'Each glowing bloom holds a sweet little thought just for you.',
    notes: [
      'You deserve all the magic life has to offer.',
      'Happy Birthday to the girl who stole my heart.',
      'Your laugh is my favorite sound in the world.',
      'I hope this year brings you as much joy as you give me.',
      'You are so much more wonderful than you realize.',
      'Thank you for being the sweetest girlfriend in the world. Happy Birthday, Bhavana ♡',
    ],
  },

  /* ---------- Screen 7: music ---------- */
  music: {
    /** Put an mp3 in /public/music and write its path, e.g. '/music/our-song.mp3'.
     *  Leave empty for a visual-only experience. Music never autoplays. */
    src: './music/Naine_Ra_Lobhi.mp3',
    title: 'Naine Ra Lobhi',
    artist: 'Vikash & Bhavana',
    caption: 'Our song. Some feelings sound better than they read.',
  },

  /* ---------- Screen 8: the final surprise ---------- */
  finale: {
    lines: ['After all the words…', 'All the wishes and little moments…'],
    headline: 'MY FAVORITE PART OF THIS WORLD IS YOU.',
    promise:
      'Every morning, every quiet night, and every birthday to come, you will always have all my love.',
    surpriseButton: 'One last surprise ♡',
    finalMessage:
      'Happy Birthday, Bhavana ♡\n\nYou are my sweetest reality and my favorite reason to smile. Endlessly grateful to walk this journey beside you.\n\nHere’s to another beautiful year of laughing together and loving you more each day.',
    hugButton: 'Receive your birthday hug ♡',
    hugMessage: 'The warmest birthday hug, wrapped in all my love. Happy Birthday, Bhavana! ♡',
  },
}
