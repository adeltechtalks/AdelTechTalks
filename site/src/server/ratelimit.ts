/* =============================================================================
   Rate limiting
   =============================================================================
   A fixed window counter held in the Worker isolate's memory.

   Stated plainly, because the limitation matters more than the feature: this is
   PER-ISOLATE and BEST-EFFORT. Cloudflare runs many isolates and recycles them
   freely, so a determined caller spreading requests across isolates gets a
   higher effective ceiling than the number below, and a cold start resets the
   window. It is not a security control and nothing may depend on it for
   correctness.

   What it is for is the accident: a client stuck in a retry loop, a double-fired
   event handler, a script hammering a step toggle. For that it works, it costs
   nothing, and it needs no extra infrastructure.

   The durable version — Durable Objects or KV — arrives with the endpoints that
   actually need one, which are the ones that award XP and publish achievements.
   The Playground shims are not those: their worst case is a user rewriting rows
   they already own.
   ========================================================================== */

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

/* Unbounded growth is the one way an in-memory limiter can hurt you. Sweep on
   write rather than on a timer — a Worker isolate has no reliable background. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
}

export type RateVerdict = { ok: true } | { ok: false; retryAfter: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateVerdict {
  const now = Date.now();
  sweep(now);
  const w = windows.get(key);

  if (!w || w.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (w.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((w.resetAt - now) / 1000)) };
  }
  w.count += 1;
  return { ok: true };
}

/** Best-effort caller identity for anonymous limits. */
export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

/** For tests. */
export function _resetLimits() {
  windows.clear();
}
