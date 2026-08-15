/* =============================================================================
   The editorial index (§14 "Latest", Phase 1.1 "Unified Product Ecosystem")
   =============================================================================
   §14: the Latest section "should not be limited technically to one content
   type if the current architecture can cleanly support multiple types."

   So everything publishable — guides, articles, use cases, prompts, videos — is
   normalised into one `Entry` shape and sorted together. Phase 1.1 added three
   of those five without touching a single page component, which is the whole
   point of the shape.

   Adding a sixth type later (a podcast episode, a project log) means adding one
   loader here; no page changes.
   ========================================================================== */

import { getCollection, type CollectionEntry } from 'astro:content';
import { PILLAR_TO_TOPIC } from './topics';
import { videos as configVideos, topics } from '../site.config';
import type { Lang } from '../i18n';

export type EntryKind = 'guide' | 'article' | 'use-case' | 'prompt' | 'video';

export interface Entry {
  kind: EntryKind;
  slug: string;
  title: string;
  description: string;
  date: Date;
  updated?: Date;
  topic?: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  minutes?: number;
  featured: boolean;
  href: string;
  /* Phase 1.1 — which build narrative this belongs to, and its running order. */
  series?: string;
  part?: number;
  /* Videos only. The YouTube ID is what a thumbnail URL needs, and for a
     structured video the entry's `slug` is the page slug, not the video. */
  youtubeId?: string;
  /* Links off-site. Videos in the config array do; on-site video pages do not. */
  external?: boolean;
}

type Editorial =
  | CollectionEntry<'guides'>
  | CollectionEntry<'articles'>
  | CollectionEntry<'useCases'>
  | CollectionEntry<'prompts'>
  | CollectionEntry<'videos'>;

/* Resolved at build time: is there anything in a given collection at all?
   Astro logs a warning for every getCollection() call against an empty
   collection, once per page, which buries real warnings in the build output.
   Checking first is silent, and an empty section is the correct output rather
   than a build problem.

   import.meta.glob needs a literal pattern, so this is one line per collection
   rather than a loop. */
const HAS = {
  articles: Object.keys(import.meta.glob('../content/articles/**/*.md')).length > 0,
  useCases: Object.keys(import.meta.glob('../content/use-cases/**/*.md')).length > 0,
  prompts: Object.keys(import.meta.glob('../content/prompts/**/*.md')).length > 0,
  videos: Object.keys(import.meta.glob('../content/videos/**/*.md')).length > 0,
  courses: Object.keys(import.meta.glob('../content/courses/**/*.md')).length > 0,
};

/* The URL segment each kind lives under. One place, so a route rename is one
   edit and not a hunt through five components. */
const BASE: Record<Exclude<EntryKind, 'video'> | 'video', string> = {
  guide: 'guides',
  article: 'articles',
  'use-case': 'use-cases',
  prompt: 'prompts',
  video: 'videos',
};

/** A published piece's effective topic: `topic`, else the legacy pillar. */
function topicOf(data: Editorial['data']): string | undefined {
  if (data.topic) return data.topic;
  if (data.pillar) return PILLAR_TO_TOPIC[data.pillar];
  return undefined;
}

function toEntry(item: Editorial, kind: EntryKind, lang: Lang): Entry {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return {
    kind,
    slug: item.id,
    title: item.data.title,
    description: item.data.description,
    date: item.data.date,
    updated: item.data.updated,
    topic: topicOf(item.data),
    tags: item.data.tags,
    cover: item.data.cover,
    coverAlt: item.data.coverAlt,
    minutes: item.data.minutes,
    featured: item.data.featured,
    series: item.data.series,
    part: item.data.part,
    youtubeId: 'youtubeId' in item.data ? item.data.youtubeId : undefined,
    href: `${prefix}/${BASE[kind]}/${item.id}/`,
  };
}

/** Published guides for one language, newest first. */
export async function getGuides(lang: Lang): Promise<Entry[]> {
  const items = await getCollection('guides', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'guide', lang)).sort(byDate);
}

/**
 * Published articles for one language, newest first.
 *
 * The articles collection is deliberately empty right now — the model and the
 * template exist so that "Latest" is genuinely multi-type (§14), but no
 * articles have been written, and inventing one to satisfy the loader would be
 * fabricating content. Drop a .md file into src/content/articles/ and every
 * surface picks it up with no other change.
 */
export async function getArticles(lang: Lang): Promise<Entry[]> {
  if (!HAS.articles) return [];
  const items = await getCollection('articles', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'article', lang)).sort(byDate);
}

/** Published use cases for one language, newest first. */
export async function getUseCases(lang: Lang): Promise<Entry[]> {
  if (!HAS.useCases) return [];
  const items = await getCollection('useCases', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'use-case', lang)).sort(byDate);
}

/** Published prompts for one language, newest first. */
export async function getPrompts(lang: Lang): Promise<Entry[]> {
  if (!HAS.prompts) return [];
  const items = await getCollection('prompts', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'prompt', lang)).sort(byDate);
}

/**
 * Structured videos — the ones with a page of their own.
 *
 * Kept separate from `getVideos()` below, which returns the simple config-array
 * videos that link straight out to YouTube. A structured video is an on-site
 * page and is NOT marked external.
 */
export async function getVideoPages(lang: Lang): Promise<Entry[]> {
  if (!HAS.videos) return [];
  const items = await getCollection('videos', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'video', lang)).sort(byDate);
}

/**
 * Videos declared in site.config.ts, as entries.
 * A video has no `date` until one is set there, so undated videos fall to the
 * end of the feed rather than jumping to the top with `new Date()`.
 */
export function getVideos(): Entry[] {
  return configVideos.map((v) => ({
    kind: 'video' as const,
    slug: v.id,
    title: v.title,
    description: v.meta ?? '',
    date: v.date ? new Date(v.date) : new Date(0),
    topic: v.topic,
    tags: [],
    featured: false,
    youtubeId: v.id,
    href: `https://www.youtube.com/watch?v=${v.id}`,
    external: true,
  }));
}

/** Everything publishable in one language, newest first. */
export async function getLatest(lang: Lang, limit?: number): Promise<Entry[]> {
  const all = [
    ...(await getGuides(lang)),
    ...(await getArticles(lang)),
    ...(await getUseCases(lang)),
    ...(await getPrompts(lang)),
    ...(await getVideoPages(lang)),
    ...getVideos(),
  ].sort(byDate);
  return limit ? all.slice(0, limit) : all;
}

/**
 * Everything in one series, in reading order.
 *
 * `part` is what makes a series navigable — it gives a first and a next. Pieces
 * without one keep their date order and fall in behind the numbered ones, so a
 * series stays coherent while it is still being written.
 */
export async function getSeriesEntries(lang: Lang, seriesId: string): Promise<Entry[]> {
  const all = (await getLatest(lang)).filter((e) => e.series === seriesId);
  return all.sort((a, b) => {
    if (a.part != null && b.part != null) return a.part - b.part;
    if (a.part != null) return -1;
    if (b.part != null) return 1;
    return byDate(a, b);
  });
}

function byDate(a: Entry, b: Entry) {
  return b.date.valueOf() - a.date.valueOf();
}

/** How many published pieces sit under each topic, for the Topics index. */
export async function countByTopic(lang: Lang): Promise<Record<string, number>> {
  const all = await getLatest(lang);
  const counts: Record<string, number> = {};
  for (const t of topics) counts[t.id] = 0;
  for (const e of all) {
    if (e.topic && e.topic in counts) counts[e.topic] += 1;
  }
  return counts;
}

/** How many published pieces sit under each kind, for the Learn Hub. */
export async function countByKind(lang: Lang): Promise<Record<string, number>> {
  const all = await getLatest(lang);
  const counts: Record<string, number> = {};
  for (const e of all) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
  return counts;
}

/** Everything under one topic. */
export async function getByTopic(lang: Lang, topicId: string): Promise<Entry[]> {
  return (await getLatest(lang)).filter((e) => e.topic === topicId);
}

/** Resolve `related:` slugs against every collection. */
export async function getRelated(lang: Lang, slugs: string[]): Promise<Entry[]> {
  if (slugs.length === 0) return [];
  const all = await getLatest(lang);
  return slugs.map((s) => all.find((e) => e.slug === s)).filter((e): e is Entry => Boolean(e));
}

/**
 * Find one piece by its ENGLISH slug, in whichever language is being rendered.
 *
 * A translated file has its own slug — the Arabic GearNest case study is
 * `gearnest-ar`, not `gearnest` — so config that names a piece (the series'
 * `caseStudy`, a project's `caseStudy`) has to resolve through `translationOf`
 * rather than by string-matching the slug. Guessing `${slug}-${lang}` happens
 * to work today and breaks the first time a translation is named differently.
 */
export async function findByHubSlug(
  kind: EntryKind,
  hubSlug: string,
  lang: Lang
): Promise<Entry | undefined> {
  const collection = COLLECTION_OF[kind];
  if (!HAS_COLLECTION[collection]) return undefined;
  const items = await getCollection(
    collection,
    ({ data }) => !data.draft && data.lang === lang
  );
  const match = items.find((i) => i.id === hubSlug || i.data.translationOf === hubSlug);
  return match ? toEntry(match as Editorial, kind, lang) : undefined;
}

/** Resolve prompt slugs specifically — used by a video page's prompt list. */
export async function getPromptsBySlug(lang: Lang, slugs: string[]): Promise<Entry[]> {
  if (slugs.length === 0) return [];
  const all = await getPrompts(lang);
  return slugs.map((s) => all.find((e) => e.slug === s)).filter((e): e is Entry => Boolean(e));
}

/** The topic record for an id, in one language. */
export function findTopic(id?: string) {
  return id ? topics.find((t) => t.id === id) : undefined;
}

/* -----------------------------------------------------------------------------
   Which languages a specific piece actually exists in
   -----------------------------------------------------------------------------
   Index pages exist in both languages, so a mechanical "prefix the path with
   /ar" is the right alternate for them. A GUIDE is different: an Arabic guide
   is a separate file with its own slug, linked by `translationOf`. Claiming
   /ar/guides/<english-slug>/ as an alternate for an English guide advertises a
   URL that 404s, which is worse for search than having no alternate at all —
   and it makes the language switch in the header a dead end.

   So detail pages ask this instead, and get back only the languages the piece
   has genuinely been written in.
   -------------------------------------------------------------------------- */

type TranslatableCollection = 'guides' | 'articles' | 'useCases' | 'prompts' | 'videos';

const COLLECTION_OF: Record<Exclude<EntryKind, never>, TranslatableCollection> = {
  guide: 'guides',
  article: 'articles',
  'use-case': 'useCases',
  prompt: 'prompts',
  video: 'videos',
};

const HAS_COLLECTION: Record<TranslatableCollection, boolean> = {
  guides: true, // at least one guide always ships
  articles: HAS.articles,
  useCases: HAS.useCases,
  prompts: HAS.prompts,
  videos: HAS.videos,
};

export interface Alternate {
  lang: Lang;
  href: string;
}

/**
 * Every language version of one piece, as root-relative paths.
 * Always includes the piece itself. Returns a single entry when nothing has
 * been translated, which is the common and correct case.
 */
export async function translationsOf(
  kind: EntryKind,
  slug: string,
  lang: Lang
): Promise<Alternate[]> {
  const collection = COLLECTION_OF[kind];
  const prefix = (l: Lang) => (l === 'en' ? '' : `/${l}`);
  const self: Alternate = { lang, href: `${prefix(lang)}/${BASE[kind]}/${slug}/` };

  if (!HAS_COLLECTION[collection]) return [self];

  const all = await getCollection(collection, ({ data }) => !data.draft);
  const mine = all.find((i) => i.id === slug && i.data.lang === lang);
  /* The English slug is the hub both sides point at: an Arabic file names it in
     `translationOf`, and an English file is named by one. */
  const hub = mine?.data.translationOf ?? slug;

  const found: Alternate[] = [self];
  for (const item of all) {
    if (item.id === slug && item.data.lang === lang) continue;
    const linked = item.data.translationOf === hub || item.id === hub;
    if (!linked) continue;
    const l = item.data.lang as Lang;
    if (found.some((f) => f.lang === l)) continue;
    found.push({ lang: l, href: `${prefix(l)}/${BASE[kind]}/${item.id}/` });
  }
  return found;
}

/** Whether any course has been written yet. Nothing routes to them either way. */
export const HAS_COURSES = HAS.courses;
