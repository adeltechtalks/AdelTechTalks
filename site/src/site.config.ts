/* =============================================================================
   YOUR SITE'S CONTENT — edit this file, nothing else.
   Everything below is plain text between quote marks. Change the words, keep
   the quotes, commas and brackets exactly where they are.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   BRAND ARCHITECTURE (§5)
   -----------------------------------------------------------------------------
   Adel          the person, and the identity of this website
   AdelTechTalks the content / show identity — the channel, the socials, the
                 Playground badges. Still visible, no longer dominant.
   GearNest      a separate business. Linked from here, never merged into here.
   -------------------------------------------------------------------------- */
export const site = {
  /* The primary brand. This is a personal website. */
  name: 'Adel',
  /* The content identity. Used where the CHANNEL is being named, not the person. */
  showName: 'AdelTechTalks',
  /* Shown in the browser tab and in Google results */
  tagline: 'Product Manager · AI Enthusiast · Builder',
  /* One or two sentences. Used for social sharing when a page has none. */
  description:
    'Adel is a Product Manager and AI enthusiast. He learns it, tests it, builds with it, and shares what actually worked.',
  descriptionAr:
    'عادل — Product Manager ومهتم بالـAI. يتعلّمها، يجرّبها، يبني بها، ويشارك ما نفع فعلاً.',
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
   NAVIGATION (§24)
   -----------------------------------------------------------------------------
   Data-driven on purpose. Adding Podcast, Services, Resume or the Prompt
   Library later is one line here plus a route — no redesign, no component edit.
   `phase: 1` shows in the header. Anything higher is defined but not rendered,
   so the shape of the future navigation is already decided and visible.
   -------------------------------------------------------------------------- */
export const nav: Array<{ key: string; path: string; phase: number }> = [
  { key: 'guides', path: '/guides', phase: 1 },
  { key: 'topics', path: '/topics', phase: 1 },
  { key: 'about', path: '/about', phase: 1 },
  { key: 'newsletter', path: '/newsletter', phase: 1 },
  { key: 'playground', path: '/playground', phase: 1 },
  /* ---- prepared, not yet routed (§22, §24) ---- */
  { key: 'prompts', path: '/prompts', phase: 2 },
  { key: 'projects', path: '/projects', phase: 2 },
  { key: 'podcast', path: '/podcast', phase: 3 },
  { key: 'services', path: '/services', phase: 3 },
  { key: 'resume', path: '/resume', phase: 3 },
];

/* -----------------------------------------------------------------------------
   TOPICS (§14 "What I Explore")
   -----------------------------------------------------------------------------
   The six threads. `id` is the URL segment and the value a guide puts in its
   `topic:` field, so renaming one means adding a redirect — rename with care.
   `icon` is any Lucide icon name: https://lucide.dev/icons
   -------------------------------------------------------------------------- */
export const topics = [
  {
    id: 'ai',
    icon: 'sparkles',
    en: { name: 'AI', body: 'Models, agents and the tools built on them — tested on real work, not demos.' },
    ar: { name: 'الـ[[AI]]', body: 'النماذج والـ[[agents]] والأدوات المبنية عليها — مُجرَّبة على عمل حقيقي لا على عروض.' },
  },
  {
    id: 'automation',
    icon: 'workflow',
    en: { name: 'Automation', body: 'Workflows that remove real work, built end to end and handed over.' },
    ar: { name: '[[Automation]]', body: '[[workflows]] تزيل عملاً حقيقياً، مبنية من أولها إلى آخرها.' },
  },
  {
    id: 'product',
    icon: 'compass',
    en: { name: 'Product', body: 'How things get decided, prioritised and shipped when it is your name on it.' },
    ar: { name: '[[Product]]', body: 'كيف تُتَّخذ القرارات وتُرتَّب الأولويات ويُشحن المنتج حين يكون اسمك عليه.' },
  },
  {
    id: 'tech',
    icon: 'cpu',
    en: { name: 'Tech', body: 'The hardware and software I actually live with, and what survives a working month.' },
    ar: { name: 'الـ[[Tech]]', body: 'العتاد والبرمجيات التي أعيش معها فعلاً، وما يصمد منها بعد شهر عمل.' },
  },
  {
    id: 'building',
    icon: 'hammer',
    en: { name: 'Building', body: 'Making the thing. The parts that worked, and the parts I had to throw away.' },
    ar: { name: 'البناء', body: 'صناعة الشيء نفسه. ما نجح منه، وما اضطررت إلى رميه.' },
  },
  {
    id: 'creator-tech',
    icon: 'clapperboard',
    en: { name: 'Creator Technology', body: 'Cameras, audio, lighting and the workflow behind everything published here.' },
    ar: { name: '[[Creator Technology]]', body: 'الكاميرات والصوت والإضاءة وسير العمل خلف كل ما يُنشر هنا.' },
  },
];

export type TopicId = (typeof topics)[number]['id'];

/* -----------------------------------------------------------------------------
   WHAT I'M BUILDING (§14)
   -----------------------------------------------------------------------------
   A list, not a GearNest special case — add a second project and the section
   grows on its own. `separate: true` marks a project with its own brand, which
   is rendered with visible distance from Adel's identity (§5).
   -------------------------------------------------------------------------- */
export const projects = [
  {
    id: 'gearnest',
    url: 'https://gearnest.com',
    separate: true,
    status: 'building' as 'building' | 'live' | 'exploring',
    en: {
      name: 'GearNest',
      body: 'A separate brand and business of its own — its own product, voice and roadmap.',
    },
    ar: {
      name: '[[GearNest]]',
      body: 'علامة ومشروع مستقل بذاته — بمنتجه وصوته وخارطة طريقه.',
    },
  },
];

/* -----------------------------------------------------------------------------
   PHOTOGRAPHY (§15)
   -----------------------------------------------------------------------------
   Real photographs of Adel only. Drop the files into site/public/photos/ and
   put the filename here. Leave a value EMPTY and the site renders the designed
   placeholder instead — that is intentional, and it is far better than a
   generated or stock image standing in for a real person.
   -------------------------------------------------------------------------- */
export const photography = {
  /* Portrait for the homepage hero. Portrait crop, ideally 3:4, at least 1200px tall. */
  heroPortrait: '',
  heroPortraitMobile: '', /* optional square/4:5 crop; falls back to heroPortrait */
  /* Wider environmental shot for the About page. 3:2 or 16:9. */
  aboutPhoto: '',
  /* Adel's real handwritten signature as an SVG or transparent PNG. */
  signature: '',
};

/* -----------------------------------------------------------------------------
   HOMEPAGE HERO — the words live in src/copy.ts (English and Arabic together).
   The portrait lives in `photography` above.
   -------------------------------------------------------------------------- */

/* -----------------------------------------------------------------------------
   LEGACY · ATT CONTENT PILLARS (§7, §25 "ATT Legacy")
   -----------------------------------------------------------------------------
   The five AdelTechTalks pillars. Superseded on the personal site by `topics`
   above, and KEPT because the Playground tracks and the published guide
   frontmatter still reference them, and because they remain the correct
   taxonomy for AdelTechTalks content.
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
   `topic` must be one of the ids in `topics` above.
   -------------------------------------------------------------------------- */
export const videos: Array<{ id: string; title: string; topic: string; meta: string; date?: string }> = [
  /* ⚠️ PLACEHOLDERS — three real YouTube IDs replace these. Until then the
     homepage renders the designed empty state rather than three dead embeds. */
];

/* -----------------------------------------------------------------------------
   ABOUT PAGE
   -----------------------------------------------------------------------------
   ⚠️ The paragraphs marked PLACEHOLDER are the only invented text on the site.
   They are Adel's own story and cannot be written for him. Replace them and the
   page is finished — nothing else about it needs to change.
   -------------------------------------------------------------------------- */
export const about = {
  en: {
    title: 'I learn it, I test it, I build with it, and I share it.',
    /* Each line below becomes its own paragraph */
    body: [
      'PLACEHOLDER — who you are and where you are based, in your own words. Two or three sentences is plenty.',
      'PLACEHOLDER — how you got into product and into AI, and what keeps you there.',
      'PLACEHOLDER — what you are working on now, and where you are going next.',
    ],
    values: [
      { title: 'Curious first', body: 'I open the thing and find out, rather than reading the spec sheet.' },
      { title: 'Honest about limits', body: 'A claim, then the cost of the claim. If it is not worth it, I say so.' },
      { title: 'Practical', body: 'Everything I publish should let you do something, not only read about it.' },
      { title: 'Still learning', body: 'I would rather be corrected than be consistent. Being wrong in public is the fastest way to learn.' },
    ],
    /* §13 — professional context, used as credibility. Not an employee profile,
       and not an endorsement. Leave `employer` empty to hide this entirely. */
    context: {
      role: 'Product Manager',
      employer: 'Amazon',
      note: 'Professional context only. Everything on this site is written in a personal capacity and represents my own views, not my employer’s.',
    },
  },
  ar: {
    title: 'أتعلّمها، أجرّبها، أبني بها، وأشاركها.',
    body: [
      'PLACEHOLDER — من أنت وأين تقيم، بكلماتك أنت. جملتان أو ثلاث تكفي.',
      'PLACEHOLDER — كيف دخلت مجال الـProduct والـAI، وما الذي يبقيك فيه.',
      'PLACEHOLDER — على ماذا تعمل الآن، وإلى أين تتجه.',
    ],
    values: [
      { title: 'الفضول أولاً', body: 'أفتح الشيء وأكتشفه بنفسي بدل أن أقرأ ورقة المواصفات.' },
      { title: 'صريح في الحدود', body: 'الميزة، ثم ثمنها. وإن لم تكن تستحق، أقولها.' },
      { title: 'عملي', body: 'كل ما أنشره يجب أن يمكّنك من فعل شيء، لا أن تقرأ عنه فقط.' },
      { title: 'ما زلت أتعلّم', body: 'أفضّل أن يُصحَّح لي على أن أبقى متسقاً. الخطأ أمام الناس أسرع طريق للتعلّم.' },
    ],
    context: {
      role: '[[Product Manager]]',
      employer: '[[Amazon]]',
      note: 'سياق مهني فقط. كل ما في هذا الموقع مكتوب بصفة شخصية ويمثّل رأيي وحدي، لا رأي جهة عملي.',
    },
  },
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
