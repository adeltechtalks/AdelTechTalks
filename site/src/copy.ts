/* =============================================================================
   ALL THE WORDS ON THE SITE — English and Arabic, side by side.
   =============================================================================
   Edit this file to change any text. Structure, links and lists live in
   site.config.ts; this file is only words.

   ── HOW TO WRITE ENGLISH INSIDE ARABIC ──────────────────────────────────────
   §11: Adel's Arabic deliberately keeps English technical terms. Wrap each one
   in double square brackets and the site handles the rest — direction,
   isolation, wrapping and punctuation:

       'أستكشف الـ[[AI]] و[[Automation]] كل أسبوع'

   Do NOT translate: AI · Automation · Product · Product Manager ·
   Product Management · Technology Specialist · Consultant · AI Enthusiast ·
   Prompt Library · GearNest · Claude · CRM · Agent · Workflow · API ·
   Creator · Tech.

   ⚠️ The Arabic below is Modern Standard Arabic written to the brief. It is
   Adel's personal voice, so it should be read and adjusted by him — the
   structure will not change, only the wording.
   ========================================================================== */

import type { Lang } from './i18n';

/* "I ❤️ Tech" is a brand expression, not a sentence. It stays in Latin in both
   languages, the same way a wordmark does, and is isolated as an LTR run when
   it sits on an Arabic page. The Arabic gloss carries the meaning underneath. */
export const LOVE_TECH = 'I ❤️ Tech';

export type EcosystemKey =
  | 'guides' | 'useCases' | 'videos' | 'prompts' | 'topics' | 'playground' | 'courses';

export interface Copy {
  nav: {
    guides: string; topics: string; about: string; newsletter: string; playground: string;
    work: string;
    /* Phase 1.1 */
    learn: string; series: string; useCases: string; videos: string; prompts: string;
    courses: string;
  };
  common: {
    skip: string; home: string; readMore: string; allGuides: string; allTopics: string;
    minutes: (n: number) => string; updated: string; published: string; backHome: string;
    languageSwitch: string; menuOpen: string; menuClose: string; comingSoon: string;
    signIn: string; profile: string;
    /* Phase 1.1 */
    viewAll: string; copy: string; copied: string; copyFailed: string;
  };
  hero: {
    identity: string; loveTechGloss: string; positioning: string; body: string;
    pattern: string[]; primaryCta: string; primaryCtaAlt: string; secondaryCta: string;
    portraitAlt: string;
    /* ---- DS v2.1 hero ---- */
    badge: string; line2: string; line3: string;
    ctaPrimary: string; ctaSecondary: string; nowBuilding: string;
  };
  explore: { title: string; intro: string };
  latest: { title: string; intro: string; empty: string; kind: Record<'guide' | 'article' | 'video', string> };
  guides: {
    title: string; intro: string; indexTitle: string; indexIntro: string; empty: string;
    downloadLabel: string; relatedTitle: string;
  };
  /* ---- Phase 1.1 · the unified product ecosystem ---- */
  learn: {
    title: string; intro: string; pageTitle: string; pageIntro: string;
    ecosystemTitle: string; startHere: string;
  };
  ecosystem: Record<EcosystemKey, { name: string; body: string }>;
  series: {
    label: string; followTitle: string; followIntro: string;
    partLabel: (n: number) => string; unnumbered: string;
    caseStudyTitle: string; caseStudyIntro: string;
    empty: string; readSeries: string; statusRunning: string;
  };
  useCases: {
    title: string; intro: string; indexTitle: string; indexIntro: string; empty: string;
    outcomeLabel: string; stackLabel: string; visit: string;
    stage: Record<'exploring' | 'building' | 'live' | 'abandoned', string>;
  };
  prompts: {
    title: string; intro: string; cta: string;
    indexTitle: string; indexIntro: string; empty: string;
    promptLabel: string; variablesLabel: string; variablesNote: string; testedOnLabel: string;
    untested: string;
    category: Record<'product' | 'building' | 'research' | 'writing' | 'automation', string>;
  };
  courses: { title: string; body: string; note: string };
  building: { title: string; intro: string; visit: string };
  videos: {
    title: string; intro: string; watch: string; empty: string;
    indexTitle: string; indexIntro: string;
    chaptersTitle: string; takeawaysTitle: string; promptsTitle: string; watchOn: string;
    openAt: (t: string) => string;
  };
  gearnest: { eyebrow: string; title: string; body: string; cta: string; caseStudyCta: string };
  newsletter: {
    title: string; intro: string; label: string; placeholder: string; submit: string;
    note: string; consent: string; success: string; already: string; invalid: string;
    error: string; sending: string; pageTitle: string; pageIntro: string;
  };
  signoff: { title: string; body: string; cta: string; signature: string };
  about: { title: string; intro: string; workTitle: string; contextTitle: string };
  topics: { title: string; intro: string; countLabel: (n: number) => string; empty: string };
  notFound: { title: string; body: string; guidesCta: string; learnCta: string };
  footer: { explore: string; brands: string; blurb: string; rights: string; signature: string };
  /* ---- IA v2.0 · the two pillars, Learn, Playground and the personal close.
     Every string below is the AUTHORED copy from the frozen designs of record,
     English and Arabic each written for its own reader. The Arabic is Egyptian
     colloquial, matching the frames, and is not a translation of the English. */
  ia: {
    nav: { vibeCoding: string; gear: string; learn: string; playground: string; about: string; subscribe: string };
    /* Homepage §2 — Vibe Coding in the Real World */
    realWorld: {
      label: string; aside: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; ctaPrimary: string; ctaSecondary: string;
      benchLabel: string; bench: string[];
      featuredLabel: string; crossoverChip: string; statusChip: string;
      journeyLabel: string; upNextLabel: string; upNextStrip: string;
      slotNote: string; paneLabels: string[];
      ruleVibe: string; ruleVibeNote: string; ruleGear: string; ruleGearNote: string;
      ruleCross: string; ruleCrossNote: string;
      empty: string;
    };
    /* Homepage §3 — Gear, currently testing */
    gear: {
      label: string; aside: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; ctaPrimary: string; ctaSecondary: string;
      featuredLabel: string; crossoverChip: string; crossoverNote: string;
      follow: string; alsoLabel: string;
      ruleRatings: string; ruleRatingsNote: string; ruleCross: string; ruleCrossNote: string;
      ruleBuild: string; ruleBuildNote: string;
      empty: string;
      hubKicker: string; hubTitle: string; hubIntro: string;
      hiddenNote: (names: string) => string;
      moreIn: (category: string) => string;
      factsProduct: string; factsCategory: string; factsSince: string; factsStatus: string;
      status: Record<'testing' | 'using' | 'concluded', string>;
      label_: Record<'currently-testing' | 'workflow-test' | 'creator-test' | 'up-next' | 'worth-exploring', string>;
      takeawayTitle: string; noVerdict: string; verdictLabel: string;
      disclosure: string; read: string;
    };
    /* Homepage §4 — Learn */
    learn: {
      label: string; aside: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string;
      rows: Record<'guides' | 'useCases' | 'videos' | 'topics', { title: string; kicker?: string; body: string; cta: string }>;
      allTopics: string;
      panelStatus: string; panelTitle: string; panelBody: string; panelNote: string; panelCta: string;
    };
    /* Homepage §5 — Playground */
    playground: {
      label: string; aside: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; cta: string;
      toolIndex: (n: number) => string;
      status: Record<'live' | 'beta' | 'in-build' | 'up-next' | 'with-prompts', string>;
      notify: string; open: string;
      ruleFree: string; ruleFreeNote: string; rulePublic: string; rulePublicNote: string;
      ruleDemos: string; ruleDemosNote: string;
      empty: string;
    };
    /* Homepage §6 — About + Subscribe */
    about: {
      loop: string[];
      headBefore: string; headEm: string; headAfter: string;
      bio: string; socialLabel: string;
      subTitle: string; subBody: string; subPlaceholder: string; subButton: string; subNote: string;
      subLoading: string; subSuccess: string; subInvalid: string; subError: string; subAlready: string;
    };
    /* Footer */
    footer: { umbrella: string; explore: string; more: string; promptLibrary: string; rights: string };
    /* Build story + hub */
    vc: {
      hubKicker: string; hubTitle: string; hubIntro: string;
      featuredLabel: string; groupBuilds: string; groupExperiments: string;
      seriesLabel: string; seriesStrip: string;
      status: Record<'exploring' | 'designing' | 'building' | 'testing' | 'launched' | 'paused', string>;
      stage: Record<'idea' | 'explore' | 'design' | 'build' | 'test' | 'launch', string>;
      stageState: Record<'done' | 'doneFirst' | 'now' | 'next', string>;
      journeyLabel: string; toolsNote: string; seeLive: string; openInPlayground: string;
      previous: string; next: string; read: string;
      crossoverTitle: string; crossoverToGear: string; crossoverToBuild: string;
      empty: string; footnote: string;
    };
  };
}

const en: Copy = {
  nav: {
    guides: 'Guides',
    topics: 'Topics',
    about: 'About',
    newsletter: 'Newsletter',
    playground: 'Playground',
    work: 'Work with me',
    learn: 'Learn',
    series: 'Vibe Coding',
    useCases: 'Use cases',
    videos: 'Videos',
    prompts: 'Prompts',
    courses: 'Courses',
  },
  common: {
    skip: 'Skip to content',
    home: 'Home',
    readMore: 'Read',
    allGuides: 'All guides',
    allTopics: 'All topics',
    minutes: (n) => `${n} min`,
    updated: 'Updated',
    published: 'Published',
    backHome: 'Back to home',
    languageSwitch: 'العربية',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    comingSoon: 'In progress',
    signIn: 'Sign in',
    profile: 'Your profile',
    viewAll: 'View all',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Select and copy',
  },
  hero: {
    identity: 'Adel',
    loveTechGloss: '',
    positioning: 'Product Manager · AI Enthusiast · Builder · Lifelong Learner',
    body:
      'Product Manager at Amazon. I spend my own time pulling AI apart to see how it works, building things with it, and writing down what actually held up.',
    pattern: ['I learn it.', 'I test it.', 'I build with it.', 'I share it.'],
    primaryCta: 'Start with the guides',
    /* Used while no guide is published — the hero's one primary action must
       never land on an empty index. */
    primaryCtaAlt: 'Start with the library',
    secondaryCta: 'More about me',
    portraitAlt: 'Adel at his studio desk — headphones, microphone and keyboard',
    /* ---- DS v2.1 hero. Three lines, deliberately unequal weight: "I ❤ Tech"
       carries the 800 display presence, line2 sits a step below at 700, line3
       is supporting text. ---- */
    badge: 'Vibe Coding · Building in public',
    line2: 'I turn ideas into launches with [[Vibe Coding]].',
    line3: 'Building GearNest. Sharing everything I learn.',
    ctaPrimary: 'Explore the build',
    ctaSecondary: 'Start with the library',
    nowBuilding: 'Currently building · GearNest',
  },
  explore: {
    title: 'What I explore',
    intro: 'Six threads that keep pulling me back. Everything on this site sits under one of them.',
  },
  latest: {
    title: 'Latest',
    intro: 'The most recent things I have published, learned, tested, built or shared.',
    empty: 'The first pieces are being written. The newsletter goes out when they land.',
    kind: { guide: 'Guide', article: 'Article', video: 'Video' },
  },
  guides: {
    title: 'Guides',
    intro: 'Longer, practical walkthroughs. Each one ends with something working.',
    indexTitle: 'Do it, don’t just read it',
    indexIntro:
      'Every guide here ends with something running on your machine. If it only teaches you a definition, it does not belong on this page.',
    empty: 'No guides published yet — the first ones are being written.',
    downloadLabel: 'Get the guide',
    relatedTitle: 'Related',
  },
  learn: {
    title: 'Learn',
    intro: 'Everything I publish, in one place, sorted by what you want to do with it.',
    pageTitle: 'Learn what I learned, without the weekend I lost',
    pageIntro:
      'Guides teach you the technique. Use cases show what happened when it met a real problem. Videos show the hands. Prompts are the exact words I used. Take whichever one you need.',
    ecosystemTitle: 'The whole library',
    startHere: 'Start here',
  },
  ecosystem: {
    guides: {
      name: 'How-to guides',
      body: 'Step by step, start to finish. Each one ends with something running on your machine.',
    },
    useCases: {
      name: 'Use cases',
      body: 'What happened when the technique met a real problem — including the times it did not work.',
    },
    videos: {
      name: 'Videos',
      body: 'Chapters, takeaways and the prompts used on screen, so the value survives without the video.',
    },
    prompts: {
      name: 'Prompt Library',
      body: 'The exact prompts I reuse, with what they get wrong and which models they were tested on.',
    },
    topics: {
      name: 'Topics',
      body: 'The six threads everything here sits under. The slow way in, if you would rather browse.',
    },
    playground: {
      name: 'Playground',
      body: 'Short games that check whether a video actually landed. Play one, keep the badge.',
    },
    courses: {
      name: 'Courses',
      body: 'Structured paths through the library, in order, with the exercises in between. Being built.',
    },
  },
  series: {
    label: 'Series',
    followTitle: 'Everything in this series',
    followIntro: 'In order, oldest first. New parts land here as they are published.',
    partLabel: (n) => `Part ${n}`,
    unnumbered: 'Also in this series',
    caseStudyTitle: 'The case study',
    caseStudyIntro: 'The real business this question is being tested on.',
    empty: 'The first part is being written. The newsletter goes out when it lands.',
    readSeries: 'Follow the series',
    statusRunning: 'Publishing now',
  },
  useCases: {
    title: 'Use cases',
    intro: 'Real problems, and what actually happened.',
    indexTitle: 'What happened when I actually tried it',
    indexIntro:
      'A guide is the technique. A use case is the technique meeting a real problem with a real deadline. The ones that did not work are here too — they are the useful half.',
    empty: 'The first use cases are being written.',
    outcomeLabel: 'Where it got to',
    stackLabel: 'Built with',
    visit: 'See it live',
    stage: {
      exploring: 'Exploring',
      building: 'Building',
      live: 'Live',
      abandoned: 'Stopped',
    },
  },
  prompts: {
    title: 'Prompt Library',
    intro:
      'The prompts I actually reuse — for product work, research, writing and building. Copy one, change the parts in brackets, run it.',
    cta: 'Browse the library',
    indexTitle: 'The prompts I actually reuse',
    indexIntro:
      'Not a list of clever one-liners. These are the ones that survived being used on real work, with what each gets wrong written underneath it.',
    empty: 'The first prompts are being written up.',
    promptLabel: 'The prompt',
    variablesLabel: 'Replace before running',
    variablesNote: 'Everything in brackets is yours to fill in.',
    testedOnLabel: 'Tested on',
    untested:
      'Not recorded against a specific model yet. The wording is tuned to how these tools behave generally, so expect to adjust a line or two for yours.',
    category: {
      product: 'Product',
      building: 'Building',
      research: 'Research',
      writing: 'Writing',
      automation: 'Automation',
    },
  },
  courses: {
    title: 'Courses',
    body:
      'A course is a path through everything above — the guides in order, the videos in between, and something to build at the end. I am putting the first one together now.',
    note: 'There is nothing to enrol in yet, so there is nothing here to click. When the first course is finished it will be announced in the newsletter.',
  },
  building: {
    title: 'What I’m building',
    intro: 'Side projects that started as an itch and turned into something real.',
    visit: 'Visit',
  },
  videos: {
    title: 'Latest videos',
    intro: 'Tested, not unboxed.',
    watch: 'Watch on YouTube',
    empty: 'Videos are on the way.',
    indexTitle: 'Watch it, then take the parts you need',
    indexIntro:
      'Every video here has a page: the chapters, what you should be able to do afterwards, and the exact prompts that were on screen. Useful even if you never press play.',
    chaptersTitle: 'Chapters',
    takeawaysTitle: 'What you should be able to do afterwards',
    promptsTitle: 'Prompts used in this video',
    watchOn: 'Watch on YouTube',
    openAt: (t) => `Open the video at ${t}`,
  },
  gearnest: {
    eyebrow: 'The first Vibe Coding case study',
    title: 'GearNest',
    body:
      'GearNest is where the question gets tested: can I build a real business with Vibe Coding? It is its own brand with its own product, voice and roadmap — it lives here as a case study and a link, not as a section of my identity.',
    cta: 'Go to GearNest',
    caseStudyCta: 'Read the case study',
  },
  newsletter: {
    title: 'One email, when there is something worth sending',
    intro:
      'What I learned, what I tested, what broke, and what I would do differently. No hype and no affiliate dumps.',
    label: 'Email address',
    placeholder: 'you@example.com',
    submit: 'Subscribe',
    note: 'Unsubscribe any time. Your address is stored on my own database and is never sold or shared.',
    consent: 'By subscribing you agree to receive occasional emails from Adel.',
    success: 'You’re in. Check your inbox for the first one.',
    already: 'You’re already on the list — nothing more to do.',
    invalid: 'That doesn’t look like a complete email address.',
    error: 'Something went wrong on my side. Try again in a moment.',
    sending: 'Subscribing…',
    pageTitle: 'The newsletter',
    pageIntro:
      'One email when there is genuinely something to say — a guide, a build, a thing I got wrong. You can leave whenever you like.',
  },
  signoff: {
    title: 'Why any of this exists',
    body:
      'I learn best by building the thing and then explaining it to somebody else. This site is the second half of that — the explaining. If something here saved you an afternoon, that is the whole point.',
    cta: 'The longer version',
    signature: 'Adel',
  },
  about: {
    title: 'About',
    intro: 'Who I am, what I work on, and why I keep writing it all down.',
    workTitle: 'How I work',
    contextTitle: 'Where I work',
  },
  topics: {
    title: 'Topics',
    intro: 'Everything on this site, grouped by the thread it belongs to.',
    countLabel: (n) => (n === 1 ? '1 piece' : `${n} pieces`),
    empty: 'Nothing published under this topic yet.',
  },
  notFound: {
    title: 'That page does not exist',
    body: 'It may have moved, or the link may be wrong. The guides and the topics are both one click away.',
    guidesCta: 'Browse guides',
    learnCta: 'Explore the library',
  },
  footer: {
    explore: 'Explore',
    brands: 'For brands',
    blurb: 'Product Manager, AI enthusiast and builder. I learn it, test it, build with it, and share it.',
    rights: 'Adel',
    signature: 'Made by Adel.',
  },
  /* ---- IA v2.0 — authored English, verbatim from the frozen frames ---- */
  ia: {
    nav: { vibeCoding: 'Vibe Coding', gear: 'Gear', learn: 'Learn', playground: 'Playground', about: 'About', subscribe: 'Subscribe' },
    realWorld: {
      label: 'Vibe Coding · in the real world',
      aside: '// builds only — gear lives next door',
      headBefore: 'What can I actually ', headEm: 'build', headAfter: ' with AI?',
      support: 'Real experiments. Real builds. Sharing what works, what breaks, and what I learn along the way.',
      ctaPrimary: 'Explore Vibe Coding', ctaSecondary: 'See all builds',
      benchLabel: 'On the bench', bench: ['AI-assisted builds', 'Workflows & tools', 'Building in public'],
      featuredLabel: 'Featured build', crossoverChip: 'Crossover · × Gear', statusChip: 'Build · in progress',
      journeyLabel: 'This build’s journey',
      upNextLabel: 'Up next', upNextStrip: 'Build 01 → 02 → 03 → …',
      slotNote: 'Multitasking build workflow · slot is replaceable per featured build',
      paneLabels: ['ChatGPT', 'Claude Code', 'Live site'],
      ruleVibe: 'Vibe Coding', ruleVibeNote: '— building with AI, here',
      ruleGear: 'Gear', ruleGearNote: '— using & testing tech, its own section',
      ruleCross: 'Crossover', ruleCrossNote: '— only when the device enables the build',
      empty: 'The first build goes up here as soon as there is something real to show.',
    },
    gear: {
      label: 'Gear · currently testing', aside: '// use cases, not spec sheets',
      headBefore: 'Tech I’m actually ', headEm: 'using', headAfter: '.',
      support: 'Not just specs — what does this actually help me do?',
      ctaPrimary: 'Explore Gear', ctaSecondary: 'See all gear',
      featuredLabel: 'Currently testing', crossoverChip: 'Vibe Coding crossover',
      crossoverNote: 'Crossover: this story also lives in Vibe Coding — the device enables the build.',
      follow: 'Follow this test', alsoLabel: 'Also testing',
      ruleRatings: 'No ratings, no scores', ruleRatingsNote: '— conclusions come after real testing',
      ruleCross: 'Crossover chip', ruleCrossNote: '— only when the device enables the build',
      ruleBuild: 'Building with AI', ruleBuildNote: '— lives in Vibe Coding, one section up',
      empty: 'The first test goes up here once there is something real to report.',
      hubKicker: 'Gear', hubTitle: 'Tech I’m actually using.',
      hubIntro: 'A testing journal — what I use, what it changed, and what I would not buy again.',
      hiddenNote: (names) => `Not yet published: ${names}.`,
      moreIn: (category) => `More in ${category}`,
      factsProduct: 'Product', factsCategory: 'Category', factsSince: 'Testing since', factsStatus: 'Status',
      status: { testing: 'In testing', using: 'Using now', concluded: 'Concluded' },
      label_: {
        'currently-testing': 'Currently testing', 'workflow-test': 'Workflow test',
        'creator-test': 'Creator test', 'up-next': 'Up next', 'worth-exploring': 'Worth exploring',
      },
      takeawayTitle: 'Takeaway',
      noVerdict: 'No verdict yet — this one is still in testing. I will write it up when I have actually finished with it.',
      verdictLabel: 'Concluded',
      disclosure: 'If any link here ever earns me anything, it will say so on this line. Today: none are.',
      read: 'Read',
    },
    learn: {
      label: 'Learn · guides & prompts', aside: '// written up so you can use it',
      headBefore: 'Learn what ', headEm: 'I learn', headAfter: '.',
      support: 'Everything I figure out while testing and building — guides, use cases and prompts you can put to work today.',
      rows: {
        guides: { title: 'Guides', body: 'Step-by-step write-ups from real builds and real tests — nothing theoretical.', cta: 'Browse' },
        useCases: { title: 'Use cases', body: '“What can this actually do for me?” — real scenarios, honest outcomes.', cta: 'Browse' },
        videos: { title: 'Videos', body: 'The same experiments, on camera — over on AdelTechTalks.', cta: 'Watch' },
        topics: { title: 'Topics', body: '', cta: 'All topics' },
      },
      allTopics: 'All topics',
      panelStatus: 'Coming soon', panelTitle: 'Prompt Library',
      panelBody: 'The exact prompts I use — copy, paste, adapt.',
      panelNote: 'Every prompt earns its place in a real workflow first. Opening with the ones behind my current builds.',
      panelCta: 'Get notified when it opens',
    },
    playground: {
      label: 'Playground · try it yourself', aside: '// built with the same Vibe Coding workflow',
      headBefore: 'Don’t just read it — ', headEm: 'try it', headAfter: '.',
      support: 'Small interactive tools I’m building in public. Everything on this bench ships from the workflow you see in Vibe Coding.',
      cta: 'Visit the Playground',
      toolIndex: (n) => `Tool ${String(n).padStart(2, '0')}`,
      status: { live: 'Live', beta: 'Beta', 'in-build': 'In build', 'up-next': 'Up next', 'with-prompts': 'With Prompt Library' },
      notify: 'Get notified at launch', open: 'Open',
      ruleFree: 'Free to try', ruleFreeNote: '— an account only when a tool saves your work',
      rulePublic: 'Built in public', rulePublicNote: '— each tool’s build story lives in Vibe Coding',
      ruleDemos: 'No fake demos', ruleDemosNote: '— a tool appears here only when you can actually open it',
      empty: 'Nothing is open yet. The workbench is where the tools land first.',
    },
    about: {
      loop: ['Learn', 'Test', 'Build', 'Share'],
      headBefore: 'Hi, I’m Adel. I just really ', headEm: 'love tech', headAfter: '.',
      bio: 'I turn ideas into launches with Vibe Coding, test the gear I actually use, and write up whatever surprises me along the way. Product manager by profession — tinkerer by default.',
      socialLabel: 'AdelTechTalks on',
      subTitle: 'Get what I learn — before I polish it.',
      subBody: 'One email when something’s worth your time: a new build, a test that surprised me, a prompt that works.',
      subPlaceholder: 'you@email.com', subButton: 'Subscribe',
      subNote: 'No spam, no schedule pressure — unsubscribe anytime.',
      subLoading: 'Subscribing…',
      subSuccess: 'You’re in — check your inbox to confirm.',
      subInvalid: 'That email doesn’t look right — mind checking it?',
      subError: 'Something broke on my end — try again in a minute?',
      subAlready: 'You’re already on the list — nice.',
    },
    footer: {
      umbrella: 'How I use technology to build, create, and work smarter.',
      explore: 'Explore', more: 'More', promptLibrary: 'Prompt Library · soon',
      rights: '© 2026 Adel — built with Vibe Coding, obviously.',
    },
    vc: {
      hubKicker: 'Vibe Coding', hubTitle: 'I turn ideas into launches.',
      hubIntro: 'Every build in the open — the idea, the tools, what broke, and where it got to.',
      featuredLabel: 'Now building', groupBuilds: 'Builds', groupExperiments: 'Experiments',
      seriesLabel: 'Series · Building in public', seriesStrip: 'Part 01 → Part 02 → …',
      status: {
        exploring: 'Exploring', designing: 'Designing', building: 'Now building',
        testing: 'Testing', launched: 'Launched', paused: 'Paused',
      },
      stage: { idea: 'Idea', explore: 'Explore', design: 'Design', build: 'Build', test: 'Test', launch: 'Launch' },
      stageState: { done: 'Done', doneFirst: 'Done', now: 'Now', next: 'Next' },
      journeyLabel: 'This build’s journey',
      toolsNote: 'Only the tools I actually used — no unearned credit.',
      seeLive: 'See it live', openInPlayground: 'Open it in Playground',
      previous: 'Previous part', next: 'Next part', read: 'Read the build',
      crossoverTitle: 'Crossover',
      crossoverToGear: 'The device side of this build lives in Gear.',
      crossoverToBuild: 'The build this device made possible lives in Vibe Coding.',
      empty: 'The first build goes up here as soon as there is something real to show.',
      footnote: 'Screenshots are real, or the story waits. Nothing here is a mock-up.',
    },
  },
};

const ar: Copy = {
  nav: {
    guides: 'الأدلة',
    topics: 'المواضيع',
    about: 'عن عادل',
    newsletter: 'النشرة',
    playground: 'الملعب',
    work: 'للتعاون معي',
    learn: 'تعلّم',
    series: '[[Vibe Coding]]',
    useCases: 'حالات الاستخدام',
    videos: 'الفيديوهات',
    prompts: 'الـ[[Prompts]]',
    courses: 'الدورات',
  },
  common: {
    skip: 'تخطَّ إلى المحتوى',
    home: 'الرئيسية',
    readMore: 'اقرأ',
    allGuides: 'كل الأدلة',
    allTopics: 'كل المواضيع',
    minutes: (n) => `${n} دقيقة`,
    updated: 'آخر تحديث',
    published: 'نُشر في',
    backHome: 'العودة إلى الرئيسية',
    languageSwitch: 'English',
    menuOpen: 'افتح القائمة',
    menuClose: 'أغلق القائمة',
    comingSoon: 'قيد العمل',
    signIn: 'تسجيل الدخول',
    profile: 'حسابك',
    viewAll: 'عرض الكل',
    copy: 'انسخ',
    copied: 'تم النسخ',
    copyFailed: 'حدّد النص وانسخه',
  },
  hero: {
    identity: 'عادل',
    loveTechGloss: 'أحب التقنية، وأحب أن أفهم كيف تعمل.',
    positioning: '[[Product Manager]] · [[AI Enthusiast]] · باني ومجرِّب · متعلّم مدى الحياة',
    body:
      '[[Product Manager]] في [[Amazon]]. وفي وقتي الخاص أفكّك الـ[[AI]] لأفهم كيف يشتغل، أبني به أشياء حقيقية، وأكتب ما صمد منها فعلاً.',
    pattern: ['أتعلّمها.', 'أجرّبها.', 'أبني بها.', 'أشاركها.'],
    primaryCta: 'ابدأ من الأدلة',
    primaryCtaAlt: 'ابدأ من المكتبة',
    secondaryCta: 'المزيد عني',
    portraitAlt: 'عادل',
    /* DS v2.1 hero, Adel's own Egyptian-Arabic voice as supplied. English
       terms stay English per the non-translated list. */
    badge: '[[Vibe Coding]] · بابني قدّام الناس',
    line2: 'بحوّل الأفكار لمشاريع باستخدام [[Vibe Coding]].',
    line3: 'ببني [[GearNest]] وبشارك كل حاجة بتعلمها.',
    ctaPrimary: 'اكتشف الرحلة',
    ctaSecondary: 'ابدأ من المكتبة',
    nowBuilding: 'بابني دلوقتي · [[GearNest]]',
  },
  explore: {
    title: 'ما أستكشفه',
    intro: 'ستة خيوط أعود إليها دائماً. كل ما في هذا الموقع يقع تحت واحد منها.',
  },
  latest: {
    title: 'الأحدث',
    intro: 'آخر ما نشرته أو تعلّمته أو جرّبته أو بنيته أو شاركته.',
    empty: 'أول المواد قيد الكتابة. النشرة تصل حين تنزل.',
    kind: { guide: 'دليل', article: 'مقال', video: 'فيديو' },
  },
  guides: {
    title: 'الأدلة',
    intro: 'شروحات عملية أطول. كل واحد منها ينتهي بشيء يشتغل بين يديك.',
    indexTitle: 'طبّقه، لا تكتفِ بقراءته',
    indexIntro:
      'كل دليل هنا ينتهي بشيء يعمل على جهازك. إن كان يعلّمك تعريفاً فقط، فمكانه ليس هذه الصفحة.',
    empty: 'لا توجد أدلة منشورة بعد — أولها قيد الكتابة.',
    downloadLabel: 'احصل على الدليل',
    relatedTitle: 'ذات صلة',
  },
  learn: {
    title: 'تعلّم',
    intro: 'كل ما أنشره في مكان واحد، مرتّباً حسب ما تريد أن تفعله به.',
    pageTitle: 'تعلّم ما تعلّمته، دون أن تدفع ثمن الوقت الذي دفعته',
    pageIntro:
      'الأدلة تعلّمك الطريقة. حالات الاستخدام تريك ما حدث حين واجهت الطريقة مشكلة حقيقية. الفيديوهات تريك اليدين وهي تعمل. والـ[[prompts]] هي الكلمات نفسها التي استخدمتها. خذ ما تحتاجه.',
    ecosystemTitle: 'المكتبة كاملة',
    startHere: 'ابدأ من هنا',
  },
  ecosystem: {
    guides: {
      name: 'أدلة عملية',
      body: 'خطوة بخطوة من أولها إلى آخرها. كل دليل ينتهي بشيء يعمل على جهازك.',
    },
    useCases: {
      name: 'حالات استخدام',
      body: 'ما حدث حين واجهت الطريقة مشكلة حقيقية — بما في ذلك المرات التي لم تنجح فيها.',
    },
    videos: {
      name: 'الفيديوهات',
      body: 'فصول وخلاصات والـ[[prompts]] المستخدمة على الشاشة، حتى تبقى الفائدة حتى بلا مشاهدة.',
    },
    prompts: {
      name: '[[Prompt Library]]',
      body: 'الـ[[prompts]] التي أعيد استخدامها فعلاً، وما تخطئ فيه، وعلى أي [[models]] جُرِّبت.',
    },
    topics: {
      name: 'المواضيع',
      body: 'الخيوط الستة التي يقع تحتها كل شيء هنا. الطريق البطيء، إن كنت تفضّل التصفّح.',
    },
    playground: {
      name: 'الملعب',
      body: 'ألعاب قصيرة تختبر إن كان الفيديو قد وصل فعلاً. العب واحدة واحتفظ بالشارة.',
    },
    courses: {
      name: 'الدورات',
      body: 'مسارات مرتّبة داخل المكتبة، بالترتيب، وبينها التمارين. قيد البناء.',
    },
  },
  series: {
    label: 'سلسلة',
    followTitle: 'كل ما في هذه السلسلة',
    followIntro: 'بالترتيب، من الأقدم. الأجزاء الجديدة تظهر هنا فور نشرها.',
    partLabel: (n) => `الجزء ${n}`,
    unnumbered: 'أيضاً في هذه السلسلة',
    caseStudyTitle: 'دراسة الحالة',
    caseStudyIntro: 'المشروع الحقيقي الذي يُختبر عليه هذا السؤال.',
    empty: 'الجزء الأول قيد الكتابة. النشرة تصل حين ينزل.',
    readSeries: 'تابع السلسلة',
    statusRunning: 'تُنشر الآن',
  },
  useCases: {
    title: 'حالات الاستخدام',
    intro: 'مشكلات حقيقية، وما حدث فعلاً.',
    indexTitle: 'ماذا حدث حين جرّبتها فعلاً',
    indexIntro:
      'الدليل هو الطريقة. وحالة الاستخدام هي الطريقة وهي تواجه مشكلة حقيقية بموعد تسليم حقيقي. وما لم ينجح موجود هنا أيضاً — وهو النصف المفيد.',
    empty: 'أولى حالات الاستخدام قيد الكتابة.',
    outcomeLabel: 'إلى أين وصلت',
    stackLabel: 'مبنية بـ',
    visit: 'شاهدها مباشرة',
    stage: {
      exploring: 'قيد الاستكشاف',
      building: 'قيد البناء',
      live: 'تعمل',
      abandoned: 'توقفت',
    },
  },
  prompts: {
    title: '[[Prompt Library]]',
    intro:
      'الـ[[prompts]] التي أستخدمها فعلاً — في الـ[[Product]] والبحث والكتابة والبناء. انسخ واحداً، غيّر ما بين الأقواس، ثم شغّله.',
    cta: 'تصفّح المكتبة',
    indexTitle: 'الـ[[prompts]] التي أعيد استخدامها فعلاً',
    indexIntro:
      'ليست قائمة عبارات ذكية. هذه ما صمد منها بعد الاستخدام في عمل حقيقي، ومكتوب تحت كل واحد ما يخطئ فيه.',
    empty: 'أول الـ[[prompts]] قيد الإعداد.',
    promptLabel: 'الـ[[prompt]]',
    variablesLabel: 'استبدلها قبل التشغيل',
    variablesNote: 'كل ما بين الأقواس متروك لك لتملأه.',
    testedOnLabel: 'جُرِّب على',
    untested:
      'لم يُسجَّل بعد مقابل [[model]] بعينه. الصياغة مضبوطة على سلوك هذه الأدوات عموماً، فتوقّع تعديل سطر أو سطرين لما تستخدمه أنت.',
    category: {
      product: '[[Product]]',
      building: 'البناء',
      research: 'البحث',
      writing: 'الكتابة',
      automation: '[[Automation]]',
    },
  },
  courses: {
    title: 'الدورات',
    body:
      'الدورة مسار داخل كل ما سبق — الأدلة بالترتيب، والفيديوهات بينها، وشيء تبنيه في النهاية. أجهّز الأولى الآن.',
    note: 'لا يوجد تسجيل بعد، فلا يوجد هنا ما تضغط عليه. وحين تكتمل أول دورة سيُعلَن عنها في النشرة.',
  },
  building: {
    title: 'ما أبنيه',
    intro: 'مشاريع بدأت كفكرة مزعجة في رأسي ثم صارت شيئاً حقيقياً.',
    visit: 'زيارة',
  },
  videos: {
    title: 'أحدث الفيديوهات',
    intro: 'تجربة حقيقية، لا مجرد فتح علبة.',
    watch: 'شاهد على [[YouTube]]',
    empty: 'الفيديوهات في الطريق.',
    indexTitle: 'شاهده، ثم خذ ما تحتاجه منه',
    indexIntro:
      'كل فيديو هنا له صفحة: الفصول، وما ينبغي أن تقدر عليه بعده، والـ[[prompts]] التي ظهرت على الشاشة. مفيدة حتى إن لم تشغّل الفيديو.',
    chaptersTitle: 'الفصول',
    takeawaysTitle: 'ما ينبغي أن تقدر عليه بعده',
    promptsTitle: 'الـ[[prompts]] المستخدمة في الفيديو',
    watchOn: 'شاهد على [[YouTube]]',
    openAt: (t) => `افتح الفيديو عند ${t}`,
  },
  gearnest: {
    eyebrow: 'أول دراسة حالة لـ[[Vibe Coding]]',
    title: '[[GearNest]]',
    body:
      '[[GearNest]] هو المكان الذي يُختبر فيه السؤال: هل أستطيع بناء مشروع حقيقي بالـ[[Vibe Coding]]؟ علامة مستقلة بمنتجها وصوتها وخارطة طريقها — مكانها هنا دراسة حالة ورابط، لا قسم من هويتي.',
    cta: 'انتقل إلى [[GearNest]]',
    caseStudyCta: 'اقرأ دراسة الحالة',
  },
  newsletter: {
    title: 'رسالة واحدة، حين يكون هناك ما يستحق الإرسال',
    intro:
      'ما تعلّمته، وما جرّبته، وما انكسر، وما كنت سأفعله بشكل مختلف. بلا مبالغة وبلا روابط تسويقية.',
    label: 'البريد الإلكتروني',
    placeholder: 'you@example.com',
    submit: 'اشترك',
    note: 'يمكنك إلغاء الاشتراك في أي وقت. بريدك محفوظ في قاعدة بياناتي وحدها ولا يُباع ولا يُشارك.',
    consent: 'باشتراكك توافق على استقبال رسائل من عادل بين حين وآخر.',
    success: 'تم. ستصلك أول رسالة قريباً.',
    already: 'أنت مشترك بالفعل — لا شيء آخر عليك فعله.',
    invalid: 'هذا لا يبدو بريداً إلكترونياً مكتملاً.',
    error: 'حدث خطأ من جهتي. أعد المحاولة بعد قليل.',
    sending: 'جارٍ الاشتراك…',
    pageTitle: 'النشرة البريدية',
    pageIntro:
      'رسالة واحدة حين يكون هناك فعلاً ما يُقال — دليل، أو مشروع، أو خطأ وقعت فيه. ويمكنك الخروج متى شئت.',
  },
  signoff: {
    title: 'لماذا كل هذا؟',
    body:
      'أتعلّم أفضل حين أبني الشيء ثم أشرحه لشخص آخر. هذا الموقع هو النصف الثاني: الشرح. وإن وفّر عليك شيء هنا بعد ظهيرة كاملة، فهذا هو المقصود كله.',
    cta: 'النسخة الأطول',
    signature: 'عادل',
  },
  about: {
    title: 'عن عادل',
    intro: 'من أنا، وعلى ماذا أعمل، ولماذا أواصل تدوين كل هذا.',
    workTitle: 'كيف أعمل',
    contextTitle: 'أين أعمل',
  },
  topics: {
    title: 'المواضيع',
    intro: 'كل ما في هذا الموقع، مرتّباً حسب الخيط الذي ينتمي إليه.',
    countLabel: (n) => (n === 1 ? 'مادة واحدة' : `${n} مواد`),
    empty: 'لا يوجد منشور تحت هذا الموضوع بعد.',
  },
  notFound: {
    title: 'هذه الصفحة غير موجودة',
    body: 'ربما انتقلت، أو الرابط غير صحيح. الأدلة والمواضيع على بُعد نقرة واحدة.',
    guidesCta: 'تصفّح الأدلة',
    learnCta: 'تصفّح المكتبة',
  },
  footer: {
    explore: 'استكشف',
    brands: 'للعلامات التجارية',
    blurb: '[[Product Manager]] ومهتم بالـ[[AI]] وباني. أتعلّمها، أجرّبها، أبني بها، وأشاركها.',
    rights: 'عادل',
    signature: 'من صنع عادل.',
  },
  /* ---- IA v2.0 — authored Arabic, verbatim from the frozen AR frames.
     Egyptian colloquial by design, and NOT a translation of the English above:
     each language was written for its own reader. Do not rewrite. ---- */
  ia: {
    nav: { vibeCoding: 'Vibe Coding', gear: 'Gear', learn: 'اتعلم', playground: 'Playground', about: 'عن عادل', subscribe: 'اشترك' },
    realWorld: {
      label: 'Vibe Coding · in the real world',
      aside: 'هنا البناء بس — الأجهزة ليها قسم [[Gear]]',
      headBefore: 'إيه اللي أقدر أبنيه بالـ', headEm: 'AI', headAfter: '؟',
      support: 'تجارب ومشاريع حقيقية ببنيها بالـ[[AI]] — وبشارك إيه اللي اشتغل، وإيه اللي ما اشتغلش، وإيه اللي اتعلمته في الطريق.',
      ctaPrimary: 'استكشف الـ[[Vibe Coding]]', ctaSecondary: 'شوف كل المشاريع',
      benchLabel: 'وعلى الترابيزة', bench: ['مشاريع بالـ[[AI]]', 'أدوات و[[workflows]]', 'بنبني في العلن'],
      featuredLabel: 'Featured build', crossoverChip: 'Crossover · × Gear', statusChip: 'بناء · شغّال دلوقتي',
      journeyLabel: 'رحلة الـ[[Build]] ده',
      upNextLabel: 'الجاي بعده', upNextStrip: 'Build 01 → 02 → 03 → …',
      slotNote: 'شاشة شغل حقيقية متعددة المهام — المكان بيتبدل مع كل [[Build]] جديد',
      paneLabels: ['ChatGPT', 'Claude Code', 'Live site'],
      ruleVibe: 'Vibe Coding', ruleVibeNote: '— بنبني بالـ[[AI]]، هنا',
      ruleGear: 'Gear', ruleGearNote: '— بنستخدم ونجرّب الأجهزة، في قسمها',
      ruleCross: 'Crossover', ruleCrossNote: '— بس لما الجهاز نفسه يخلّي البناء ممكن',
      empty: 'أول [[build]] هيتنشر هنا أول ما يبقى في حاجة حقيقية تتعرض.',
    },
    gear: {
      label: 'Gear · currently testing', aside: 'مش مواصفات — استخدام حقيقي',
      headBefore: 'تكنولوجيا بستخدمها ', headEm: 'فعلاً', headAfter: '.',
      support: 'مش المواصفات وبس — إيه اللي الجهاز ده بيساعدني أعمله فعلاً؟',
      ctaPrimary: 'استكشف الـ[[Gear]]', ctaSecondary: 'شوف كل الـ[[Gear]]',
      featuredLabel: 'بجرّبه دلوقتي', crossoverChip: 'Vibe Coding crossover',
      crossoverNote: 'Crossover: القصة دي موجودة كمان في [[Vibe Coding]] — الجهاز نفسه هو اللي بيخلّي البناء ممكن.',
      follow: 'تابع التجربة', alsoLabel: 'بجرّب كمان',
      ruleRatings: 'من غير تقييمات ولا نجوم', ruleRatingsNote: '— الخلاصة بتيجي بعد تجربة حقيقية',
      ruleCross: 'علامة الـ[[Crossover]]', ruleCrossNote: '— بس لما الجهاز نفسه يخلّي البناء ممكن',
      ruleBuild: 'البناء بالـ[[AI]]', ruleBuildNote: '— مكانه قسم [[Vibe Coding]] فوق',
      empty: 'أول تجربة هتتنشر هنا أول ما يبقى في حاجة حقيقية أقولها.',
      hubKicker: 'Gear', hubTitle: 'تكنولوجيا بستخدمها فعلاً.',
      hubIntro: 'دفتر تجارب — إيه اللي بستخدمه، وإيه اللي غيّره، وإيه اللي مش هشتريه تاني.',
      hiddenNote: (names) => `لسه ما اتنشرش: ${names}.`,
      moreIn: (category) => `كمان في ${category}`,
      factsProduct: 'المنتج', factsCategory: 'القسم', factsSince: 'بجرّبه من', factsStatus: 'الحالة',
      status: { testing: 'تحت التجربة', using: 'بستخدمه دلوقتي', concluded: 'خلصت التجربة' },
      label_: {
        'currently-testing': 'بجرّبه دلوقتي', 'workflow-test': 'Workflow test',
        'creator-test': 'Creator test', 'up-next': 'الجاي', 'worth-exploring': 'يستاهل التجربة',
      },
      takeawayTitle: 'الخلاصة',
      noVerdict: 'لسه مفيش حكم — التجربة شغّالة. هكتب الخلاصة لما أكون خلّصت فعلاً.',
      verdictLabel: 'خلصت التجربة',
      disclosure: 'لو أي رابط هنا كسّبني حاجة، السطر ده هيقولها. النهارده: ولا واحد.',
      read: 'اقرأ',
    },
    learn: {
      label: 'Learn · guides & prompts', aside: 'مكتوب عشان تستخدمه',
      headBefore: 'اتعلم اللي أنا ', headEm: 'بتعلّمه', headAfter: '.',
      support: 'كل اللي بكتشفه وأنا بجرّب وببني — أدلة و[[use cases]] و[[prompts]] تقدر تستخدمها من النهارده.',
      rows: {
        guides: { title: 'أدلة عملية', kicker: 'Guides', body: 'خطوة بخطوة من تجارب وبناء حقيقي — مفيش كلام نظري.', cta: 'تصفّح' },
        useCases: { title: 'استخدامات حقيقية', kicker: 'Use cases', body: '«إيه اللي التكنولوجيا دي ممكن تعمله ليّا فعلاً؟» — سيناريوهات حقيقية ونتايج صريحة.', cta: 'تصفّح' },
        videos: { title: 'فيديوهات', kicker: 'Videos', body: 'نفس التجارب بالصوت والصورة — على قناة [[AdelTechTalks]].', cta: 'اتفرّج' },
        topics: { title: 'مواضيع', kicker: 'Topics', body: '', cta: 'كل المواضيع' },
      },
      allTopics: 'كل المواضيع',
      panelStatus: 'قريباً', panelTitle: 'Prompt Library',
      panelBody: 'نفس الـ[[prompts]] اللي بستخدمها — انسخ وعدّل واستخدم.',
      panelNote: 'كل [[prompt]] بيثبت نفسه في [[workflow]] حقيقي الأول. هنبدأ باللي ورا مشاريعي الحالية.',
      panelCta: 'ابعتلي لما يفتح',
    },
    playground: {
      label: 'Playground · try it yourself', aside: 'مبني بنفس أسلوب الـ[[Vibe Coding]]',
      headBefore: 'متقراش وبس — ', headEm: 'جرّب بنفسك', headAfter: '.',
      support: 'أدوات تفاعلية صغيرة ببنيها قدامكم — كل حاجة على الترابيزة دي طالعة من نفس الـ[[workflow]] اللي بتشوفوه في [[Vibe Coding]].',
      cta: 'افتح الـ[[Playground]]',
      toolIndex: (n) => `Tool ${String(n).padStart(2, '0')}`,
      status: { live: 'لايف', beta: 'Beta', 'in-build': 'قيد البناء', 'up-next': 'الجاي', 'with-prompts': 'With Prompt Library' },
      notify: 'ابعتلي عند الإطلاق', open: 'افتح',
      ruleFree: 'مجاني للتجربة', ruleFreeNote: '— حساب بس لو الأداة هتحفظ شغلك',
      rulePublic: 'مبني قدامكم', rulePublicNote: '— قصة بناء كل أداة في [[Vibe Coding]]',
      ruleDemos: 'من غير [[demos]] وهمية', ruleDemosNote: '— الأداة بتظهر هنا لما تقدر تفتحها فعلاً',
      empty: 'لسه مفيش حاجة مفتوحة. الترابيزة هي أول مكان الأدوات بتنزل فيه.',
    },
    about: {
      loop: ['Learn', 'Test', 'Build', 'Share'],
      headBefore: 'أهلاً، أنا عادل. ببساطة ', headEm: 'بحب التكنولوجيا', headAfter: '.',
      bio: 'بحوّل الأفكار لمشاريع حقيقية بالـ[[Vibe Coding]]، بجرّب الأجهزة اللي بستخدمها فعلاً، وبكتب عن كل حاجة تفاجئني في الطريق. [[Product Manager]] في شغلي — ومجرّب دايماً بطبيعتي.',
      socialLabel: 'AdelTechTalks on',
      subTitle: 'خد اللي بتعلّمه — قبل ما أظبّطه للنشر.',
      subBody: 'إيميل واحد لما يبقى في حاجة تستاهل وقتك: مشروع جديد، تجربة مفاجئة، أو [[prompt]] شغّال.',
      subPlaceholder: 'you@email.com', subButton: 'اشترك',
      subNote: 'من غير [[spam]] — تقدر تلغي الاشتراك في أي وقت.',
      subLoading: 'جاري الاشتراك…',
      subSuccess: 'انت معانا — بص على إيميلك للتأكيد.',
      subInvalid: 'الإيميل ده شكله مش مظبوط — تراجعه؟',
      subError: 'في حاجة اتكسرت عندي — تجرب تاني بعد دقيقة؟',
      subAlready: 'انت أصلاً في القايمة — تمام.',
    },
    footer: {
      umbrella: 'إزاي بستخدم التكنولوجيا عشان أبني وأبدع وأشتغل أذكى.',
      explore: 'استكشف', more: 'كمان', promptLibrary: 'Prompt Library · قريباً',
      rights: '© 2026 عادل — متبني بالـVibe Coding، طبعاً.',
    },
    vc: {
      hubKicker: 'Vibe Coding', hubTitle: 'بحوّل الأفكار لمشاريع حقيقية.',
      hubIntro: 'كل [[build]] في العلن — الفكرة، الأدوات، إيه اللي اتكسر، ووصل لفين.',
      featuredLabel: 'ببنيه دلوقتي', groupBuilds: 'Builds', groupExperiments: 'Experiments',
      seriesLabel: 'Series · بنبني في العلن', seriesStrip: 'Part 01 → Part 02 → …',
      status: {
        exploring: 'بستكشف', designing: 'بصمّم', building: 'ببنيه دلوقتي',
        testing: 'بجرّب', launched: 'لايف', paused: 'متوقف مؤقتًا',
      },
      stage: { idea: 'الفكرة', explore: 'الاستكشاف', design: 'التصميم', build: 'البناء', test: 'التجربة', launch: 'الإطلاق' },
      stageState: { done: 'تمّ', doneFirst: 'تمّت', now: 'دلوقتي', next: 'الجاي' },
      journeyLabel: 'رحلة الـ[[Build]] ده',
      toolsNote: 'بس الأدوات اللي استخدمتها فعلاً — من غير أي فضل مش ليا.',
      seeLive: 'شوفه لايف', openInPlayground: 'افتحه في الـ[[Playground]]',
      previous: 'الجزء اللي فات', next: 'الجزء الجاي', read: 'اقرأ الـ[[build]]',
      crossoverTitle: 'Crossover',
      crossoverToGear: 'الجزء بتاع الجهاز في القصة دي موجود في [[Gear]].',
      crossoverToBuild: 'الـ[[build]] اللي الجهاز ده خلّاه ممكن موجود في [[Vibe Coding]].',
      empty: 'أول [[build]] هيتنشر هنا أول ما يبقى في حاجة حقيقية تتعرض.',
      footnote: 'الصور حقيقية، أو القصة تستنى. مفيش حاجة هنا [[mock-up]].',
    },
  },
};

export const COPY: Record<Lang, Copy> = { en, ar };

/** The copy for one language. `const c = useCopy(lang)` then `c.nav.guides`. */
export function useCopy(lang: Lang): Copy {
  return COPY[lang];
}

/**
 * The same string with the [[term]] markers removed.
 *
 * Rich.astro turns a marker into a bidi-isolated element, which is right inside
 * the document — and impossible inside an ATTRIBUTE. A <title>, a meta
 * description, an alt or an aria-label is plain text, and a marker left in one
 * ships literal double brackets to Google and to screen readers.
 *
 * So: `Rich` in the body, `plain()` in an attribute. Base.astro applies this to
 * every title and description it emits, which covers the head of every page in
 * one place.
 */
export function plain(text: string): string {
  return text.replace(/\[\[(.+?)\]\]/g, '$1');
}
