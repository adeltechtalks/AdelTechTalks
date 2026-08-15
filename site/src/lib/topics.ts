/* Legacy ATT pillar → v2.0 topic (§7).
   Guides published before the v2.0 migration carry a `pillar:`. They keep
   working and land under the right topic instead of being orphaned. */

export const PILLAR_TO_TOPIC = {
  ai: 'ai',
  gadgets: 'tech',
  automation: 'automation',
  enterprise: 'product',
  creator: 'creator-tech',
} as const;

export type Pillar = keyof typeof PILLAR_TO_TOPIC;
