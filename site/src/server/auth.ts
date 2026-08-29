/* =============================================================================
   Session verification
   =============================================================================
   The browser holds a Supabase session and sends its access token as a Bearer
   header. This file turns that token into a verified user, or into nothing.

   The token is verified by asking Supabase, not by decoding it here. Decoding a
   JWT tells you what it claims; it does not tell you the signature is valid, the
   session has not been revoked, or the user still exists. A shim that trusted a
   decoded `sub` would accept a token anybody could forge — and since the shim
   then writes as the service role, that is the whole security boundary.
   ========================================================================== */
import { createClient } from '@supabase/supabase-js';
import { services } from '../site.config';
import type { ServerEnv } from './db';

export type SessionUser = { id: string; email: string | null };

function bearer(request: Request): string | null {
  const raw = request.headers.get('authorization') ?? '';
  const m = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return m ? m[1].trim() : null;
}

/**
 * Verify the caller's session. Returns null when there is no usable token —
 * callers turn that into 401 themselves so the response shape stays theirs.
 */
export async function optionalUser(
  request: Request,
  env: ServerEnv
): Promise<SessionUser | null> {
  const token = bearer(request);
  if (!token) return null;

  const url = env.SUPABASE_URL || services.supabaseUrl;
  const anon = services.supabaseAnonKey;
  if (!url || !anon) return null;

  try {
    /* The anon key is the right key here: this call only asks "whose token is
       this", and asking with the service role would grant the request more
       authority than the question needs. */
    const sb = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    /* Network failure is not authorisation. Fail closed. */
    return null;
  }
}

/** `optionalUser`, but the caller wants a user or a 401. */
export async function requireUser(
  request: Request,
  env: ServerEnv
): Promise<SessionUser | Response> {
  const user = await optionalUser(request, env);
  if (!user) {
    return json({ error: 'unauthorized' }, 401);
  }
  return user;
}

export function isResponse(v: unknown): v is Response {
  return v instanceof Response;
}

export function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...headers },
  });
}
