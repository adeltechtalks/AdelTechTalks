#!/usr/bin/env node
/* =============================================================================
   npm run new <learn|prompt|build> "Title"
   =============================================================================
   Publishing velocity is the whole point of this script. Not "a scaffold
   generator" — a way to go from an idea to a file with the cursor in the right
   place, without reading a template.

   THE ONLY DECISION IS THE PILLAR, and it is the reader's question in reverse:

     learn    Am I teaching something?                  → src/content/guides/
     prompt   Am I giving something reusable?           → src/content/prompts/
     build    Am I building or testing something real?  → src/content/builds/

   Everything after the title is a plain word, never a flag. `npm run` eats
   anything starting with `--` before the script ever sees it, so a Canon-camera
   build would silently lose its YouTube id; positional words cannot be eaten:

     npm run new learn "Title" dQw4w9WgXcQ     an 11-character YouTube id
     npm run new learn "Title" cheatsheet      tutorial · cheatsheet · workflow · checklist
     npm run new build "Title" experiment      build · experiment
     npm run new learn "Title" ar              write it in Arabic

   They combine, in any order. A format is not a pillar and a language is not a
   pillar — the pillar is the only thing you have to decide.

   Everything written is REQUIRED front matter and nothing else. Optional
   fields live in each collection's _template.md, and the file that comes out of
   here says so at the bottom. A file you have to delete lines from is slower
   than a file you have to add lines to.

   Nothing here talks to the network, and nothing publishes: the file lands as
   a draft you finish and commit. See PUBLISHING.md.
   ========================================================================== */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const USAGE = `
  npm run new <type> "Title" [extras...]

    learn    Am I teaching something?                   → a guide
    prompt   Am I giving people something reusable?     → the Prompt Library
    build    Am I building or testing something real?   → a build or experiment

  extras — plain words, any order, all optional
    <11-char id>          the Learn piece IS this YouTube video
    cheatsheet            ... or workflow / checklist / tutorial
    experiment            a build that asks a question rather than aiming to launch
    ar                    write it in Arabic

  examples
    npm run new learn  "How context windows actually work"
    npm run new learn  "My vibe coding workflow" dQw4w9WgXcQ
    npm run new learn  "Prompting cheat sheet" cheatsheet
    npm run new prompt "Turn an idea into a product spec"
    npm run new build  "I automated my Canon camera with AI"
`;

/* ---- arguments -----------------------------------------------------------
   Deliberately positional and order-free. `npm run` strips `--flags` before the
   script sees them, so a flag here would be a trap that fails silently. */
const argv = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const type = argv[0];
const title = argv[1];
const extras = argv.slice(2).map((a) => a.toLowerCase());

const FORMATS = ['tutorial', 'cheatsheet', 'workflow', 'checklist'];
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

const lang = extras.includes('ar') ? 'ar' : 'en';
const format = extras.find((a) => FORMATS.includes(a)) ?? 'tutorial';
const kind = extras.includes('experiment') ? 'experiment' : 'build';
/* Checked against the format and language words first, so `cheatsheet` is never
   mistaken for a video id — it is 10 characters, but the next one might be 11. */
const video = extras.find(
  (a) => YOUTUBE_ID.test(a) && !FORMATS.includes(a) && a !== 'ar' && a !== 'experiment'
);

if (!type || !title || !['learn', 'prompt', 'build'].includes(type)) {
  console.log(USAGE);
  process.exit(argv.length ? 1 : 0);
}

const unknown = extras.filter(
  (a) => a !== 'ar' && a !== 'experiment' && !FORMATS.includes(a) && a !== video
);
if (unknown.length > 0) {
  console.error(`
  Did not understand: ${unknown.join(', ')}

  A YouTube id is exactly 11 characters. Everything else has to be one of:
  ${FORMATS.join(' · ')} · experiment · ar
`);
  process.exit(1);
}

/* ---- slug ----------------------------------------------------------------
   The filename IS the URL, so this has to be predictable rather than clever.
   Latin letters and digits survive, everything else becomes a hyphen. An
   Arabic title produces no Latin characters at all, which would leave an empty
   slug — so that case asks for one instead of inventing `untitled-3`. */
const slug =
  String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) + (lang === 'ar' ? '-ar' : '');

if (slug === '-ar' || slug === '') {
  console.error(`
  Could not make a URL out of "${title}".

  The filename becomes the URL, so it needs Latin characters. Create the file
  with an English slug and put the Arabic title inside it:

    npm run new ${type} "an-english-slug" ${lang === 'ar' ? '--ar' : ''}
`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const esc = (v) => `'${String(v).replace(/'/g, "''")}'`;

/* ---- what each pillar writes --------------------------------------------- */
const OPTIONAL = (dir) => `
<!-- Optional front matter — cover, related, series, featured and the rest —
     is documented in src/content/${dir}/_template.md. Add what you need; every
     one of them has a working default. -->
`;

const RECIPES = {
  prompt: () => ({
    dir: 'prompts',
    body: `---
title: ${esc(title)}
description: 'One sentence on what it does. Shown in search results and on social.'
date: ${today}
lang: ${lang}
category: product      # product · building · research · writing · automation
prompt: |
  Write the prompt here, exactly as you would paste it.
  Put anything the reader must replace in [BRACKETS].
variables: []          # e.g. ['[YOUR PRODUCT]'] — each one is highlighted
testedOn: []           # e.g. ['Claude Opus 4.5'] — where you actually ran it
draft: true
---

What it is for, when it works, and what it gets wrong. The commentary is the
part that makes this a library rather than a list.
${OPTIONAL('prompts')}`,
  }),

  build: () => ({
    dir: 'builds',
    body: `---
title: ${esc(title)}
description: 'One sentence. Shown in search results and on social.'
date: ${today}
lang: ${lang}
kind: ${kind}            # build (aiming at a launch) · experiment (a question)
question: 'The headline. Always a real question, never a product name.'
status: building       # exploring · designing · building · testing · launched · paused
stage: build           # idea · explore · design · build · test · launch
topic: automation      # ai · automation · vibe-coding · vibe-designing · prompting · building
draft: true
---

What you are making, why, and where it has got to. An abandoned build is as
publishable as a launched one — say which.

<!-- No screenshot needed to publish. Add \`heroShot: /images/...\` when you have
     one and it drops straight into the frame. -->
${OPTIONAL('builds')}`,
  }),

  learn: () =>
    video
      ? {
          dir: 'videos',
          body: `---
title: ${esc(title)}
description: 'One sentence that makes somebody want to watch it.'
date: ${today}
lang: ${lang}
topic: ai              # ai · automation · vibe-coding · vibe-designing · prompting
youtubeId: '${video}'
draft: true
---

The write-up. Not a transcript — what you would tell somebody who asked "what
did you find?" and did not have twelve minutes. This is the part search engines
read and the part that works with the sound off.

<!-- chapters, takeaways and promptSlugs are optional and all default to empty.
     promptSlugs: ['spec-before-you-build'] links the prompts used on screen. -->
${OPTIONAL('videos')}`,
        }
      : {
          dir: 'guides',
          body: `---
title: ${esc(title)}
description: 'One sentence. Shown in search results and on social.'
date: ${today}
lang: ${lang}
topic: ai              # ai · automation · vibe-coding · vibe-designing · prompting
format: ${format}   # tutorial · cheatsheet · workflow · checklist
draft: true
---

Teach the thing.${
            format === 'cheatsheet'
              ? `

<!-- A cheat sheet usually has something to take away. Put the file in
     public/ and add:

     download:
       label: 'The one-page version'
       href: /downloads/${slug}.pdf
       meta: 'PDF · 1 page'
-->`
              : ''
          }
${OPTIONAL('guides')}`,
        },
};

/* ---- write --------------------------------------------------------------- */
const { dir, body } = RECIPES[type]();
const folder = join(ROOT, 'src', 'content', dir);
const path = join(folder, `${slug}.md`);

if (existsSync(path)) {
  console.error(`\n  ${dir}/${slug}.md already exists. Pick another title, or edit that one.\n`);
  process.exit(1);
}

mkdirSync(folder, { recursive: true });
writeFileSync(path, body, 'utf8');

const url = `${lang === 'en' ? '' : '/ar'}/${dir === 'guides' ? 'guides' : dir}/${slug}/`;
console.log(`
  Created  src/content/${dir}/${slug}.md
  URL      ${url}

  1. Write it.
  2. Change  draft: true  →  draft: false
  3. Commit to main. Cloudflare deploys it.

  npm run dev   to see it locally at http://localhost:4321${url}
`);
