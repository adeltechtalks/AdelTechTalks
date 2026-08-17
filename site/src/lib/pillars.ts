/* =============================================================================
   THE TWO PILLARS — Vibe Coding (building) and Gear (using)
   =============================================================================
   IA v2.0's central content rule, in one file:

     Vibe Coding = BUILDING with AI.
     Gear        = USING / TESTING technology.
     Crossover   = only when the product genuinely enables the build.

   Both pillars share components — the journey rail, the story row, the status
   pill, the featured card — so the taxonomies they run on live together here
   rather than being restated in each surface.

   ── PUBLICATION IS A GATE, NOT A SCHEMA RULE ────────────────────────────────
   The frozen handoff draws a hard line between IMPLEMENTATION and PUBLICATION:
   the system ships complete with zero real assets, and a missing asset only
   keeps its own story unpublished. So the required-asset check is here, at read
   time, and NOT in the Zod schema:

     · a Gear story needs a real photograph
     · a Build story needs a real hero screenshot of something live

   A story missing one is drafted, committed, reviewable — and invisible. It
   appears the moment the asset lands, with no other change. Nothing is ever
   substituted, generated or stubbed to fill the gap.
   ========================================================================== */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

/* Astro logs a warning per page for every getCollection() against an empty
   collection. Checking first is silent, and empty is a correct answer. */
const HAS = {
  gear: Object.keys(import.meta.glob('../content/gear/**/*.md')).length > 0,
  builds: Object.keys(import.meta.glob('../content/builds/**/*.md')).length > 0,
};

/* -----------------------------------------------------------------------------
   GEAR
   -------------------------------------------------------------------------- */

/** The frozen category taxonomy, in the order the hub renders them. */
export const GEAR_CATEGORIES = [
  'mobile-computing',
  'creator-gear',
  'cameras',
  'gaming-setup',
  'ai-gear',
] as const;
export type GearCategory = (typeof GEAR_CATEGORIES)[number];

/* Category names stay ENGLISH in Arabic too — the frozen non-translated rule.
   They are product-category proper nouns, not prose. */
export const GEAR_CATEGORY_NAME: Record<GearCategory, string> = {
  'mobile-computing': 'Mobile & Computing',
  'creator-gear': 'Creator Gear',
  cameras: 'Cameras',
  'gaming-setup': 'Gaming & Setup',
  'ai-gear': 'AI-Powered Gear',
};

export interface GearStory {
  slug: string;
  lang: Lang;
  category: GearCategory;
  categoryName: string;
  product: string;
  question: string;
  context: string;
  status: 'testing' | 'using' | 'concluded';
  label: 'currently-testing' | 'workflow-test' | 'creator-test' | 'up-next' | 'worth-exploring';
  testingSince?: Date;
  photo: string;
  photoAlt: string;
  verdict?: string;
  concludedOn?: Date;
  crossover?: string;
  videoId?: string;
  date: Date;
  href: string;
}

/** A Gear story may only be seen by a reader once there is a real photograph. */
const gearPublishable = (data: CollectionEntry<'gear'>['data'], lang: Lang) =>
  !data.draft && data.lang === lang && Boolean(data.photo);

function toGear(item: CollectionEntry<'gear'>, lang: Lang): GearStory {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return {
    slug: item.id,
    lang,
    category: item.data.category,
    categoryName: GEAR_CATEGORY_NAME[item.data.category],
    product: item.data.product,
    question: item.data.question,
    context: item.data.context,
    status: item.data.status,
    label: item.data.label,
    testingSince: item.data.testingSince,
    photo: item.data.photo as string,
    photoAlt: item.data.photoAlt ?? '',
    verdict: item.data.verdict,
    concludedOn: item.data.concludedOn,
    crossover: item.data.crossover,
    videoId: item.data.videoId,
    date: item.data.date,
    href: `${prefix}/gear/${item.data.category}/${item.id}/`,
  };
}

const byDate = (a: { date: Date }, b: { date: Date }) => b.date.getTime() - a.date.getTime();

/** Every publishable Gear story in one language, newest first. */
export async function getGear(lang: Lang): Promise<GearStory[]> {
  if (!HAS.gear) return [];
  const items = await getCollection('gear', ({ data }) => gearPublishable(data, lang));
  return items.map((i) => toGear(i, lang)).sort(byDate);
}

/**
 * The one story to feature.
 *
 * "Currently testing" is a claim, so it is only made when something really is
 * in testing. Otherwise the most recent story takes the slot with its OWN
 * honest label — the featured slot never fakes activity, and it is never empty
 * while any story exists.
 */
export async function featuredGear(lang: Lang): Promise<GearStory | undefined> {
  const all = await getGear(lang);
  return all.find((g) => g.status === 'testing') ?? all[0];
}

/** Gear stories grouped by category, in frozen order, empty groups dropped. */
export async function gearByCategory(lang: Lang) {
  const all = await getGear(lang);
  return GEAR_CATEGORIES.map((id) => ({
    id,
    name: GEAR_CATEGORY_NAME[id],
    stories: all.filter((g) => g.category === id),
  })).filter((group) => group.stories.length > 0);
}

/** Categories with nothing published — named honestly in a hairline footnote. */
export async function emptyGearCategories(lang: Lang) {
  const live = new Set((await getGear(lang)).map((g) => g.category));
  return GEAR_CATEGORIES.filter((id) => !live.has(id)).map((id) => GEAR_CATEGORY_NAME[id]);
}

export async function findGear(lang: Lang, slug: string): Promise<GearStory | undefined> {
  return (await getGear(lang)).find((g) => g.slug === slug);
}

/* -----------------------------------------------------------------------------
   VIBE CODING
   -------------------------------------------------------------------------- */

/** The frozen six stages. Never a seventh, never renamed per build. */
export const BUILD_STAGES = ['idea', 'explore', 'design', 'build', 'test', 'launch'] as const;
export type BuildStage = (typeof BUILD_STAGES)[number];

export type BuildStatus =
  | 'exploring' | 'designing' | 'building' | 'testing' | 'launched' | 'paused';

/* The colour treatment each status gets. Exactly one status carries mint, and
   it is the one that means "happening right now" — the 3% ceiling is spent on
   the single most time-sensitive fact on the page. */
export const BUILD_STATUS_TONE: Record<BuildStatus, 'mint' | 'blue' | 'ghost'> = {
  exploring: 'ghost',
  designing: 'ghost',
  building: 'mint',
  testing: 'ghost',
  launched: 'blue',
  paused: 'ghost',
};

export interface BuildStory {
  slug: string;
  lang: Lang;
  kind: 'build' | 'experiment';
  status: BuildStatus;
  question: string;
  context?: string;
  stage: BuildStage;
  series?: string;
  part?: number;
  liveUrl?: string;
  heroShot: string;
  heroShotAlt: string;
  sessionShot?: string;
  sessionShotAlt?: string;
  tools: { name: string; role: string }[];
  crossover?: string;
  playgroundTool?: string;
  date: Date;
  href: string;
}

/** A Build story may only be seen once there is a real screenshot of it. */
const buildPublishable = (data: CollectionEntry<'builds'>['data'], lang: Lang) =>
  !data.draft && data.lang === lang && Boolean(data.heroShot);

function toBuild(item: CollectionEntry<'builds'>, lang: Lang): BuildStory {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return {
    slug: item.id,
    lang,
    kind: item.data.kind,
    status: item.data.status,
    question: item.data.question,
    context: item.data.context,
    stage: item.data.stage,
    series: item.data.series,
    part: item.data.part,
    liveUrl: item.data.liveUrl,
    heroShot: item.data.heroShot as string,
    heroShotAlt: item.data.heroShotAlt ?? '',
    sessionShot: item.data.sessionShot,
    sessionShotAlt: item.data.sessionShotAlt,
    tools: item.data.tools,
    crossover: item.data.crossover,
    playgroundTool: item.data.playgroundTool,
    date: item.data.date,
    href: `${prefix}/vibe-coding/${item.id}/`,
  };
}

/** Every publishable Build story in one language, newest first. */
export async function getBuilds(lang: Lang): Promise<BuildStory[]> {
  if (!HAS.builds) return [];
  const items = await getCollection('builds', ({ data }) => buildPublishable(data, lang));
  return items.map((i) => toBuild(i, lang)).sort(byDate);
}

/**
 * The build to feature.
 *
 * Same honesty rule as Gear: "Now building" is only claimed when something is
 * actually being built. Otherwise the most recent build is featured carrying
 * its own real status.
 */
export async function featuredBuild(lang: Lang): Promise<BuildStory | undefined> {
  const all = await getBuilds(lang);
  return all.find((b) => b.status === 'building') ?? all[0];
}

/** Builds and Experiments as separate groups; an empty group is dropped. */
export async function buildGroups(lang: Lang) {
  const all = await getBuilds(lang);
  return (
    [
      { id: 'builds' as const, stories: all.filter((b) => b.kind === 'build') },
      { id: 'experiments' as const, stories: all.filter((b) => b.kind === 'experiment') },
    ] as const
  ).filter((g) => g.stories.length > 0);
}

export async function findBuild(lang: Lang, slug: string): Promise<BuildStory | undefined> {
  return (await getBuilds(lang)).find((b) => b.slug === slug);
}

/** The other parts of a build's series, in running order — for prev/next. */
export async function seriesNeighbours(lang: Lang, story: BuildStory) {
  if (!story.series) return { previous: undefined, next: undefined };
  const parts = (await getBuilds(lang))
    .filter((b) => b.series === story.series)
    .sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
  const i = parts.findIndex((b) => b.slug === story.slug);
  return { previous: i > 0 ? parts[i - 1] : undefined, next: i >= 0 ? parts[i + 1] : undefined };
}

/* -----------------------------------------------------------------------------
   CROSSOVER — each side links, neither retells
   -------------------------------------------------------------------------- */

/** The Build story a Gear story points at, if it is published in this language. */
export async function crossoverBuild(lang: Lang, story: GearStory) {
  return story.crossover ? findBuild(lang, story.crossover) : undefined;
}

/** The Gear story a Build story points at, if it is published in this language. */
export async function crossoverGear(lang: Lang, story: BuildStory) {
  return story.crossover ? findGear(lang, story.crossover) : undefined;
}
