/* =============================================================================
   The navigation menus — Website Structure v2, frame 2e
   =============================================================================
   Three of the six nav items carry a dropdown, and the taxonomy inside each one
   is frozen:

     Vibe Coding  Current Builds · Experiments · Build Stories · Series
     Gear         Currently Testing · Reviews · Creator Gear · Mobile & Computing
                  Cameras · Gaming & Setup · AI-Powered Gear
     Learn        Use Cases · Prompt Library · Guides · Videos · Browse by Topic

   Playground, About and Subscribe are direct links and have no menu.

   ── AN ENTRY IS A LINK, AND A LINK IS A PROMISE ─────────────────────────────
   The taxonomy above is what the menus MAY contain. What they actually contain
   is every entry whose destination has something behind it — the same rule the
   footer's supporting column has followed since Phase 1.1, and the same rule
   the Gear Hub applies to its own category groups ("Category renders only with
   ≥1 published story").

   So a Gear category with nothing published is not in the Gear menu, and a
   Learn surface with nothing published in THIS language is not in the Learn
   menu. With an empty content directory every menu collapses to its "All X →"
   footer link, which is honest: the hub exists, has a designed empty state, and
   is worth visiting; the six shelves inside it are not.

   Building this list here rather than inside Header.astro keeps the desktop
   dropdowns and the mobile accordion rendering the SAME entries — they are two
   presentations of one menu, and a menu that differs by viewport is two menus.
   ========================================================================== */

import { emptySurfaces } from './content';
import { buildGroups, gearByCategory } from './pillars';
import { localizePath, type Lang } from '../i18n';
import type { Copy } from '../copy';

export interface MenuEntry {
  label: string;
  href: string;
}

export interface Menu {
  /** Which nav item this hangs off. */
  key: 'vibeCoding' | 'gear' | 'learn';
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

  /* ---- Vibe Coding ------------------------------------------------------
     The two group entries anchor into the hub's own group headings, which
     carry ids `vch-builds` and `vch-experiments`. `buildGroups()` already
     drops a group with no stories, so asking it which groups exist is asking
     which anchors exist. */
  const groups = new Set((await buildGroups(lang)).map((g) => g.id));
  const hasBuilds = groups.size > 0;
  const vibeCoding: MenuEntry[] = [
    ...(groups.has('builds')
      ? [{ label: t.vibeCoding.currentBuilds, href: `${path('/vibe-coding')}#vch-builds` }]
      : []),
    ...(groups.has('experiments')
      ? [{ label: t.vibeCoding.experiments, href: `${path('/vibe-coding')}#vch-experiments` }]
      : []),
    ...(hasBuilds ? [{ label: t.vibeCoding.buildStories, href: path('/vibe-coding') }] : []),
    /* The series view is a view over guides and articles carrying `series:`
       front matter, not a collection, so it has no emptiness count — and it
       has its own designed empty state. It is always offered. */
    { label: t.vibeCoding.series, href: path('/series/vibe-coding') },
  ];

  /* ---- Gear -------------------------------------------------------------
     Category entries anchor into the hub's category headings (`gh-{id}`), and
     `gearByCategory()` returns exactly the categories that have a published
     story, in the frozen order. "Currently Testing" is the hub's featured
     slot, which exists whenever any story does.

     "Reviews" is in the frozen taxonomy but has no route and no published
     concluded story yet, so it is not rendered. It is not a missing feature:
     a review is a Gear story whose takeaway has reached a verdict, and the day
     one publishes, this is the single line that surfaces it. */
  const gearGroups = await gearByCategory(lang);
  const gear: MenuEntry[] = [
    ...(gearGroups.length > 0
      ? [{ label: t.gear.currentlyTesting, href: `${path('/gear')}#gh-featured` }]
      : []),
    ...gearGroups.map((group) => ({
      label: CATEGORY_LABEL(t.gear, group.id),
      href: `${path('/gear')}#gh-${group.id}`,
    })),
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

  const menus: Menu[] = [
    { key: 'vibeCoding', entries: vibeCoding, allLabel: t.vibeCoding.all, allHref: path('/vibe-coding') },
    { key: 'gear', entries: gear, allLabel: t.gear.all, allHref: path('/gear') },
    { key: 'learn', entries: learn, allLabel: t.learn.all, allHref: path('/learn') },
  ];

  return menus.filter((menu) => menu.entries.length > 0);
}

/* The Gear category ids are the frozen taxonomy in lib/pillars.ts; the labels
   come from the copy file so the menu reads in the page's language, and the
   category proper nouns stay English there per the non-translated term rule. */
function CATEGORY_LABEL(t: Copy['ia']['menu']['gear'], id: string): string {
  switch (id) {
    case 'creator-gear':
      return t.creatorGear;
    case 'mobile-computing':
      return t.mobileComputing;
    case 'cameras':
      return t.cameras;
    case 'gaming-setup':
      return t.gamingSetup;
    case 'ai-gear':
      return t.aiGear;
    default:
      return id;
  }
}
