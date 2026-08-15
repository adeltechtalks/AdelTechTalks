/* =============================================================================
   The editorial index (§14 "Latest")
   =============================================================================
   §14: the Latest section "should not be limited technically to one content
   type if the current architecture can cleanly support multiple types."

   So everything publishable — guides, articles, videos — is normalised into
   one `Entry` shape and sorted together. Adding a fourth type later (a podcast
   episode, a project log) means adding one loader here; no page changes.
   ========================================================================== */

import { getCollection, type CollectionEntry } from 'astro:content';
import { PILLAR_TO_TOPIC } from './topics';
import { videos, topics } from '../site.config';
import type { Lang } from '../i18n';

export type EntryKind = 'guide' | 'article' | 'video';

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
  /* Videos link out; everything else stays on the site. */
  external?: boolean;
}

type Editorial = CollectionEntry<'guides'> | CollectionEntry<'articles'>;

/* Resolved at build time: is there anything in src/content/articles/ at all?
   Astro logs a warning for every getCollection() call against an empty
   collection, once per page, which buries real warnings in the build output.
   Checking first is silent, and an empty Articles section is the correct
   output rather than a build problem. */
const HAS_ARTICLES =
  Object.keys(import.meta.glob('../content/articles/**/*.md')).length > 0;

/** A published piece's effective topic: `topic`, else the legacy pillar. */
function topicOf(data: Editorial['data']): string | undefined {
  if (data.topic) return data.topic;
  if (data.pillar) return PILLAR_TO_TOPIC[data.pillar];
  return undefined;
}

function toEntry(item: Editorial, kind: 'guide' | 'article', lang: Lang): Entry {
  const base = kind === 'guide' ? 'guides' : 'articles';
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
    href: `${prefix}/${base}/${item.id}/`,
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
  if (!HAS_ARTICLES) return [];
  const items = await getCollection('articles', ({ data }) => !data.draft && data.lang === lang);
  return items.map((i) => toEntry(i, 'article', lang)).sort(byDate);
}

/**
 * Videos, as entries.
 * A video has no `date` until one is set in site.config.ts, so undated videos
 * fall to the end of the feed rather than jumping to the top with `new Date()`.
 */
export function getVideos(): Entry[] {
  return videos.map((v) => ({
    kind: 'video' as const,
    slug: v.id,
    title: v.title,
    description: v.meta ?? '',
    date: v.date ? new Date(v.date) : new Date(0),
    topic: v.topic,
    tags: [],
    featured: false,
    href: `https://www.youtube.com/watch?v=${v.id}`,
    external: true,
  }));
}

/** Everything publishable in one language, newest first. */
export async function getLatest(lang: Lang, limit?: number): Promise<Entry[]> {
  const all = [...(await getGuides(lang)), ...(await getArticles(lang)), ...getVideos()].sort(
    byDate
  );
  return limit ? all.slice(0, limit) : all;
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

/** Everything under one topic. */
export async function getByTopic(lang: Lang, topicId: string): Promise<Entry[]> {
  return (await getLatest(lang)).filter((e) => e.topic === topicId);
}

/** Resolve `related:` slugs against both collections. */
export async function getRelated(lang: Lang, slugs: string[]): Promise<Entry[]> {
  if (slugs.length === 0) return [];
  const all = await getLatest(lang);
  return slugs.map((s) => all.find((e) => e.slug === s)).filter((e): e is Entry => Boolean(e));
}

/** The topic record for an id, in one language. */
export function findTopic(id?: string) {
  return id ? topics.find((t) => t.id === id) : undefined;
}
