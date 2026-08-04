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
   PLAYGROUND — the learn-and-earn-badges section
   Each entry becomes a lesson people can complete to earn a badge.
   -------------------------------------------------------------------------- */
export const playground = {
  intro:
    'Every time I publish a product or an AI tool, I add a short hands-on track here. Work through it, run the thing yourself, and keep the badge.',
  tracks: [
    {
      slug: 'first-workflow',
      name: 'Build your first workflow',
      pillar: 'automation',
      badge: 'Automator',
      minutes: 20,
      body: 'Connect two apps and have something running before the explanation ends.',
      steps: ['Create your account', 'Connect the trigger', 'Add the action', 'Run it once', 'Ship it'],
    },
    {
      slug: 'prompting-for-work',
      name: 'Prompting for real work',
      pillar: 'ai',
      badge: 'Prompt Crafter',
      minutes: 15,
      body: 'Five prompts I actually use, and why each one is shaped that way.',
      steps: ['Set the role', 'Give it the material', 'Ask for the shape', 'Push back once', 'Save the good one'],
    },
    {
      slug: 'test-like-a-reviewer',
      name: 'Test a product like a reviewer',
      pillar: 'gadgets',
      badge: 'Field Tester',
      minutes: 25,
      body: 'The method I use for every review, so you can judge a product yourself.',
      steps: ['Define the job', 'Set the conditions', 'Run the week', 'Log what broke', 'Write the verdict'],
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
  supabaseUrl: '',
  supabaseAnonKey: '',
};
