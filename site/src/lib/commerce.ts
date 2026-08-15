/* =============================================================================
   Monetisation guard (Phase 1.1 — architecture only)
   =============================================================================
   Phase 1.1 builds NO billing, NO credits, NO checkout and NO entitlements.

   This module exists so that the absence of those things is enforced in code
   rather than remembered. Every surface that could ever show a price asks
   `isPurchasable()` first, and while `commerce.enabled` is false the answer is
   always no — so an entry that declares `access: 'paid'` or a `price` by
   mistake still renders as free, with no button and no processor.

   Turning commerce on later means setting `enabled: true` and a `provider` in
   site.config.ts, and building the checkout this file deliberately does not
   contain. Nothing else has to be found and unpicked.
   ========================================================================== */

import { commerce } from '../site.config';

/** Is the site allowed to sell anything at all right now? */
export function commerceEnabled(): boolean {
  return commerce.enabled === true && commerce.provider !== '';
}

/**
 * Is this specific piece purchasable?
 * False while commerce is off, regardless of what the frontmatter says.
 */
export function isPurchasable(access: 'free' | 'paid' = 'free'): boolean {
  return commerceEnabled() && access === 'paid';
}

/**
 * Should this piece be gated behind a purchase?
 * Always false in Phase 1.1 — nothing on the site is behind a paywall, and a
 * "paid" flag with no processor must never lock a reader out of content that is
 * in fact free and already published.
 */
export function isGated(access: 'free' | 'paid' = 'free'): boolean {
  return isPurchasable(access);
}
