/* =============================================================================
   POST /api/playground/progress — Phase 0 shim
   =============================================================================
   SCHEDULED FOR DELETION. This endpoint exists only to move the live v2.x
   Playground's `progress` writes out of the browser, so that migration 07 can
   revoke the client's write grant without the Playground silently ceasing to
   record anything. It is deleted when the rebuilt Playground ships (PR 13).

   Nothing a visitor sees changes. Same behaviour, different writer.
   ========================================================================== */
import type { APIRoute } from 'astro';
import { requireUser, isResponse, json } from '../../../server/auth';
import { rateLimit } from '../../../server/ratelimit';
import { MissingBindingError, bindingReport, recordStep, type ServerEnv } from '../../../server/db';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const env = ((locals as any)?.runtime?.env ?? {}) as ServerEnv;

  const user = await requireUser(request, env);
  if (isResponse(user)) return user;

  /* Generous: ticking through a track is a burst of legitimate writes. */
  const verdict = rateLimit(`pg:progress:${user.id}`, 120, 60_000);
  if (!verdict.ok) {
    return json({ error: 'rate_limited' }, 429, { 'retry-after': String(verdict.retryAfter) });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const trackSlug = body?.track_slug;
  const stepIndex = body?.step_index;
  const done = body?.done;

  if (typeof trackSlug !== 'string' || !/^[a-z0-9-]{1,64}$/.test(trackSlug)) {
    return json({ error: 'invalid_track_slug' }, 400);
  }
  if (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 999) {
    return json({ error: 'invalid_step_index' }, 400);
  }
  if (typeof done !== 'boolean') {
    return json({ error: 'invalid_done' }, 400);
  }

  /* user.id comes from the verified session, never from the body. A request
     carrying its own user_id is writing about someone else by definition. */
  if ('user_id' in (body ?? {})) {
    return json({ error: 'user_id_not_accepted' }, 400);
  }

  try {
    await recordStep(env, user.id, trackSlug, stepIndex, done);
  } catch (err) {
    console.error('[api/playground/progress]', err);
    /* A missing binding is not a failed write — the request was fine and the
       server is not configured to serve it. Separate status, separate fix. */
    if (err instanceof MissingBindingError) {
      /* A dedicated line, as a plain string. The same facts live in the Error's
         message, but Cloudflare logged only the stack — so this does not go
         through Error serialisation. Binding NAMES only, never values. */
      console.error(
        'ATC_BINDING_DIAGNOSTIC ' +
          JSON.stringify({ route: '/api/playground/progress', ...bindingReport(env) })
      );
      return json({ error: 'server_misconfigured' }, 503);
    }
    return json({ error: 'write_failed' }, 500);
  }

  return json({ ok: true });
};
