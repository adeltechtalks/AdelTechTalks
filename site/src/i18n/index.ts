/* =============================================================================
   Bilingual routing — English (LTR) and Arabic (RTL)
   =============================================================================
   §10: "Both should feel like first-class experiences. Do not treat Arabic as a
   visual afterthought."

   URL shape
   ---------
     /            /about            /guides          → English
     /ar/         /ar/about         /ar/guides       → Arabic

   English keeps the bare paths. That is deliberate and it is an SEO decision,
   not an aesthetic one (§26): every URL that is live today stays exactly where
   it is. Arabic is added alongside, never on top.
   ========================================================================== */

export const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

/** Display name of each language, written in that language. */
export const LANG_NAMES: Record<Lang, string> = {
  en: 'English',
  ar: 'العربية',
};

/** Writing direction. Used for <html dir> and for anything that must flip. */
export const LANG_DIR: Record<Lang, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

/**
 * The BCP-47 tag that goes in <html lang> and in hreflang.
 * Arabic is tagged plain `ar`: the copy is Modern Standard Arabic, not a
 * regional variant, and a narrower tag would wrongly exclude readers.
 */
export const LANG_TAG: Record<Lang, string> = {
  en: 'en',
  ar: 'ar',
};

/** Which language a URL belongs to. Anything not under /ar/ is English. */
export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return (LANGS as readonly string[]).includes(first) && first !== DEFAULT_LANG
    ? (first as Lang)
    : DEFAULT_LANG;
}

/**
 * Take a language-neutral path (`/guides/`) and produce the path for `lang`.
 * Always returns a trailing slash, which is what the rest of the site uses and
 * what Cloudflare's static handler expects.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = '/' + path.replace(/^\/+|\/+$/g, '');
  const base = lang === DEFAULT_LANG ? clean : `/${lang}${clean === '/' ? '' : clean}`;
  return base.endsWith('/') ? base : base + '/';
}

/**
 * The reverse: strip the language prefix off a real URL pathname so it can be
 * re-localised. Used by the language switcher, which must land the reader on
 * the SAME page in the other language rather than dumping them on the homepage.
 */
export function neutralPath(pathname: string): string {
  const stripped = pathname.replace(/^\/(ar)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/** Every language version of the current page — for <link rel="alternate">. */
export function alternates(pathname: string, siteUrl: string) {
  const neutral = neutralPath(pathname);
  return LANGS.map((lang) => ({
    lang,
    hreflang: LANG_TAG[lang],
    href: new URL(localizePath(neutral, lang), siteUrl).href,
  }));
}

/**
 * Format a date in the reader's language.
 * Arabic uses Western digits (`ar` with `latn` numbering) because §11 keeps
 * numerals Western in both languages — a spec sheet and a date should not use
 * two different digit systems on the same page.
 */
export function formatDate(date: Date, lang: Lang, long = false): string {
  const locale = lang === 'ar' ? 'ar-u-nu-latn' : 'en-US';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: long ? 'long' : 'short',
    day: 'numeric',
  });
}
