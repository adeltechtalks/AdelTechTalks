import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Guides are plain Markdown files in src/content/guides/.
   To add one: copy an existing .md file, rename it, change the text at the top. */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    pillar: z.enum(['ai', 'gadgets', 'automation', 'enterprise', 'creator']),
    /* Roughly how long it takes to read or do */
    minutes: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
