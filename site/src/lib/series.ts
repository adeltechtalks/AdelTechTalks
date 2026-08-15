/* =============================================================================
   Series helpers (Phase 1.1)
   =============================================================================
   Kept out of site.config.ts for the same reason PILLAR_TO_TOPIC is: config
   files are data, and anything the app imports from a file Astro treats as
   configuration gets pulled into the build graph in ways the Cloudflare adapter
   does not expect.
   ========================================================================== */

import { series } from '../site.config';
import type { Lang } from '../i18n';

export type SeriesRecord = (typeof series)[number];

/** The series record for an id. */
export function findSeries(id?: string): SeriesRecord | undefined {
  return id ? series.find((s) => s.id === id) : undefined;
}

/** The series currently being published — the one the header links to. */
export function flagshipSeries(): SeriesRecord | undefined {
  return series.find((s) => s.status === 'running') ?? series[0];
}

/** The path to a series, in one language. Language prefixing is the caller's. */
export function seriesPath(id: string): string {
  return `/series/${id}`;
}

/** The localised copy block for a series. */
export function seriesCopy(record: SeriesRecord, lang: Lang) {
  return record[lang];
}
