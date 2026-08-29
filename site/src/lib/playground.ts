/* Playground runtime — Google sign-in and badge progress.
   This file runs in the browser. It is only loaded on Playground pages, and only
   when Supabase keys are present in site.config.ts.

   The anon key is designed to be public — it is safe in the browser. What protects
   your data is Row Level Security: every row is readable only by the signed-in
   user who owns it.

   READS happen here, directly, under RLS. WRITES do not: progress and badges are
   posted to /api/playground/* and written by the server, because migration 07
   revokes the browser's grant on those tables. See src/server/db.ts. */

import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

export type Track = {
  slug: string;
  name: string;
  badge: string;
  steps: string[];
};

let client: SupabaseClient | null = null;

export function getClient(url: string, anonKey: string): SupabaseClient {
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return client;
}

/* Never throws. A network failure or a bad URL must still leave the page usable
   — the caller renders the sign-in button when this returns null. */
export async function currentUser(sb: SupabaseClient): Promise<User | null> {
  try {
    const { data } = await sb.auth.getUser();
    return data.user ?? null;
  } catch (err) {
    console.error('[playground] could not reach Supabase:', err);
    return null;
  }
}

export async function signInWithGoogle(sb: SupabaseClient) {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href },
  });
  if (error) throw error;
}

export async function signOut(sb: SupabaseClient) {
  await sb.auth.signOut();
  window.location.reload();
}

/* ---- progress ------------------------------------------------------------ */

export type Progress = Record<string, number[]>; // track slug → completed step indexes

export async function loadProgress(sb: SupabaseClient, userId: string): Promise<Progress> {
  const { data, error } = await sb
    .from('progress')
    .select('track_slug, step_index')
    .eq('user_id', userId);

  if (error) {
    console.error('[playground] could not load progress:', error.message);
    return {};
  }

  const out: Progress = {};
  for (const row of data ?? []) {
    (out[row.track_slug] ??= []).push(row.step_index);
  }
  return out;
}

/* ---- writes go through the server ----------------------------------------
   Progress and badges used to be written straight from the browser. Migration
   07 revokes that grant, because a table the client can write is a table the
   client can lie to — and `badges` feeds the public share link. These two
   helpers post to the Phase 0 shims instead. Same behaviour, same call sites;
   the writer moved.

   The session's access token authenticates the call. The server takes the user
   id from that token and never from the body. */
async function post(sb: SupabaseClient, path: string, body: unknown): Promise<void> {
  const { data } = await sb.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('not signed in');

  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(`${path} failed (${res.status}): ${(detail as any)?.error ?? 'unknown'}`);
  }
}

export async function setStep(
  sb: SupabaseClient,
  userId: string,
  trackSlug: string,
  stepIndex: number,
  done: boolean
) {
  /* userId stays in the signature so every call site is unchanged; the server
     ignores it and uses the verified session instead. */
  void userId;
  await post(sb, '/api/playground/progress', {
    track_slug: trackSlug,
    step_index: stepIndex,
    done,
  });
}

/* A badge is earned when every step in a track is complete. Awarding is idempotent. */
export async function syncBadge(
  sb: SupabaseClient,
  userId: string,
  track: Track,
  completed: number[]
): Promise<boolean> {
  const earned = completed.length >= track.steps.length;
  if (earned) {
    try {
      await awardBadge(sb, userId, track.slug);
    } catch (err) {
      console.error('[playground] could not award badge:', err);
    }
  }
  /* Un-awarding on un-tick is gone with the client's delete grant. It was never
     reachable in the live flow — the quiz awards on a pass and the badge page is
     a permanent link — and a server endpoint that revokes a posted badge is a
     different feature with a different owner. */
  return earned;
}

/* Award a badge outright — used when someone passes the quiz. Idempotent. */
export async function awardBadge(sb: SupabaseClient, userId: string, trackSlug: string) {
  void userId;
  await post(sb, '/api/playground/complete', { track_slug: trackSlug });
}

export type Share = { id: string; track_slug: string; display_name: string; earned_at: string };

/* Publish a badge so it has a public link. Returns the existing share if there
   already is one, so re-taking a quiz never orphans an already-posted link. */
export async function publishShare(
  sb: SupabaseClient,
  userId: string,
  trackSlug: string,
  displayName: string
): Promise<Share> {
  const existing = await sb
    .from('shares')
    .select('id, track_slug, display_name, earned_at')
    .eq('user_id', userId)
    .eq('track_slug', trackSlug)
    .maybeSingle();

  if (existing.data) return existing.data as Share;

  const { data, error } = await sb
    .from('shares')
    .insert({ user_id: userId, track_slug: trackSlug, display_name: displayName })
    .select('id, track_slug, display_name, earned_at')
    .single();

  if (error) throw error;
  return data as Share;
}

/* Read a public badge. Works signed out — that is the point. */
export async function loadShare(sb: SupabaseClient, id: string): Promise<Share | null> {
  const { data, error } = await sb
    .from('shares')
    .select('id, track_slug, display_name, earned_at')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[playground] could not load badge:', error.message);
    return null;
  }
  return (data as Share) ?? null;
}

export async function loadBadges(sb: SupabaseClient, userId: string): Promise<string[]> {
  const { data, error } = await sb.from('badges').select('track_slug').eq('user_id', userId);
  if (error) {
    console.error('[playground] could not load badges:', error.message);
    return [];
  }
  return (data ?? []).map((r) => r.track_slug);
}
