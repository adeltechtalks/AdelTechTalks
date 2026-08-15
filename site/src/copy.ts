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

export interface Copy {
  nav: { guides: string; topics: string; about: string; newsletter: string; playground: string; work: string };
  common: {
    skip: string; home: string; readMore: string; allGuides: string; allTopics: string;
    minutes: (n: number) => string; updated: string; published: string; backHome: string;
    languageSwitch: string; menuOpen: string; menuClose: string; comingSoon: string;
    signIn: string; profile: string;
  };
  hero: {
    identity: string; loveTechGloss: string; positioning: string; body: string;
    pattern: string[]; primaryCta: string; secondaryCta: string; portraitAlt: string;
  };
  explore: { title: string; intro: string };
  latest: { title: string; intro: string; empty: string; kind: Record<'guide' | 'article' | 'video', string> };
  guides: {
    title: string; intro: string; indexTitle: string; indexIntro: string; empty: string;
    downloadLabel: string; relatedTitle: string;
  };
  prompts: { title: string; intro: string; cta: string };
  building: { title: string; intro: string; visit: string };
  videos: { title: string; intro: string; watch: string; empty: string };
  gearnest: { eyebrow: string; title: string; body: string; cta: string };
  newsletter: {
    title: string; intro: string; label: string; placeholder: string; submit: string;
    note: string; consent: string; success: string; already: string; invalid: string;
    error: string; sending: string; pageTitle: string; pageIntro: string;
  };
  signoff: { title: string; body: string; cta: string; signature: string };
  about: { title: string; intro: string; workTitle: string; contextTitle: string };
  topics: { title: string; intro: string; countLabel: (n: number) => string; empty: string };
  notFound: { title: string; body: string; guidesCta: string };
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
  },
  hero: {
    identity: 'Adel',
    loveTechGloss: '',
    positioning: 'Product Manager · AI Enthusiast · Builder · Lifelong Learner',
    body:
      'Product Manager at Amazon. I spend my own time pulling AI apart to see how it works, building things with it, and writing down what actually held up.',
    pattern: ['I learn it.', 'I test it.', 'I build with it.', 'I share it.'],
    primaryCta: 'Start with the guides',
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
  prompts: {
    title: 'Prompt Library',
    intro:
      'The prompts I actually reuse — for product work, research, writing and building. Being organised into something worth publishing.',
    cta: 'Tell me when it opens',
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
    },
  gearnest: {
    eyebrow: 'A separate thing I’m building',
    title: 'GearNest',
    body:
      'GearNest is its own brand with its own product, its own voice and its own roadmap. It lives here as a link, not as a section of my identity.',
    cta: 'Go to GearNest',
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
  },
  hero: {
    identity: 'عادل',
    loveTechGloss: 'أحب التقنية، وأحب أن أفهم كيف تعمل.',
    positioning: '[[Product Manager]] · [[AI Enthusiast]] · باني ومجرِّب · متعلّم مدى الحياة',
    body:
      '[[Product Manager]] في [[Amazon]]. وفي وقتي الخاص أفكّك الـ[[AI]] لأفهم كيف يشتغل، أبني به أشياء حقيقية، وأكتب ما صمد منها فعلاً.',
    pattern: ['أتعلّمها.', 'أجرّبها.', 'أبني بها.', 'أشاركها.'],
    primaryCta: 'ابدأ من الأدلة',
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
  prompts: {
    title: '[[Prompt Library]]',
    intro:
      'الـ[[prompts]] التي أستخدمها فعلاً — في الـ[[Product]] والبحث والكتابة والبناء. أرتّبها الآن لتصبح شيئاً يستحق النشر.',
    cta: 'أخبرني حين تُفتح',
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
  },
  gearnest: {
    eyebrow: 'مشروع منفصل أبنيه',
    title: '[[GearNest]]',
    body:
      '[[GearNest]] علامة مستقلة بمنتجها وصوتها وخارطة طريقها. مكانها هنا رابط، لا قسم من هويتي.',
    cta: 'انتقل إلى [[GearNest]]',
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
