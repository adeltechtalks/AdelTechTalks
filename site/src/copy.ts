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
    /* IA v2.0 — the two content pillars */
    vibeCoding: string; gear: string;
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
    /* ---- Website v2.x hero (frozen: Website Structure v2, frame 2a/2c) ----
       Three visitor-facing strings and two actions. `line3` and `nowBuilding`
       were the project-specific build line; the frozen hero has no such line,
       so both are gone rather than left empty — see the note in Hero.astro. */
    badge: string; line2: string;
    ctaPrimary: string; ctaSecondary: string;
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
    /* Desktop dropdowns + mobile accordion — Website Structure v2, frame 2e.
       The taxonomy is frozen: these are the exact entries, in the exact order,
       under the exact three pillars that carry a menu. */
    menu: {
      vibeCoding: { currentBuilds: string; experiments: string; buildStories: string; series: string; all: string };
      gear: {
        currentlyTesting: string; reviews: string; creatorGear: string;
        mobileComputing: string; cameras: string; gamingSetup: string; aiGear: string; all: string;
      };
      learn: {
        useCases: string; promptLibrary: string; guides: string; videos: string;
        browseByTopic: string; all: string;
      };
    };
    /* Homepage §2 — What I'm exploring now (orientation trio) */
    exploring: {
      kicker: string; title: string;
      building: { marker: string; title: string; body: string; terminal: string; cta: string };
      testing: { marker: string; title: string; body: string; caption: string; cta: string };
      learning: { marker: string; title: string; body: string; cta: string };
    };
    /* Homepage §7 — Latest (real published content only) */
    latestFeed: { kicker: string; title: string; viewAll: string };
    /* Homepage §3 — Vibe Coding in the Real World */
    realWorld: {
      label: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; ctaPrimary: string; ctaSecondary: string;
      foldLabel: string; foldStatus: string; foldJourney: string;
      featuredLabel: string; crossoverChip: string; statusChip: string;
      journeyLabel: string; upNextLabel: string;
      slotNote: string; paneLabels: string[];
      empty: string;
    };
    /* Homepage §3 — Gear, currently testing */
    gear: {
      label: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; ctaPrimary: string; ctaSecondary: string;
      deskLabel: string; deskQuestion: string; firstStory: string;
      featuredLabel: string; crossoverChip: string; crossoverNote: string;
      follow: string; alsoLabel: string;
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
      label: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; cta: string;
      rows: Record<'guides' | 'useCases' | 'videos' | 'topics', { title: string; kicker?: string; body: string; cta: string }>;
      allTopics: string;
      panelStatus: string; panelTitle: string; panelBody: string; panelNote: string;
      panelCta: string; panelCtaClosed: string; panelCopy: string;
    };
    /* Homepage §5 — Playground */
    playground: {
      label: string;
      headBefore: string; headEm: string; headAfter: string;
      support: string; cta: string;
      toolIndex: (n: number) => string;
      status: Record<'live' | 'beta' | 'in-build' | 'up-next' | 'with-prompts', string>;
      notify: string; open: string; opensIn: string; moreTools: string;
      empty: string;
    };
    /* Homepage §6 — About + Subscribe */
    about: {
      loop: string[];
      greeting: string; bio: string; socialLabel: string;
      subTitle: string; subBody: string; subPlaceholder: string; subButton: string; subNote: string;
      subLoading: string; subSuccess: string; subInvalid: string; subError: string; subAlready: string;
    };
    /* About page — Storyboard Edition */
    aboutPage: {
      kicker: string;
      greeting: string; lede: string; photoNote: string;
      journeyKicker: string; journeyTitle: string; journeyNote: string;
      worldsKicker: string; worldsTitle: string;
      dayLabel: string; dayTitle: string; dayLede: string; dayBody: string; dayCta: string;
      nightLabel: string; nightTitle: string;
      nightItems: Array<{ name: string; body: string }>;
      nightCta: string;
      toolsKicker: string; toolsTitle: string; toolsNote: string;
      interestsKicker: string; interestsTitle: string; interestsNote: string;
      studioKicker: string; studioTitle: string; studioBody: string; studioCta: string;
      studioNotes: string[];
      threadKicker: string;
      thread: Array<{ step: string; note: string }>;
      threadBody: string;
      closingTitle: string;
      cards: Array<{ name: string; body: string; href: string }>;
    };
    /* Footer */
    footer: {
      umbrella: string; explore: string; learn: string; channel: string;
      contact: string; promptLibrary: string; rights: string;
    };
    /* Build story + hub */
    vc: {
      hubKicker: string; hubTitle: string; hubIntro: string;
      featuredLabel: string; groupBuilds: string; groupExperiments: string;
      seriesLabel: string; seriesStrip: string;
      status: Record<'exploring' | 'designing' | 'building' | 'testing' | 'launched' | 'paused', string>;
      stage: Record<'idea' | 'explore' | 'design' | 'build' | 'test' | 'launch', string>;
      stageState: Record<'done' | 'doneFirst' | 'now' | 'next', string>;
      journeyLabel: string; toolsNote: string; seeLive: string; openInPlayground: string;
      /* Structural section labels on the Build Story template. */
      sessionTitle: string; toolsTitle: string; relatedTitle: string;
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
    vibeCoding: 'Vibe Coding',
    gear: 'Gear',
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
    badge: 'Vibe Coding · Real builds',
    line2: 'I build, test, and learn with technology — then share what works.',
    ctaPrimary: 'See what I’m building',
    ctaSecondary: 'Learn with me',
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
    /* The document title, not the page's visible kicker — the About page
       renders "About" as its overline from `ia.aboutPage.kicker`. In a tab or
       a search result "About" alone says nothing, so the title names its
       subject: "About Adel — AdelTechTalks". */
    title: 'About Adel',
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
    menu: {
      vibeCoding: {
        currentBuilds: 'Current Builds', experiments: 'Experiments',
        buildStories: 'Build Stories', series: 'Series', all: 'All Vibe Coding',
      },
      gear: {
        currentlyTesting: 'Currently Testing', reviews: 'Reviews', creatorGear: 'Creator Gear',
        mobileComputing: 'Mobile & Computing', cameras: 'Cameras',
        gamingSetup: 'Gaming & Setup', aiGear: 'AI-Powered Gear', all: 'All Gear',
      },
      learn: {
        useCases: 'Use Cases', promptLibrary: 'Prompt Library', guides: 'Guides',
        videos: 'Videos', browseByTopic: 'Browse by Topic', all: 'All Learn',
      },
    },
    exploring: {
      kicker: 'Right now', title: 'What I’m exploring now.',
      building: {
        marker: 'Building', title: 'Vibe Coding',
        body: 'Experiments, apps and workflows — built with AI, in the open.',
        terminal: '$ idea → prompt → build → ship_', cta: 'Enter Vibe Coding',
      },
      testing: {
        marker: 'Testing', title: 'Gear',
        body: 'Gadgets and creator tech I actually use.',
        caption: 'On the desk', cta: 'See the Gear',
      },
      learning: {
        marker: 'Learning', title: 'Learn',
        body: 'Prompts, techniques and lessons worth sharing.', cta: 'Start learning',
      },
    },
    latestFeed: { kicker: 'Latest', title: 'Fresh from the workbench.', viewAll: 'View all' },
    realWorld: {
      label: 'Vibe Coding',
      headBefore: 'What can I actually ', headEm: 'build', headAfter: ' with AI?',
      support: 'Real builds, shared while they happen.',
      ctaPrimary: 'Explore Vibe Coding', ctaSecondary: 'See all builds',
      foldLabel: 'From idea → live', foldStatus: 'Current',
      foldJourney: 'Idea → Prompt → Build → Ship',
      featuredLabel: 'Featured build', crossoverChip: 'Crossover · × Gear', statusChip: 'Build · in progress',
      journeyLabel: 'This build’s journey',
      upNextLabel: 'Up next',
      slotNote: 'Build workflow · slot is replaceable per featured build',
      paneLabels: ['ChatGPT', 'Claude Code', 'Live build'],
      empty: 'The first build goes up here as soon as there is something real to show.',
    },
    gear: {
      label: 'Gear',
      headBefore: 'Tech I’m actually ', headEm: 'using', headAfter: '.',
      support: 'Not spec sheets — real use, real outcomes.',
      ctaPrimary: 'Visit Gear', ctaSecondary: 'See all gear',
      deskLabel: 'On the desk', deskQuestion: 'What does it help me do?',
      firstStory: 'First story in testing',
      featuredLabel: 'Currently testing', crossoverChip: 'Vibe Coding crossover',
      crossoverNote: 'Crossover: this story also lives in Vibe Coding — the device enables the build.',
      follow: 'Follow this test', alsoLabel: 'Also testing',
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
      label: 'Learn',
      headBefore: 'Learn what ', headEm: 'I learn', headAfter: '.',
      support: 'Everything I figure out while testing and building — written up so you can use it today.',
      cta: 'Explore the library',
      rows: {
        guides: { title: 'Guides', body: 'Step-by-step, written so you can use it today.', cta: 'Read' },
        useCases: { title: 'Use Cases', body: '“What can this actually do for me?” — real scenarios, honest outcomes.', cta: 'Browse' },
        videos: { title: 'Videos', body: 'Watch it happen — builds, tests, walkthroughs.', cta: 'Watch' },
        topics: { title: 'Browse by Topic', body: '', cta: 'All topics' },
      },
      allTopics: 'All topics',
      panelStatus: 'Coming soon', panelTitle: 'Prompt Library',
      panelBody: 'Prompts I actually use — with context, not prompt dumps.',
      panelNote: '“Act as my code reviewer…”',
      panelCta: 'Open the library', panelCtaClosed: 'Get notified when it opens',
      panelCopy: 'Copy',
    },
    playground: {
      label: 'Playground',
      headBefore: 'Don’t just read it — ', headEm: 'try it', headAfter: '.',
      support: 'Small tools you can open right now, built with the same workflow I share.',
      cta: 'Open the Playground',
      toolIndex: (n) => `Tool ${String(n).padStart(2, '0')}`,
      status: { live: 'Live', beta: 'Beta', 'in-build': 'In build', 'up-next': 'Up next', 'with-prompts': 'With Prompt Library' },
      notify: 'Get notified at launch', open: 'Try it',
      opensIn: 'Opens in your browser', moreTools: 'More tools on the bench',
      empty: 'Nothing is open yet. The workbench is where the tools land first.',
    },
    about: {
      loop: ['Learn', 'Test', 'Build', 'Share'],
      greeting: 'Hi, I’m Adel.',
      bio: 'I learn, test, build — and share what actually works.',
      socialLabel: 'AdelTechTalks on',
      subTitle: 'The best thing I learned, tested, or built — straight to your inbox.',
      subBody: '',
      subPlaceholder: 'you@email.com', subButton: 'Subscribe',
      subNote: 'One email when it’s worth your time. Unsubscribe anytime.',
      subLoading: 'Subscribing…',
      subSuccess: 'You’re in — check your inbox to confirm.',
      subInvalid: 'That email doesn’t look right — mind checking it?',
      subError: 'Something broke on my end — try again in a minute?',
      subAlready: 'You’re already on the list — nice.',
    },
    aboutPage: {
      kicker: 'About',
      greeting: 'Hi, I’m Adel.',
      lede: 'I build with technology, test what’s new, learn constantly, and share what works.',
      photoNote: 'usually testing something',
      journeyKicker: 'My journey', journeyTitle: 'A few places shaped how I think.',
      journeyNote: 'Different places. Different lessons. Same curiosity.',
      worldsKicker: 'What I do', worldsTitle: 'Two worlds, one curiosity.',
      dayLabel: 'by day', dayTitle: 'Product',
      dayLede: 'Turning messy problems into useful products',
      dayBody: 'Strategy, discovery and shipping — the craft behind good experiences.',
      dayCta: 'Professional experience',
      nightLabel: 'after hours', nightTitle: 'Builder & creator',
      nightItems: [
        { name: 'Vibe Coding', body: 'Building ideas with AI-native tools — in the open.' },
        { name: 'AdelTechTalks', body: 'Testing tech, creating content, sharing what I learn.' },
        { name: 'AI & automation experiments', body: 'Exploring better ways to work and create.' },
      ],
      nightCta: 'See what I’m building',
      toolsKicker: 'Tools I actually use', toolsTitle: 'The toolbox.',
      toolsNote: 'Real tools only — added here as they earn a place in the workflow.',
      interestsKicker: 'What I’m into', interestsTitle: 'Curiosity, mapped.',
      interestsNote: 'gaming = recharge',
      studioKicker: 'The studio', studioTitle: 'Where a lot of this happens.',
      studioBody:
        'Mic on, camera rolling, something half-built on the screen. The creator brain never really switches off.',
      studioCta: 'The gear behind it',
      studioNotes: ['the mic', 'keyboard of choice'],
      threadKicker: 'The thread',
      thread: [
        { step: 'Learn', note: 'stay curious' },
        { step: 'Test', note: 'try it for real' },
        { step: 'Build', note: 'make something' },
        { step: 'Share', note: 'pass it on' },
      ],
      threadBody:
        'Learning beats pretending to know everything — so everything here is shared while it’s still being figured out.',
      closingTitle: 'Still curious. Still building.',
      cards: [
        { name: 'Vibe Coding', body: 'See what I’m building', href: '/vibe-coding' },
        { name: 'Gear', body: 'What’s on the desk', href: '/gear' },
        { name: 'Learn', body: 'Explore what I’m learning', href: '/learn' },
        { name: 'Playground', body: 'Try something', href: '/playground' },
      ],
    },
    footer: {
      umbrella: 'How I use technology to build, create, and work smarter.',
      explore: 'Explore', learn: 'Learn', channel: 'AdelTechTalks',
      contact: 'Contact', promptLibrary: 'Prompt Library · soon',
      rights: 'AdelTechTalks',
    },
    vc: {
      hubKicker: 'Vibe Coding', hubTitle: 'I turn ideas into launches.',
      hubIntro: 'Every build in the open — the idea, the tools, what broke, and where it got to.',
      featuredLabel: 'Now building', groupBuilds: 'Builds', groupExperiments: 'Experiments',
      /* A STRUCTURAL label, per the Vibe Coding Hub's "series hairline
         (structural labels only)". It used to read "Series · Building in
         public"; Website Structure v2 retires "Building in public" as brand
         language, and this was the last place it survived as visitor copy. It
         renders only once a build publishes, which is why the built pages were
         already clean of it — the string was live, just unreachable. */
      seriesLabel: 'Series', seriesStrip: 'Part 01 → Part 02 → …',
      status: {
        exploring: 'Exploring', designing: 'Designing', building: 'Now building',
        testing: 'Testing', launched: 'Launched', paused: 'Paused',
      },
      stage: { idea: 'Idea', explore: 'Explore', design: 'Design', build: 'Build', test: 'Test', launch: 'Launch' },
      stageState: { done: 'Done', doneFirst: 'Done', now: 'Now', next: 'Next' },
      journeyLabel: 'This build’s journey',
      toolsNote: 'Only the tools I actually used — no unearned credit.',
      sessionTitle: 'From the session', toolsTitle: 'What I built it with', relatedTitle: 'More builds',
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
    vibeCoding: 'Vibe Coding',
    gear: 'Gear',
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
    badge: '[[Vibe Coding]] · [[Real builds]]',
    line2: 'ببني وبجرب وبتعلم بالـ[[Tech]] — وبعدين بشارك اللي بينجح.',
    ctaPrimary: 'شوف اللي ببنيه',
    ctaSecondary: 'اتعلم معايا',
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
    /* The navbar labels are the authored AR strings from the design of record
       (frame 2c): the two pillar names and Playground stay English, Learn and
       About are Arabic. */
    nav: { vibeCoding: 'Vibe Coding', gear: 'Gear', learn: 'اتعلم', playground: 'Playground', about: 'عنّي', subscribe: 'اشترك' },
    menu: {
      vibeCoding: {
        currentBuilds: 'الـ[[Builds]] الحالية', experiments: 'تجارب',
        buildStories: 'قصص الـ[[Build]]', series: 'سلاسل', all: 'كل الـ[[Vibe Coding]]',
      },
      gear: {
        currentlyTesting: 'بجرّبه دلوقتي', reviews: 'مراجعات', creatorGear: '[[Creator Gear]]',
        mobileComputing: 'موبايل وكمبيوتر', cameras: 'كاميرات',
        gamingSetup: '[[Gaming]] و[[Setup]]', aiGear: '[[Gear]] بالـ[[AI]]', all: 'كل الـ[[Gear]]',
      },
      learn: {
        useCases: '[[Use Cases]]', promptLibrary: '[[Prompt Library]]', guides: '[[Guides]]',
        videos: 'فيديوهات', browseByTopic: 'تصفّح بالموضوع', all: 'كل اللي بتعلمه',
      },
    },
    exploring: {
      kicker: 'Right now', title: 'بجرب إيه دلوقتي؟',
      building: {
        marker: 'Building', title: 'Vibe Coding',
        body: 'تجارب وتطبيقات و[[workflows]] — ببنيها بالـ[[AI]] قدام الناس.',
        terminal: '$ idea → prompt → build → ship_', cta: 'ادخل [[Vibe Coding]]',
      },
      testing: {
        marker: 'Testing', title: 'العتاد',
        body: 'أجهزة و[[creator tech]] بستخدمها فعلًا.',
        caption: 'On the desk', cta: 'شوف الـ[[Gear]]',
      },
      learning: {
        marker: 'Learning', title: 'تعلّم',
        body: '[[Prompts]] وطرق شغل ودروس تستاهل تتشارك.', cta: 'ابدأ من هنا',
      },
    },
    latestFeed: { kicker: 'Latest', title: 'آخر حاجات من الورشة.', viewAll: 'شوف الكل' },
    realWorld: {
      label: 'Vibe Coding',
      headBefore: 'إيه اللي أقدر أبنيه بالـ', headEm: 'AI', headAfter: '؟',
      support: '[[Builds]] حقيقية، بشاركها أول بأول.',
      ctaPrimary: 'اكتشف الـ[[Vibe Coding]]', ctaSecondary: 'شوف كل المشاريع',
      foldLabel: 'من الفكرة للإطلاق', foldStatus: 'حاليًا',
      foldJourney: 'فكرة ← [[Prompt]] ← [[Build]] ← إطلاق',
      featuredLabel: 'Featured build', crossoverChip: 'Crossover · × Gear', statusChip: 'بناء · شغّال دلوقتي',
      journeyLabel: 'رحلة الـ[[Build]] ده',
      upNextLabel: 'الجاي بعده',
      slotNote: 'المكان بيتبدل مع كل [[Build]] جديد',
      paneLabels: ['ChatGPT', 'Claude Code', 'Live build'],
      empty: 'أول [[build]] هيتنشر هنا أول ما يبقى في حاجة حقيقية تتعرض.',
    },
    gear: {
      label: 'Gear',
      headBefore: '[[Tech]] بستخدمها ', headEm: 'فعلًا', headAfter: '.',
      support: 'مش مواصفات — استخدام حقيقي ونتايج حقيقية.',
      ctaPrimary: 'شوف الـ[[Gear]]', ctaSecondary: 'شوف كل الـ[[Gear]]',
      deskLabel: 'On the desk', deskQuestion: 'هتساعدني أعمل إيه؟',
      firstStory: 'أول قصة تحت التجربة',
      featuredLabel: 'بجرّبه دلوقتي', crossoverChip: 'Vibe Coding crossover',
      crossoverNote: 'Crossover: القصة دي موجودة كمان في [[Vibe Coding]] — الجهاز نفسه هو اللي بيخلّي البناء ممكن.',
      follow: 'تابع التجربة', alsoLabel: 'بجرّب كمان',
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
      label: 'Learn',
      headBefore: 'اتعلم اللي أنا ', headEm: 'بتعلمه', headAfter: '.',
      support: 'كل اللي بكتشفه وأنا بجرّب وببني — مكتوب عشان تستخدمه من النهارده.',
      cta: 'شوف المكتبة كلها',
      rows: {
        guides: { title: '[[Guides]]', body: 'خطوة بخطوة، من غير حشو.', cta: 'اقرا' },
        useCases: { title: '[[Use Cases]]', body: '«الحاجة دي هتعمللي إيه فعلًا؟» — سيناريوهات حقيقية ونتايج صريحة.', cta: 'تصفّح' },
        videos: { title: 'فيديوهات', body: 'اتفرج على البناء والتجارب والشرح — بالصوت والصورة.', cta: 'اتفرج' },
        topics: { title: 'تصفّح بالموضوع', body: '', cta: 'كل المواضيع' },
      },
      allTopics: 'كل المواضيع',
      panelStatus: 'قريباً', panelTitle: 'Prompt Library',
      panelBody: '[[Prompts]] بستخدمها فعلًا — ومعاها إمتى وليه أستخدمها.',
      panelNote: '"Act as my code reviewer…"',
      panelCta: 'افتح المكتبة', panelCtaClosed: 'ابعتلي لما يفتح',
      panelCopy: 'Copy',
    },
    playground: {
      label: 'Playground',
      headBefore: 'متقراش وبس — ', headEm: 'جرّبها بنفسك', headAfter: '.',
      support: '[[Tools]] صغيرة تقدر تفتحها دلوقتي — مبنية بنفس الـ[[workflow]] اللي بشاركه.',
      cta: 'افتح الـ[[Playground]]',
      toolIndex: (n) => `Tool ${String(n).padStart(2, '0')}`,
      status: { live: 'لايف', beta: 'Beta', 'in-build': 'قيد البناء', 'up-next': 'الجاي', 'with-prompts': 'With Prompt Library' },
      notify: 'ابعتلي عند الإطلاق', open: 'جرّبها',
      opensIn: 'بتشتغل من البراوزر', moreTools: 'في [[tools]] تانية في السكة',
      empty: 'لسه مفيش حاجة مفتوحة. الترابيزة هي أول مكان الأدوات بتنزل فيه.',
    },
    about: {
      loop: ['Learn', 'Test', 'Build', 'Share'],
      greeting: 'أهلاً، أنا عادل.',
      bio: 'بتعلم وبجرب وببني — وبشارك اللي بينجح فعلًا.',
      socialLabel: 'AdelTechTalks on',
      subTitle: 'أحسن حاجة اتعلمتها أو جربتها أو بنيتها — هبعتهالك على الإيميل.',
      subBody: '',
      subPlaceholder: 'you@email.com', subButton: 'اشترك',
      subNote: 'إيميل واحد بس لما يكون في حاجة تستاهل وقتك. تقدر تلغي في أي وقت.',
      /* The five form states, authored per ARABIC_VOICE_GUIDE §UI states. */
      subLoading: 'جاري الاشتراك…',
      subSuccess: 'تمام، إنت كده معانا.',
      subInvalid: 'الإيميل ده شكله مش مظبوط — تراجعه؟',
      subError: 'حصلت مشكلة. جرّب تاني كمان شوية.',
      subAlready: 'إنت أصلًا في القايمة — تمام.',
    },
    aboutPage: {
      kicker: 'About',
      greeting: 'أهلاً، أنا عادل.',
      lede: 'ببني بالـ[[Tech]]، وبجرب كل جديد، وبتعلم على طول — وبشارك اللي بينجح.',
      photoNote: 'غالبًا بجرب حاجة',
      journeyKicker: 'My journey', journeyTitle: 'شوية أماكن شكّلت طريقة تفكيري.',
      journeyNote: 'أماكن مختلفة، ودروس مختلفة — والفضول هو هو.',
      worldsKicker: 'What I do', worldsTitle: 'عالمين، وفضول واحد.',
      dayLabel: 'بالنهار', dayTitle: 'Product',
      dayLede: 'بحوّل المشاكل المعقدة لمنتجات مفيدة',
      dayBody: 'استراتيجية واكتشاف وإطلاق — الشغل اللي ورا أي تجربة حلوة.',
      dayCta: 'خبرتي المهنية',
      nightLabel: 'بعد الشغل', nightTitle: 'ببني وبعمل content',
      nightItems: [
        { name: 'Vibe Coding', body: 'ببني الأفكار بأدوات [[AI]] — قدام الناس.' },
        { name: 'AdelTechTalks', body: 'بجرب الـ[[Tech]] وبعمل [[content]] وبشارك اللي بتعلمه.' },
        { name: 'تجارب [[AI]] و[[Automation]]', body: 'بدوّر على طرق أحسن للشغل والإبداع.' },
      ],
      nightCta: 'شوف اللي ببنيه',
      toolsKicker: 'Tools I actually use', toolsTitle: 'شنطة العدة.',
      toolsNote: '[[Tools]] حقيقية بس — بتدخل هنا لما تكسب مكانها في الـ[[workflow]].',
      interestsKicker: 'What I’m into', interestsTitle: 'الحاجات اللي بحبها.',
      interestsNote: 'الـ[[Gaming]] = شحن بطارية',
      studioKicker: 'The studio', studioTitle: 'هنا بيحصل معظم الشغل.',
      studioBody:
        'المايك شغال، والكاميرا بتسجل، وحاجة نص مخلّصة على الشاشة. دماغ الـ[[creator]] مش بتقفل أصلًا.',
      studioCta: 'الـ[[Gear]] ورا المشهد',
      studioNotes: ['المايك', 'الكيبورد المفضل'],
      threadKicker: 'The thread',
      thread: [
        { step: 'اتعلم', note: 'خليك فضولي' },
        { step: 'جرّب', note: 'جرّبها بجد' },
        { step: 'ابني', note: 'اعمل حاجة' },
        { step: 'شارك', note: 'عدّيها للناس' },
      ],
      threadBody:
        'إني أتعلم أحسن من إني أعمل نفسي عارف كل حاجة — عشان كده كل اللي هنا بيتشارك وهو لسه بيتاكتشف.',
      closingTitle: 'لسه فضولي. ولسه ببني.',
      cards: [
        { name: 'Vibe Coding', body: 'شوف اللي ببنيه', href: '/vibe-coding' },
        { name: 'Gear', body: 'إيه اللي على المكتب دلوقتي', href: '/gear' },
        { name: 'اتعلم', body: 'شوف اللي بتعلمه', href: '/learn' },
        { name: 'Playground', body: 'جرّب حاجة', href: '/playground' },
      ],
    },
    footer: {
      umbrella: 'إزاي بستخدم التكنولوجيا عشان أبني وأبدع وأشتغل أذكى.',
      explore: 'Explore', learn: 'Learn', channel: 'AdelTechTalks',
      contact: 'كلمني', promptLibrary: 'Prompt Library · قريباً',
      rights: 'AdelTechTalks',
    },
    vc: {
      hubKicker: 'Vibe Coding', hubTitle: 'بحوّل الأفكار لمشاريع حقيقية.',
      hubIntro: 'كل [[build]] في العلن — الفكرة، الأدوات، إيه اللي اتكسر، ووصل لفين.',
      featuredLabel: 'ببنيه دلوقتي', groupBuilds: 'Builds', groupExperiments: 'Experiments',
      seriesLabel: 'Series', seriesStrip: 'Part 01 → Part 02 → …',
      status: {
        exploring: 'بستكشف', designing: 'بصمّم', building: 'ببنيه دلوقتي',
        testing: 'بجرّب', launched: 'لايف', paused: 'متوقف مؤقتًا',
      },
      stage: { idea: 'الفكرة', explore: 'الاستكشاف', design: 'التصميم', build: 'البناء', test: 'التجربة', launch: 'الإطلاق' },
      stageState: { done: 'تمّ', doneFirst: 'تمّت', now: 'دلوقتي', next: 'الجاي' },
      journeyLabel: 'رحلة الـ[[Build]] ده',
      toolsNote: 'بس الأدوات اللي استخدمتها فعلاً — من غير أي فضل مش ليا.',
      sessionTitle: 'من الشغل نفسه', toolsTitle: 'بنيته بإيه', relatedTitle: 'مشاريع تانية',
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
