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
  /* The site's default title is `showName — tagline`, so this is the second
     half of "AdelTechTalks — I ❤️ Tech": the master brand expression, and the
     only thing a reader should meet first in a browser tab, a search result or
     a shared link.

     What it REPLACED was "Product Manager · AI Enthusiast · Builder". That
     line is a professional positioning, and a professional positioning is not
     what this site leads with — it is credibility context, it belongs in the
     About page's professional module, and it is barred from global SEO and
     social metadata. Neither the role nor the employer appears in this block,
     and neither may be added to it.

     "I ❤️ Tech" is a frozen brand name: it is never translated or
     transliterated, so the Arabic pages carry the identical title. */
  tagline: 'I ❤️ Tech',
  /* One or two sentences. Used for social sharing when a page has none. */
  description:
    'Vibe Coding, Gear, prompts, use cases, and the tech I’m building, testing, and learning with.',
  /* NOT a translation of the line above, and deliberately not a new sentence
     written for this field either — ARABIC_VOICE_GUIDE.md is explicit that
     Arabic copy is pulled from the approved authored source and never
     generated, derived or MSA-corrected.

     So this is the authored Arabic umbrella line from the design of record
     (Website Structure v2, frame 2c, the footer): the one approved sentence
     that says what the whole site is for. It reads as its own sentence in
     Arabic rather than as an English list rendered in Arabic words. */
  descriptionAr: 'إزاي بستخدم التكنولوجيا عشان أبني وأبدع وأشتغل أذكى.',
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
  /* IA v2.0 (frozen): Vibe Coding · Gear · Learn · Playground · About, with
     Subscribe rendered separately as the one filled pill.

     The order is the frozen one and is used in three places from this single
     list — the header, the mobile menu and the footer's Explore column — so
     the three can never drift apart.

     Vibe Coding and Gear are the two content pillars: building with AI, and
     using/testing technology. Everything else routed in Phase 1.1 is still
     live at exactly the URL it had; those routes simply reach the reader
     through /learn and the footer rather than competing for a header slot. */
  { key: 'vibeCoding', path: '/vibe-coding', phase: 1 },
  { key: 'gear', path: '/gear', phase: 1 },
  { key: 'learn', path: '/learn', phase: 1 },
  { key: 'playground', path: '/playground', phase: 1 },
  { key: 'about', path: '/about', phase: 1 },
  /* Rendered as the Subscribe pill by the header, not as a plain nav link. */
  { key: 'newsletter', path: '/newsletter', phase: 1.2 },
  /* The Phase 1.1 series page keeps its URL and its readers; /vibe-coding is
     the pillar hub that now carries the nav slot. */
  { key: 'series', path: '/series/vibe-coding', phase: 1.5 },
  /* ---- routed and live, surfaced through /learn rather than the header ---- */
  { key: 'guides', path: '/guides', phase: 1.5 },
  { key: 'useCases', path: '/use-cases', phase: 1.5 },
  { key: 'videos', path: '/videos', phase: 1.5 },
  { key: 'prompts', path: '/prompts', phase: 1.5 },
  { key: 'topics', path: '/topics', phase: 1.5 },
  /* ---- prepared, not yet routed (§22, §24) ---- */
  { key: 'courses', path: '/courses', phase: 2 },
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
   SERIES (Phase 1.1)
   -----------------------------------------------------------------------------
   A Series is a build narrative told over time: one question, asked in public,
   answered across guides, use cases, videos and prompts.

   Vibe Coding is the CURRENT flagship series. It is not a rebrand — the master
   personal-brand expression is still "I ❤️ Tech" (see LOVE_TECH in copy.ts),
   and Vibe Coding sits underneath it as the thing being built right now. When
   the next series starts, it is added here and this one keeps its URL, its
   archive and its readers.

   `question` is the framing the whole series answers. It is a real question,
   asked honestly — the series is the attempt, not the victory lap.
   -------------------------------------------------------------------------- */
export const series = [
  {
    id: 'vibe-coding',
    icon: 'terminal',
    /* 'running' — publishing now. 'archived' — finished, still readable. */
    status: 'running' as 'running' | 'archived',
    /* The topic each series entry falls under when it does not declare one. */
    defaultTopic: 'building' as TopicId,
    /* The case study that carries the answer, if there is one. */
    caseStudy: 'gearnest',
    en: {
      name: 'Vibe Coding',
      question: 'Can I build a real business with Vibe Coding?',
      body:
        'Building software by describing what you want, in plain language, and shipping what comes back. I am doing it in the open — the parts that worked, the parts that cost me a weekend, and the bill at the end.',
      /* What a reader gets by following it. No outcome is promised, because the
         question has not been answered yet. */
      promise:
        'Every step is published as it happens: the guide, the prompts I used, the screen recording, and the decision I got wrong.',
    },
    ar: {
      name: '[[Vibe Coding]]',
      question: 'هل أستطيع بناء مشروع حقيقي بالـ[[Vibe Coding]]؟',
      body:
        'بناء البرمجيات بوصف ما تريده بلغة عادية، ثم شحن ما يعود إليك. أفعلها أمام الناس — ما نجح، وما كلّفني نهاية أسبوع كاملة، والفاتورة في آخر الشهر.',
      promise:
        'كل خطوة تُنشر وقت حدوثها: الدليل، والـ[[prompts]] التي استخدمتها، وتسجيل الشاشة، والقرار الذي أخطأت فيه.',
    },
  },
];

export type SeriesId = (typeof series)[number]['id'];

/* -----------------------------------------------------------------------------
   THE ECOSYSTEM (Phase 1.1) — what /learn is an index of
   -----------------------------------------------------------------------------
   One list, one source of truth. The Learn Hub renders this in order, and a
   surface's `status` decides how it is rendered:

     'live'     routed, linked, indexed
     'building' named and honestly marked, NOT linked — there is no route to
                send anybody to, and a link to an empty product is worse than
                no link (§22). Interest goes to the newsletter instead.

   Turning Courses on later is: build the route, change 'building' to 'live'.
   Nothing else on this page changes.
   -------------------------------------------------------------------------- */
export const ecosystem: Array<{
  key: string;
  path: string | null;
  icon: string;
  status: 'live' | 'building';
}> = [
  { key: 'guides', path: '/guides', icon: 'book-open', status: 'live' },
  { key: 'useCases', path: '/use-cases', icon: 'target', status: 'live' },
  { key: 'videos', path: '/videos', icon: 'clapperboard', status: 'live' },
  { key: 'prompts', path: '/prompts', icon: 'library', status: 'live' },
  { key: 'topics', path: '/topics', icon: 'compass', status: 'live' },
  { key: 'playground', path: '/playground', icon: 'gamepad-2', status: 'live' },
  /* §22 — defined, deliberately not routed. Do not give this a path until the
     course experience itself is finished. */
  { key: 'courses', path: null, icon: 'graduation-cap', status: 'building' },
];

/* -----------------------------------------------------------------------------
   MONETISATION (Phase 1.1 — architecture only, nothing switched on)
   -----------------------------------------------------------------------------
   Phase 1.1 does NOT build billing, credits, checkout or entitlements. What it
   does is make sure the content model has somewhere to put a price when there
   is one, so adding paid Courses later is not a schema migration across every
   collection.

   `enabled: false` is enforced in code: `isPurchasable()` in lib/commerce.ts
   returns false while it is false, so no price, no button and no checkout can
   render even if an entry declares one by mistake.
   -------------------------------------------------------------------------- */
export const commerce = {
  enabled: false,
  /* Set when a real processor exists. Nothing reads this while disabled. */
  provider: '' as '' | 'stripe' | 'lemonsqueezy' | 'gumroad',
  currency: 'USD',
  /* Free content stays free. This only ever gates entries that opt in with an
     `access: 'paid'` field, and today nothing does. */
  defaultAccess: 'free' as 'free' | 'paid',
};

/* -----------------------------------------------------------------------------
   RETRIEVAL (Phase 1.1 — architecture only, no AI)
   -----------------------------------------------------------------------------
   "Ask Adel" is a later phase. What it will need is a clean, language-aware,
   chunk-sized index of everything published — and that is a build artefact, not
   a product. /ask-index.json is generated at build time from the same content
   the pages render, so it can never drift from the site.

   No model is called, no embedding is computed and no user input is accepted
   anywhere in this phase.
   -------------------------------------------------------------------------- */
export const retrieval = {
  /* Emit /ask-index.json. Harmless while nothing consumes it. */
  buildIndex: true,
  /* Longest body excerpt carried per entry, in characters. Keeps the artefact
     small enough to serve from the CDN and large enough to be useful later. */
  excerptChars: 600,
};

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
    /* Canonical GearNest domain. Every GearNest link on this site resolves
       from here — the homepage band, the series page's case-study panel and
       the footer's separate-brands row all read `projects[].url`, so the
       domain is set once. The case study's own `external.href` in
       src/content/use-cases/ is the only other place it appears, because that
       one belongs to the content rather than to this config. */
    url: 'https://gearnest.ai',
    separate: true,
    status: 'building' as 'building' | 'live' | 'exploring',
    /* Phase 1.1 — GearNest is the first real-world case study for the Vibe
       Coding series. It is the thing the series question is being tested on.
       This does NOT merge GearNest into Adel's identity (§5): it is still its
       own brand and it is still rendered with visible distance. The series
       links to the case study, and the case study links out to the business. */
    series: 'vibe-coding' as SeriesId,
    caseStudy: 'gearnest',
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
/* =============================================================================
   About — Storyboard Edition · the editable data behind the page
   =============================================================================
   Design of record: `About Me Storyboard - Final Proposal.html`, whose REAL
   DATA RULE panel is the spec for this block, verbatim:

     "Verified in this design: places lived (Egypt, Qatar, UAE, UK, USA —
      supplied), Product as professional craft, Claude + ChatGPT as used tools,
      studio photo, interests list (from brief).
      Editable slots (dashed): CURRENT ROLE, COMPANY/FOCUS, extra TOOL chips.
      Ship empty-collapsed until Adel supplies verified strings.
      No invented employers, titles, dates, education, metrics, testimonials."

   So every list here is DATA the page renders, not markup — adding a journey
   stop is one more entry, and an empty slot removes its element from the page
   rather than printing a placeholder. Nothing in this block may be filled in by
   anyone but Adel: a plausible-looking job title is still an invented one.

   The dashed "editable slot" frames in the design are ANNOTATIONS ON A DESIGN.
   They are how a designer shows a reviewer where real data will go; they are
   not a thing to render to a visitor. In production the slot is empty and the
   element is absent.
   ========================================================================== */
export const aboutStory = {
  /* Places lived, in order. `current: true` takes the mint pin. Adding a stop
     is one more entry in this array and nothing else. The annotation beside
     each stop is editorial flavour from the design of record — Adel confirms or
     replaces each before publish. */
  journey: [
    { id: 'egypt', en: { place: 'Egypt', note: 'where it started' }, ar: { place: 'مصر', note: 'البداية من هنا' } },
    { id: 'qatar', en: { place: 'Qatar', note: 'new horizons' }, ar: { place: 'قطر', note: 'دنيا جديدة' } },
    { id: 'uae', en: { place: 'UAE', note: 'building years' }, ar: { place: 'الإمارات', note: 'سنين البناء' } },
    { id: 'uk', en: { place: 'UK', note: 'studying & growing' }, ar: { place: 'بريطانيا', note: 'دراسة وتجربة' } },
    { id: 'usa', en: { place: 'USA', note: 'home base — now' }, ar: { place: 'أمريكا', note: 'البيت دلوقتي' }, current: true },
  ],

  /* ---- the two editable slots from frame 3a --------------------------------
     `role` and `company` are the dashed slots in the design. They are NOT empty
     here, and that is deliberate: these two strings are already verified and
     already published on this site — they were `about.context` in this same
     config file before the storyboard page replaced the old About — so shipping
     them empty would delete published, accurate information rather than avoid
     inventing any. Nothing here is new.

     `note` is the §13 disclosure that has always travelled with them: the
     employer is credibility context, never an endorsement, and the line saying
     so renders wherever the employer does. Clear `company` and the note goes
     with it.

     Empty any of the three and its element disappears. That is the mechanism
     the design asks for, and it works in both directions. */
  role: { en: 'Product Manager', ar: '[[Product Manager]]' },
  company: { en: 'Amazon', ar: '[[Amazon]]' },
  note: {
    en: 'Professional context only. Everything on this site is written in a personal capacity and represents my own views, not my employer’s.',
    ar: 'سياق مهني بس. كل اللي هنا مكتوب بصفة شخصية وبيعبّر عن رأيي أنا، مش رأي جهة شغلي.',
  },

  /* The "Professional experience →" destination — a CV or profile surface that
     does not exist yet. Empty ⇒ the link is not rendered at all. */
  experienceUrl: '',

  /* Tools Adel actually uses. Two are verified in the design of record; a third
     is added here only when it has genuinely earned a place in the workflow. */
  tools: ['Claude', 'ChatGPT'] as string[],

  /* Interests, from the brief. English terms stay English on the Arabic page
     per the frozen non-translated list; only the genuinely Arabic ones differ. */
  interests: [
    { en: 'Vibe Coding', ar: 'Vibe Coding' },
    { en: 'AI', ar: 'AI' },
    { en: 'Automation', ar: 'Automation' },
    { en: 'Gadgets', ar: 'Gadgets' },
    { en: 'Cameras', ar: 'كاميرات' },
    { en: 'Creator Tech', ar: 'Creator Tech' },
    { en: 'Gaming', ar: 'Gaming' },
    { en: 'Product thinking', ar: 'Product thinking' },
    { en: 'Workflows', ar: 'Workflows' },
    { en: 'New tech', ar: 'New tech' },
  ],
};

export const photography = {
  /* Homepage hero portrait. PH v1.0 fixes the HERO ratio at 4:5.
     Supplied with Design System v2.1 and cropped to 4:5 at integration:
     3024×4032 / 2.7 MB source → 800×1000 / 107 KB and a 560×700 / 64 KB
     mobile crop. Real photography only — never stock, never generated. */
  heroPortrait: '/photos/adel-hero.jpg',
  heroPortraitMobile: '/photos/adel-hero-mobile.jpg',
  /* Wider environmental shot for the About page. 3:2 or 16:9. */
  aboutPhoto: '',
  /* The studio scene on the About page — a real desk shot wide enough for the
     sketch annotations to point at the mic, the keyboard and the watch.
     `assets/photos/adel-studio.jpeg` is supplied with the design package; drop
     it into public/photos/ and name it here. Empty ⇒ the studio scene
     collapses, which is the approved behaviour, not a broken frame. */
  studioPhoto: '',
  /* Homepage §2, the "Testing" orientation card: a real desk-detail photo.
     PH v1.0 — real photography only. Empty ⇒ the card falls back to its
     warm-white ground with the "On the desk" caption alone. */
  deskDetail: '',
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
  /* Empty on purpose. No real YouTube ID exists to list yet, and an invented
     one renders a broken thumbnail and a dead link — so the homepage and
     /videos render their designed empty state instead. Adding one real ID here
     lights up both. A video that earns a full write-up goes in
     src/content/videos/ instead; see that folder's _template.md. */
];

/* -----------------------------------------------------------------------------
   ABOUT PAGE
   -----------------------------------------------------------------------------
   ── THE BIOGRAPHY ───────────────────────────────────────────────────────────
   Adel's own story, in the first person, approved and supplied by him. One
   string per paragraph.

   The Arabic follows §11: English technical terms stay English and are wrapped
   in [[ ]], which renders them as bidi-isolated LTR runs. `**` is reserved for
   genuine emphasis — here, the question the Vibe Coding series is asking.

   AboutPage still falls back to the approved hero positioning paragraph if this
   array is ever emptied, so the page can never render blank.
   -------------------------------------------------------------------------- */

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
