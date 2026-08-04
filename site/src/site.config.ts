/* =============================================================================
   YOUR SITE'S CONTENT — edit this file, nothing else.
   Everything below is plain text between quote marks. Change the words, keep
   the quotes, commas and brackets exactly where they are.
   ============================================================================= */

export const site = {
  name: 'AdelTechTalks',
  /* Shown in the browser tab and in Google results */
  tagline: 'Discover the AI Behind Everything',
  /* One or two sentences. Used on the homepage and for social sharing. */
  description:
    'Adel is an AI and technology explorer based in the United States, discovering and testing the intelligence behind the products, tools and innovations shaping our world.',
  /* CHANGE ME once your domain is connected */
  url: 'https://adeltechtalks.com',
  email: 'hello@adeltechtalks.com',
  /* Delete any line you do not use */
  social: {
    youtube: 'https://youtube.com/@adeltechtalks',
    instagram: 'https://instagram.com/adeltechtalks',
    tiktok: 'https://tiktok.com/@adeltechtalks',
    linkedin: 'https://linkedin.com/in/adeltechtalks',
    x: 'https://x.com/adeltechtalks',
  },
};

/* -----------------------------------------------------------------------------
   HOMEPAGE HERO
   -------------------------------------------------------------------------- */
export const hero = {
  overline: 'AI & Technology Explorer',
  /* Keep this short — it is the biggest text on the page */
  title: 'Discover the AI Behind Everything',
  body:
    "I test the AI inside real products — phones, cameras, cars, homes, tools — and show you what actually works. Not demos. Not spec sheets. Real weeks of real use.",
  /* The one coral button on the page. Your design system allows exactly one. */
  primaryCta: { label: 'Watch the latest', href: '#videos' },
  secondaryCta: { label: 'Read the guides', href: '/guides' },
};

/* -----------------------------------------------------------------------------
   CONTENT PILLARS — the kinds of content you make
   `icon` must be a Lucide icon name: https://lucide.dev/icons
   `pillar` sets the colour and must be one of:
   ai · gadgets · automation · enterprise · creator
   -------------------------------------------------------------------------- */
export const pillars = [
  { id: 'ai', name: 'AI Tools', icon: 'sparkles', body: 'The tools I actually use, tested on real work — not demos.' },
  { id: 'gadgets', name: 'Products & Gadgets', icon: 'smartphone', body: 'Tested, not unboxed. What survives a working week.' },
  { id: 'automation', name: 'Automation', icon: 'workflow', body: 'Workflows that remove real work, built start to finish.' },
  { id: 'enterprise', name: 'Enterprise AI', icon: 'building-2', body: 'What AI looks like inside a business that has to ship.' },
  { id: 'creator', name: 'Creator Tech', icon: 'clapperboard', body: 'Cameras, audio, lighting and the workflow behind the videos.' },
];

/* -----------------------------------------------------------------------------
   FEATURED VIDEOS
   To add one: copy a YouTube video's ID from its link.
   https://www.youtube.com/watch?v=dQw4w9WgXcQ  →  id: 'dQw4w9WgXcQ'
   -------------------------------------------------------------------------- */
export const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Replace this with a real video', pillar: 'ai', meta: 'PLACEHOLDER' },
  { id: 'dQw4w9WgXcQ', title: 'Replace this with a real video', pillar: 'gadgets', meta: 'PLACEHOLDER' },
  { id: 'dQw4w9WgXcQ', title: 'Replace this with a real video', pillar: 'automation', meta: 'PLACEHOLDER' },
];

/* -----------------------------------------------------------------------------
   ABOUT PAGE
   -------------------------------------------------------------------------- */
export const about = {
  title: 'I am on a journey to discover the AI behind everything.',
  /* Each line in the list below becomes its own paragraph */
  body: [
    'PLACEHOLDER — replace with your own story. Who you are, where you are based, and why you started AdelTechTalks.',
    'PLACEHOLDER — what you test, how you test it, and what makes your reviews different. The brand voice is: state the benefit, then the honest limit.',
    'PLACEHOLDER — where you are going next.',
  ],
  values: [
    { title: 'Curious', body: 'I open the thing and find out, rather than reading the spec sheet.' },
    { title: 'Honest', body: 'A claim, then the cost of the claim. If it is not worth it, I say so.' },
    { title: 'Practical', body: 'Every video should let you do something, not only read about it.' },
    { title: 'Explorer', body: 'I go to the airport, the store, the car, the factory. Tech lives out there.' },
  ],
};

/* -----------------------------------------------------------------------------
   WORK WITH ME — your brand partnership packages
   Taken from your Playbook. No prices, per your decision — you quote per deal.
   -------------------------------------------------------------------------- */
export const packages = [
  {
    name: 'AI Discovery',
    bestFor: 'A new AI product that nobody has explained clearly yet.',
    deliverables: ['1 long-form video', '2 Reels / Shorts', '1 carousel', 'Usage rights 6 months'],
    timeline: '3 weeks',
  },
  {
    name: 'AI Experience',
    bestFor: 'Hardware or a space that has to be seen in the real world.',
    deliverables: ['1 on-location video', '3 Reels / Shorts', 'Stories set', 'Usage rights 6 months'],
    timeline: '3–4 weeks',
  },
  {
    name: 'AI Launch',
    bestFor: 'A launch date with a hard embargo.',
    deliverables: ['Launch-day video', '3 Reels / Shorts', 'Carousel', 'Story sequence', 'Priority scheduling'],
    timeline: '2 weeks',
  },
  {
    name: 'AI Tested',
    bestFor: 'A product confident enough to be tested honestly over time.',
    deliverables: ['30-day test video', '2 Reels / Shorts', 'Written verdict', 'Usage rights 12 months'],
    timeline: '5–6 weeks',
  },
  {
    name: 'Buying Guide',
    bestFor: 'Category placement, seasonal and gift-guide moments.',
    deliverables: ['Inclusion in a category guide', '1 Reel', 'Carousel', 'Affiliate linking'],
    timeline: '2 weeks',
  },
  {
    name: 'UGC',
    bestFor: 'Footage you run on your own channels and paid media.',
    deliverables: ['3 vertical videos', 'Raw + edited files', 'No posting on my channels', 'Paid usage negotiable'],
    timeline: '2 weeks',
  },
  {
    name: 'AI Education',
    bestFor: 'A tool with a learning curve that costs you signups.',
    deliverables: ['Tutorial video', 'Cheat sheet', 'Carousel', 'Newsletter feature'],
    timeline: '3 weeks',
  },
  {
    name: 'Enterprise AI',
    bestFor: 'B2B and CRM products aimed at teams, not consumers.',
    deliverables: ['Explainer video', 'LinkedIn cutdown', 'Case-study carousel', 'Usage rights 12 months'],
    timeline: '4 weeks',
  },
  {
    name: 'Brand Ambassador',
    bestFor: 'An ongoing relationship rather than one drop.',
    deliverables: ['Monthly content package', 'Event coverage', 'Category exclusivity', 'Custom terms'],
    timeline: '3–12 months',
  },
];

/* The honesty clause shown under the packages. This is part of the brand. */
export const partnershipNote =
  'Every partnership is disclosed. I test before I talk, and I keep editorial control of the verdict — a paid placement buys the coverage, never the conclusion. If the product does not hold up, I will tell you before it goes out and we agree what happens next.';

/* -----------------------------------------------------------------------------
   PLAYGROUND — the interactive game
   =================================

   THIS IS WHAT YOU AUTHOR FOR EVERY VIDEO.

   A game is a list of ROUNDS. Each round is a different kind of interaction,
   so it plays like a game rather than a form. Mix them up.

   ── ROUND TYPES ──────────────────────────────────────────────────────────

   { type: 'sequence' }   Tap the steps in the right order.
       q      the instruction
       items  the steps IN THE CORRECT ORDER (shown shuffled to the player)
       why    what they learn

   { type: 'estimate' }   Drag a slider to guess a number, then see the truth.
       q         the question
       min, max  slider range
       unit      '%', 'mm', 'fps' …
       answer    the real value
       tolerance how close counts as right
       why       the explanation — put the real number in context here

   { type: 'hotspot' }    Tap the place on an image where something happens.
       q       the instruction
       image   put the file in public/games/ and write '/games/your-shot.jpg'
       target  { x, y, r } as PERCENTAGES of the image, r = radius
       why     what they learn
       (no image yet? the round still works — it shows a labelled grid instead)

   { type: 'choice' }     Classic question with options.
       q, options, answer (position of the correct one, starting at 0), why

   ⚠️ Only write rounds you know the real answer to. A wrong "correct" answer
   about a product is worse than no game.
   -------------------------------------------------------------------------- */
export const playground = {
  intro:
    'Every video gets a short game here. Play it, prove you picked it up, and keep a badge you can post.',
  tracks: [
    {
      slug: 'ai-in-your-camera',
      name: 'The AI inside your camera',
      product: 'Camera AI features',
      pillar: 'gadgets',
      badge: 'Field Tester',
      minutes: 3,
      body: 'What the AI in a modern camera is actually doing when it tracks, focuses and stabilises.',
      video: '',
      pass: 3,
      /* ⚠️ EXAMPLE ROUNDS — these cover general camera-AI behaviour, which is
         safely true. Replace them with rounds about YOUR product from YOUR video. */
      rounds: [
        {
          type: 'sequence',
          q: 'Tap these in the order the camera actually does them when it tracks a subject.',
          items: [
            'Detect — find candidate subjects in the frame',
            'Choose — pick which one to lock onto',
            'Predict — estimate where it will be next',
            'Move — shift the focus point ahead of it',
          ],
          why: 'Tracking is a loop, and prediction is the part people miss. The camera is not following the subject, it is guessing ahead of it — which is why it holds on something moving steadily toward you and loses something that changes direction sharply.',
        },
        {
          type: 'estimate',
          q: 'Turning on electronic stabilisation crops into the frame. Roughly how much of the width do you lose?',
          min: 0,
          max: 40,
          unit: '%',
          answer: 10,
          tolerance: 6,
          why: 'Around 10% is typical. Electronic stabilisation shifts the image inside a larger sensor readout, so it needs spare frame to move within. That is the trade: steadier footage, narrower shot. It is why your wide angle stops feeling wide the moment you switch it on.',
        },
        {
          type: 'hotspot',
          q: 'Tap where the camera places its focus point on a moving subject.',
          image: '',
          target: { x: 50, y: 38, r: 18 },
          hint: 'Think about where the subject is going, not where it is.',
          why: 'It leads the subject rather than sitting on it. The focus point sits slightly ahead along the direction of travel, because by the time the frame is captured the subject has already moved.',
        },
        {
          type: 'choice',
          q: 'Why does scene detection sometimes make a photo look worse?',
          options: [
            'It applies a preset for the scene it thinks it sees, and it can guess wrong',
            'It lowers the resolution to process faster',
            'It disables the lens stabiliser',
          ],
          answer: 0,
          why: 'Scene detection classifies what it sees and applies a matching treatment — more saturation for "food", cooler tones for "snow". When it misreads the scene you get the wrong treatment, which is exactly why results look off in the situations that confuse it.',
        },
        {
          type: 'choice',
          q: 'What is the only honest way to test any of this for yourself?',
          options: [
            'Compare the spec sheets',
            'Shoot the same scene twice, once with the feature on and once off',
            'Read three reviews and average them',
          ],
          answer: 1,
          why: 'A controlled A/B is the only test that tells you what the feature does for you rather than what the marketing says. Same scene, same light, one variable. That is the method behind every review on this channel.',
        },
      ],
    },
  ],
};

/* -----------------------------------------------------------------------------
   SERVICE KEYS — Phase 2. Leave blank until you create the accounts.
   Instructions are in LAUNCH.md.
   -------------------------------------------------------------------------- */
export const services = {
  /* Formspree — the brand enquiry form. Paste your form ID, e.g. 'xayzbwqd' */
  formspreeId: '',
  /* Your newsletter provider's form action URL (Kit, Beehiiv, Buttondown…) */
  newsletterAction: '',
  /* Supabase — Google sign-in and badges. Both come from your Supabase project. */
  supabaseUrl: 'https://esdpzznuatlouxjekqoj.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZHB6em51YXRsb3V4amVrcW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjY3NjYsImV4cCI6MjEwMDc0Mjc2Nn0.l2AiL81uWgWg8t_322Qmaij_zzAPB4LnF6JI9B0_Pkg',
};
