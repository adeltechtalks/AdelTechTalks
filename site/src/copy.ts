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
    portraitAlt: 'Adel',
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
