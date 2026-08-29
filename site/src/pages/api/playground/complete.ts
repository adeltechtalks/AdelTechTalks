/* =============================================================================
   POST /api/playground/complete — Phase 0 shim
   =============================================================================
   SCHEDULED FOR DELETION alongside progress.ts (PR 13).

   Awards the v2.x track badge. The badge asserts "I clicked through a quiz", and
   the server writes it because migration 07 takes the client's grant away — not
   because the assertion suddenly became load-bearing. When a badge starts
   meaning a graded score, it goes through the achievement pipeline instead, and
   that endpoint proves ownership rather than trusting a slug.
   ========================================================================== */
import type { APIRoute } from 'astro';
import { requireUser, isResponse, json } from '../../../server/auth';
import { rateLimit } from '../../../server/ratelimit';
import { MissingBindingError, awardTrackBadge, type ServerEnv } from '../../../server/db';
import { playground } from '../../../site.config';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = ((locals as any)?.runtime?.env ?? {}) as ServerEnv;

  const user = await requireUser(request, env);
  if (isResponse(user)) return user;

  const verdict = rateLimit(`pg:complete:${user.id}`, 30, 60_000);
  if (!verdict.ok) {
    return json({ error: 'rate_limited' }, 429, { 'retry-after': String(verdict.retryAfter) });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  if ('user_id' in (body ?? {})) {
    return json({ error: 'user_id_not_accepted' }, 400);
  }

  const trackSlug = body?.track_slug;
  if (typeof trackSlug !== 'string') {
    return json({ error: 'invalid_track_slug' }, 400);
  }

  /* The slug must name a real track. Without this the table accepts any string
     and the badge list becomes whatever clients felt like posting. */
  const track = playground.tracks.find((t) => t.slug === trackSlug);
  if (!track) {
    return json({ error: 'unknown_track' }, 400);
  }

  try {
    await awardTrackBadge(env, user.id, track.slug);
  } catch (err) {
    console.error('[api/playground/complete]', err);
    /* A missing binding is not a failed write — the request was fine and the
       server is not configured to serve it. Separate status, separate fix. */
    if (err instanceof MissingBindingError) {
      return json({ error: 'server_misconfigured' }, 503);
    }
    return json({ error: 'write_failed' }, 500);
  }

  return json({ ok: true, track_slug: track.slug });
};
