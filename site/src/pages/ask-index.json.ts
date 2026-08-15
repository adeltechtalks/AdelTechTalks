/* =============================================================================
   /ask-index.json — retrieval architecture for a later "Ask Adel" (Phase 1.1)
   =============================================================================
   WHAT THIS IS NOT
   ----------------
   There is no AI here. Nothing calls a model, nothing computes an embedding,
   nothing accepts user input, and there is no /ask route. Phase 1.1 was
   explicit that Ask Adel production AI is a later phase.

   WHAT THIS IS
   ------------
   A build artefact: one JSON file describing everything published, in both
   languages, with a stable id, a language tag, a kind, a topic, a series, a URL
   and a short excerpt of the body. It is generated from exactly the same
   content the pages render, so it cannot drift from the site.

   Why build it now rather than later: retrieval quality is decided by the
   content model, not by the model doing the retrieving. Having the corpus
   emitted and versioned from the start means the later phase is "point a
   retriever at this file", not "go back and restructure four collections".

   Everything in here is already public on the site. Drafts are excluded, and
   nothing about a visitor, a subscriber or an account appears anywhere in it.
   ========================================================================== */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { retrieval, site } from '../site.config';
import { LANGS } from '../i18n';

/* Strip the Markdown down to prose so an excerpt reads as a sentence rather
   than as syntax. Deliberately crude — this is a preview, not a renderer. */
function toPlain(markdown: string, limit: number): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')        // fenced code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')     // headings
    .replace(/[*_`>#|-]{1,}/g, ' ')         // leftover marks
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= limit) return text;
  /* Cut on a word boundary so the excerpt does not end mid-word. */
  return text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
}

interface Doc {
  id: string;
  kind: string;
  lang: string;
  title: string;
  description: string;
  url: string;
  topic?: string;
  series?: string;
  part?: number;
  tags: string[];
  date: string;
  updated?: string;
  excerpt: string;
}

export const GET: APIRoute = async () => {
  if (!retrieval.buildIndex) {
    return new Response(JSON.stringify({ generated: false, docs: [] }, null, 2), {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const base = site.url.replace(/\/$/, '');
  const limit = retrieval.excerptChars;
  const docs: Doc[] = [];

  /* One pass per collection. `base` is the URL segment the collection lives
     under — it must match BASE in lib/content.ts. */
  const sources = [
    { name: 'guides' as const, kind: 'guide', segment: 'guides' },
    { name: 'articles' as const, kind: 'article', segment: 'articles' },
    { name: 'useCases' as const, kind: 'use-case', segment: 'use-cases' },
    { name: 'prompts' as const, kind: 'prompt', segment: 'prompts' },
    { name: 'videos' as const, kind: 'video', segment: 'videos' },
  ];

  for (const source of sources) {
    let items;
    try {
      items = await getCollection(source.name, ({ data }) => !data.draft);
    } catch {
      /* An empty collection is not an error — it is the normal state of a
         content type nobody has written for yet. */
      continue;
    }

    for (const item of items) {
      const lang = item.data.lang;
      if (!(LANGS as readonly string[]).includes(lang)) continue;
      const prefix = lang === 'en' ? '' : `/${lang}`;

      /* A prompt's value is the prompt text itself, so that is what the
         excerpt carries rather than the commentary around it. */
      const bodySource =
        source.kind === 'prompt' && 'prompt' in item.data
          ? String(item.data.prompt)
          : (item.body ?? '');

      docs.push({
        id: `${source.kind}:${lang}:${item.id}`,
        kind: source.kind,
        lang,
        title: item.data.title,
        description: item.data.description,
        url: `${base}${prefix}/${source.segment}/${item.id}/`,
        topic: item.data.topic,
        series: item.data.series,
        part: item.data.part,
        tags: item.data.tags,
        date: item.data.date.toISOString(),
        updated: item.data.updated?.toISOString(),
        excerpt: toPlain(bodySource, limit),
      });
    }
  }

  docs.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const payload = {
    /* Bump when the shape changes, so a consumer can refuse an index it does
       not understand rather than mis-reading it. */
    schema: 1,
    site: base,
    languages: LANGS,
    count: docs.length,
    docs,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
