/* =============================================================================
   Which badge a piece of content carries
   =============================================================================
   Website Structure v2, frame 2f: one primary badge (content TYPE) plus at most
   one optional secondary marker. This is the single place that decides which,
   so a story shows the same badge in Latest, on a hub and on its own page.

   The mapping is DERIVED, never authored per card: a badge is a fact about what
   the piece is, and a fact should not be re-typed in five front-matter blocks
   where it can drift.
   ========================================================================== */

import type { Entry } from './content';

/* The two closed vocabularies, declared here rather than inside Badge.astro.

   A .astro file is not a module you can cheaply import a TYPE from — the
   compiler hoists frontmatter exports, and a type-only import from a component
   drags the component into the graph of everything that reads the taxonomy.
   The vocabulary is data; it lives with the data.

   PRIMARY badges are the frozen closed set of ten (Content Identity System,
   2026-08-17). Adding an eleventh requires re-approval. */
export type BadgeKind =
  | 'vibe-coding'
  | 'gear'
  | 'learn'
  | 'prompt'
  | 'use-case'
  | 'guide'
  | 'playground'
  | 'build'
  | 'review'
  | 'workflow';

/* SECONDARY markers. `testing`, `live` and `current` are the "happening now"
   three and the only ones that may carry mint. */
export type BadgeMarker =
  | 'new'
  | 'testing'
  | 'live'
  | 'current'
  | 'on-the-go'
  | 'ai-powered'
  | 'featured';

/* The one series that is a pillar rather than a topic. A piece inside it is a
   Vibe Coding piece whatever its collection says. */
const VIBE_CODING_SERIES = 'vibe-coding';

/** The primary badge for an entry. Exactly one, always. */
export function badgeFor(entry: Entry): BadgeKind {
  if (entry.series === VIBE_CODING_SERIES) return 'vibe-coding';
  switch (entry.kind) {
    case 'prompt':
      return 'prompt';
    case 'use-case':
      return 'use-case';
    case 'guide':
      return 'guide';
    /* Videos and general articles are Learn surfaces. "Video" is deliberately
       not an eighth badge — the closed set of ten is frozen, and adding to it
       needs re-approval. */
    case 'video':
    case 'article':
    default:
      return 'learn';
  }
}

/* Thirty days. Long enough that a piece published this month still reads as
   new, short enough that "New" never becomes decoration on a stale card. */
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * The optional secondary marker — or nothing, which is the common case.
 *
 * Only two markers are derivable from content without inventing a claim:
 * `Part NN` for a numbered series piece, and `New` for something genuinely
 * published inside the window. Everything else in the marker vocabulary
 * (Testing, Live, Current) is a claim about the real world and has to come from
 * the piece's own authored front matter, never from a date.
 *
 * `now` is passed in rather than read from the clock so the caller decides the
 * reference point once per build — the same page must not label one card "New"
 * and another not, on either side of midnight mid-render.
 */
export function markerFor(entry: Entry, now: number): { part?: number; marker?: BadgeMarker } {
  if (typeof entry.part === 'number') return { part: entry.part };
  if (now - entry.date.getTime() < NEW_WINDOW_MS) return { marker: 'new' };
  return {};
}
