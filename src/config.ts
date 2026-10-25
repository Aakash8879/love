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
    // When locked and countdown is not complete:
    lockedTitle: 'Shh... something magical is brewing for you ✨',
    lockedSubtitle: 'Vikash is preparing a little universe with all of our sweetest memories. Be a good girl and wait until your special day ♡',
    lockedButton: 'Locked with love until your birthday 🔒',

    // When countdown is complete (unlocked):
    title: 'Happy Birthday, my prettiest girl.',
    subtitle: 'The wait is finally over. Your little universe is ready... take my hand ♡',
    button: 'Open your surprise ♡',

    /** The exact birthday date & time (YYYY-MM-DDTHH:mm:ss). */
    targetDate: '2026-11-02T00:00:00',
    countdownBadge: "Counting down to Bhavana's special day",
    birthdayArrivedBadge: "🎉 HAPPY BIRTHDAY, BHAVANA! 🎂✨",
  },

  /* ---------- Screen 2: her name ---------- */
  intro: {
    greeting: 'Happy Birthday to my favorite human,',
    headlineLines: ['You are my sweetest reality,', 'and my happiest home.'],
    support: 'Out of 8 billion people on this planet, my heart found its home in the prettiest girl.',
  },

  /* ---------- Screen 3: the letter ---------- */
  letter: {
    title: 'A birthday letter from my heart',
    intro: 'Written with all my love, just for you.',
    greeting: 'My Sweetest Bhavana,',
    paragraphs: [
      'Happy Birthday, my love. Another beautiful year of you making this world softer, warmer, and so much sweeter just by being in it.',
      'I love everything about you—from your cute little pout and adorable laughs to the radiant way your eyes sparkle when you are genuinely happy. If I could give you any superpower today, it would be the power to see yourself through my eyes, so you would finally understand how precious, irreplaceable, and deeply loved you truly are.',
      'Thank you for being my comfort, my favorite person, and my whole universe. I promise to keep loving you, giving you the warmest hugs, and choosing you in every single birthday we have yet to share.',
    ],
    closing: 'Forever and always your boy,',
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
        note: 'Prettiest girl in the universe ♡',
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
        note: 'The cutest girl in the world ♡',
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
        note: 'Always been my sweetest soul ♡',
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
      'The cute way you scrunch your nose and laugh at my silly jokes.',
      'How adorable you looked with your teddy bear headband during our late-night calls.',
      'The way hours feel like seconds whenever I am talking to you.',
      'How radiant and pretty you looked holding sparklers on Diwali night.',
      'Riding horses together through the misty mountain trails, holding on tight.',
      'How safe, peaceful, and warm my heart feels whenever you are near.',
      'Your sleepy morning voice that instantly melts my heart.',
      'Standing beside you under festive lights where you outshone every star in the city.',
      'The little girl with her plate of sweets who grew up to become my entire world.',
      'The sweet way you say my name that turns any bad day into a good one.',
      'How effortlessly beautiful you are, even when you have no idea.',
      'Because loving you is the easiest, most natural thing my heart has ever done.',
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
      'May all your silent wishes, cute dreams, and sweetest prayers come true.\nYou deserve all the love, happiness, and magic in the universe.',
    cutInstruction: 'Tap the golden knife to cut your birthday slice together ♡',
    cutButton: 'Cut Birthday Cake 🎂✨',
    sliceHeading: 'The First Slice for Bhavana 🍰',
    sliceMessage: 'Sweet strawberry-rose heart sponge, baked with infinite love.\nA sweet slice for the sweetest soul in my world ♡',
    biteButton: 'Take a bite together ♡ 🍴',
    bittenMessage: 'Mmm, delicious! Save a little frosting for my nose too ♡ 🎂',
    relightButton: 'Make another wish 🕯️',
  },

  /* ---------- Screen 6: love garden ---------- */
  garden: {
    title: 'A garden of birthday notes',
    subtitle: 'Each glowing bloom holds a sweet little thought just for you.',
    notes: [
      'You are the prettiest thought in my head all day.',
      'Happy Birthday to the girl who stole my heart and made it home.',
      'Your cute laugh is my favorite song in the whole universe.',
      'I hope this year brings you as much happiness as you give to me every day.',
      'You are so much more special and loved than you will ever know.',
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
      'Happy Birthday, my sweet Bhavana ♡\n\nYou are my sweetest reality, my greatest comfort, and my favorite reason to smile. I am endlessly grateful to walk this journey holding your hand.\n\nHere’s to another beautiful year of laughing at silly things, sharing late-night talks, and loving you more with every single heartbeat.',
    hugButton: 'Receive your birthday hug ♡',
    hugMessage: 'The warmest, tightest birthday hug, wrapped in all my love. Happy Birthday, my whole universe! ♡',
  },
}
