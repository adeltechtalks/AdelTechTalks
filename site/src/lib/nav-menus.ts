/* =============================================================================
   The navigation menus
   =============================================================================
   Two of the four nav items carry a dropdown:

     Learn        Use Cases · Prompt Library · Guides · Videos · Browse by Topic
     Builds       Current Builds · Experiments · Build Stories · Series

   Prompts and About are direct links and have no menu. Prompts is deliberately
   flat: the whole point of that pillar is "give me something I can paste", and
   a disclosure panel between the reader and the library is friction.

   Gear no longer has a menu because it is no longer in the primary navigation.
   /gear, the collection and every published story are untouched; the labels for
   its categories stay in copy.ts because the Gear hub still renders them.

   ── AN ENTRY IS A LINK, AND A LINK IS A PROMISE ─────────────────────────────
   The taxonomy above is what the menus MAY contain. What they actually contain
   is every entry whose destination has something behind it — the same rule the
   footer's supporting column has followed since Phase 1.1, and the same rule
   the Gear Hub applies to its own category groups ("Category renders only with
   ≥1 published story"). An entry is a link, and a link is a promise.

   So a Learn surface with nothing published in THIS language is not in the Learn
   menu, and a build group with no stories is not in the Builds menu. With an
   empty content directory every menu collapses to its "All X →" footer link,
   which is honest: the hub exists, has a designed empty state, and is worth
   visiting; the shelves inside it are not.

   Building this list here rather than inside Header.astro keeps the desktop
   dropdowns and the mobile accordion rendering the SAME entries — they are two
   presentations of one menu, and a menu that differs by viewport is two menus.
   ========================================================================== */

import { emptySurfaces } from './content';
import { buildGroups } from './pillars';
import { localizePath, type Lang } from '../i18n';
import type { Copy } from '../copy';

export interface MenuEntry {
  label: string;
  href: string;
}

export interface Menu {
  /** Which nav item this hangs off. */
  key: 'learn' | 'builds';
  entries: MenuEntry[];
  /** The "All X →" link that closes every menu. */
  allLabel: string;
  allHref: string;
}

/**
 * Every menu that has something in it, for one language.
 *
 * A pillar whose menu came back empty is dropped from the result entirely, so
 * the header renders it as a plain link with no chevron — a disclosure control
 * that opens an empty panel is worse than no control.
 */
export async function navMenus(lang: Lang, c: Copy): Promise<Menu[]> {
  const t = c.ia.menu;
  const empty = await emptySurfaces(lang);
  const path = (p: string) => localizePath(p, lang);

  /* ---- Builds -----------------------------------------------------------
     The two group entries anchor into the hub's own group headings, which
     carry ids `vch-builds` and `vch-experiments`. `buildGroups()` already
     drops a group with no stories, so asking it which groups exist is asking
     which anchors exist. */
  const groups = new Set((await buildGroups(lang)).map((g) => g.id));
  const hasBuilds = groups.size > 0;
  const builds: MenuEntry[] = [
    ...(groups.has('builds')
      ? [{ label: t.builds.currentBuilds, href: `${path('/builds')}#vch-builds` }]
      : []),
    ...(groups.has('experiments')
      ? [{ label: t.builds.experiments, href: `${path('/builds')}#vch-experiments` }]
      : []),
    ...(hasBuilds ? [{ label: t.builds.buildStories, href: path('/builds') }] : []),
    /* The Vibe Coding series is offered from BUILDS rather than from Learn,
       even though Vibe Coding is now a Learn topic. The series is a narrative
       about making a specific thing, which is what this pillar is; the topic is
       the subject you might want taught, which is what Learn is. Same words,
       two different reader intents.

       It is a view over guides and articles carrying `series:` front matter,
       not a collection, so it has no emptiness count — and it has its own
       designed empty state. It is always offered. */
    { label: t.builds.series, href: path('/series/vibe-coding') },
  ];

  /* ---- Learn ------------------------------------------------------------ */
  const learn: MenuEntry[] = [
    ...(empty.has('useCases') ? [] : [{ label: t.learn.useCases, href: path('/use-cases') }]),
    ...(empty.has('prompts') ? [] : [{ label: t.learn.promptLibrary, href: path('/prompts') }]),
    ...(empty.has('guides') ? [] : [{ label: t.learn.guides, href: path('/guides') }]),
    ...(empty.has('videos') ? [] : [{ label: t.learn.videos, href: path('/videos') }]),
    /* Topics are a fixed taxonomy rather than a surface, but /topics is only
       worth a link once something is filed under one of them. */
    ...(empty.has('guides') && empty.has('useCases') && empty.has('videos')
      ? []
      : [{ label: t.learn.browseByTopic, href: path('/topics') }]),
  ];

  /* Header order: Learn, then Builds. */
  const menus: Menu[] = [
    { key: 'learn', entries: learn, allLabel: t.learn.all, allHref: path('/learn') },
    { key: 'builds', entries: builds, allLabel: t.builds.all, allHref: path('/builds') },
  ];

  return menus.filter((menu) => menu.entries.length > 0);
}
