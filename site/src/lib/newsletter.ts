/* =============================================================================
   Newsletter subscribe (§20)
   =============================================================================
   §20: "Implement the designed newsletter/signup experience as real
   functionality if the existing project already has the required
   database/integration architecture… Do not fabricate an external
   integration."

   It does: Supabase is already the site's database, already holds the
   Playground's data, and already has Row Level Security configured. So
   subscribers go there, in a `subscribers` table, owned by Adel.

   WHY RAW fetch AND NOT supabase-js
   ---------------------------------
   The SDK is ~217 KB. This is one POST. The newsletter form appears on nearly
   every page, so pulling the SDK in for it would put a quarter of a megabyte
   of JavaScript on the homepage to insert one row (§31). PostgREST is a plain
   HTTP API and the anon key is a header — no client needed.

   The anon key is public by design. What protects the table is RLS: anon may
   INSERT and may not SELECT, so nobody can read the subscriber list out of the
   browser, including whoever copies the key out of the page source.
   ========================================================================== */

import { read as readAttribution, landingPath } from './attribution';

export type SubscribeResult = 'ok' | 'already' | 'invalid' | 'error';

/* Deliberately permissive. The authoritative check is the confirmation email;
   this only catches the obvious typo before a round trip. Anything stricter
   rejects real addresses, which is a worse failure than accepting a fake one. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length >= 6 && v.length <= 254 && EMAIL.test(v);
}

export interface SubscribeInput {
  email: string;
  lang: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  /* Where on the site the form was submitted from — 'home', 'guide', … */
  placement?: string;
}

export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) return 'invalid';

  const attribution = readAttribution();

  const row = {
    email,
    lang: input.lang,
    placement: input.placement ?? null,
    landing_path: landingPath() || null,
    source: attribution.source ?? null,
    platform: attribution.platform ?? null,
    campaign: attribution.campaign ?? null,
    guide: attribution.guide ?? null,
    /* Submitting the form IS the consent act, and the consent text sits
       immediately above the button. Recording when it happened is what makes
       that defensible later. */
    consented_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${input.supabaseUrl}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: input.supabaseAnonKey,
        Authorization: `Bearer ${input.supabaseAnonKey}`,
        /* return=minimal means PostgREST does not try to SELECT the row back,
           which it could not do anyway — anon has no read grant. */
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (res.ok) return 'ok';

    /* 409 + 23505 is the unique index on email: they are already subscribed.
       That is a success from the reader's point of view, and saying "already
       on the list" is also the honest answer — telling them it worked again
       would be a small lie. */
    if (res.status === 409) return 'already';

    let code = '';
    try {
      code = ((await res.json()) as { code?: string }).code ?? '';
    } catch {
      /* not JSON; fall through to the generic error */
    }
    if (code === '23505') return 'already';

    console.error('[newsletter] subscribe failed', res.status, code);
    return 'error';
  } catch (err) {
    console.error('[newsletter] network error', err);
    return 'error';
  }
}
