/* Playground runtime — Google sign-in and badge progress.
   This file runs in the browser. It is only loaded on Playground pages, and only
   when Supabase keys are present in site.config.ts.

   The anon key is designed to be public — it is safe in the browser. What protects
   your data is Row Level Security, which the SQL in supabase/schema.sql switches on:
   every row is readable and writable only by the signed-in user who owns it. */

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

export async function setStep(
  sb: SupabaseClient,
  userId: string,
  trackSlug: string,
  stepIndex: number,
  done: boolean
) {
  if (done) {
    const { error } = await sb
      .from('progress')
      .upsert(
        { user_id: userId, track_slug: trackSlug, step_index: stepIndex },
        { onConflict: 'user_id,track_slug,step_index' }
      );
    if (error) throw error;
  } else {
    const { error } = await sb
      .from('progress')
      .delete()
      .eq('user_id', userId)
      .eq('track_slug', trackSlug)
      .eq('step_index', stepIndex);
    if (error) throw error;
  }
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
    const { error } = await sb
      .from('badges')
      .upsert({ user_id: userId, track_slug: track.slug }, { onConflict: 'user_id,track_slug' });
    if (error) console.error('[playground] could not award badge:', error.message);
  } else {
    await sb.from('badges').delete().eq('user_id', userId).eq('track_slug', track.slug);
  }
  return earned;
}

/* Award a badge outright — used when someone passes the quiz. Idempotent. */
export async function awardBadge(sb: SupabaseClient, userId: string, trackSlug: string) {
  const { error } = await sb
    .from('badges')
    .upsert({ user_id: userId, track_slug: trackSlug }, { onConflict: 'user_id,track_slug' });
  if (error) throw error;
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
