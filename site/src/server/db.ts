/* =============================================================================
   The service-role database access layer
   =============================================================================
   This is the ONLY file that constructs a Supabase client with the service-role
   key, and it never exports that client — only functions that use it. That is
   deliberate: the service role bypasses every RLS policy, so the moment it is
   exported as a client, any route can do anything with it and the security model
   is whatever each route happened to write. Exporting verbs instead means the
   set of things the server can do is a list you can read in one file.

   The key never reaches the browser. It arrives as a Cloudflare secret binding
   at request time and lives only in the Worker isolate. `npm run security:dist`
   fails the build if the literal `service_role` ever appears in client output.
   ========================================================================== */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { services } from '../site.config';
/* Optional: present in workerd, absent when this module is imported under plain
   Node (the build, and the unit tests). Hence the guarded dynamic shape. */
import { env as workerEnv } from 'cloudflare:workers';

export type ServerEnv = {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/** Thrown when the service-role key cannot be found in ANY binding source.
    Routes turn this into 503 rather than 500: nothing is wrong with the
    request, the server is not configured to serve it. Collapsing the two into
    one opaque 500 is what turned a config error into a log-forensics exercise. */
export class MissingBindingError extends Error {
  readonly name = 'MissingBindingError';
}

/* Where the key can come from, in order.
   -------------------------------------------------------------------------
   `locals.runtime.env` is the adapter's documented path and is what
   `wrangler dev` populates. In the deployed Worker it came back empty even
   though the secret is present on the Worker — verified in the Cloudflare
   dashboard — so the route could never see it.

   `process.env` is the second source. `nodejs_compat` populates it from the
   Worker's bindings, including secrets, and this Worker sets that flag with a
   compatibility date well past its introduction. Reading both means the key is
   found whichever shape the deployment presents, and neither path is a
   fallback in the sense of being worse — they are two names for the same
   binding.

   Nothing here widens what is exposed: `process.env` in a Worker holds exactly
   the bindings that Worker already has. */
function fromEnv(env: ServerEnv, name: 'SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY') {
  const fromLocals = env?.[name];
  if (fromLocals) return fromLocals;
  /* `cloudflare:workers` is the runtime's own module for reading bindings
     outside a request context. Unlike `process.env` — which this build replaces
     with a frozen `{}` at bundle time, verified in dist — it is provided by
     workerd itself and survives bundling. */
  const fromWorkers = (workerEnv as any)?.[name];
  return typeof fromWorkers === 'string' && fromWorkers ? fromWorkers : undefined;
}

/** Which sources were actually visible. Logged on failure so the next report
    says which branch was empty instead of only that something was. */
function bindingDiagnostics(env: ServerEnv): string {
  /* Binding NAMES only — never values. Enough to tell "the adapter handed us
     nothing" apart from "the adapter handed us bindings but not that one",
     which is the distinction that cost a round trip to establish. */
  const names = (o: unknown) =>
    o && typeof o === 'object' ? Object.keys(o as object).sort().join(',') || '(none)' : '(absent)';
  return `locals.runtime.env=[${names(env)}] cloudflare:workers env=[${names(workerEnv)}]`;
}

/* One client per isolate. Constructing it per request is wasteful and, more to
   the point, makes the "who holds this key" question harder to answer. */
let cached: SupabaseClient | null = null;
let cachedFor = '';

function serviceClient(env: ServerEnv): SupabaseClient {
  const url = fromEnv(env, 'SUPABASE_URL') || services.supabaseUrl;
  const key = fromEnv(env, 'SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new MissingBindingError(
      'server/db: SUPABASE_SERVICE_ROLE_KEY is not readable from any binding source. ' +
        'Set it as a Cloudflare secret (wrangler secret put SUPABASE_SERVICE_ROLE_KEY), ' +
        `or in .dev.vars locally. [${bindingDiagnostics(env)}]`
    );
  }
  const fingerprint = `${url}:${key.slice(-8)}`;
  if (!cached || cachedFor !== fingerprint) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    cachedFor = fingerprint;
  }
  return cached;
}

/* ---- the legacy badge table, across the rename ----------------------------
   Migration 02 renames `badges` to `playground_track_badges` and creates a new,
   unrelated `badges` catalogue. A shim that hard-coded either name would break
   on exactly one side of that migration — which would make applying Stage B a
   coordinated deploy instead of a database change.

   So the name is resolved once per isolate by asking the database which one is
   there. Before Stage B this answers `badges`; after it, `playground_track_badges`.
   Neither the shim nor the client changes on the day. */
let legacyBadgeTable: string | null = null;

async function resolveLegacyBadgeTable(sb: SupabaseClient): Promise<string> {
  if (legacyBadgeTable) return legacyBadgeTable;
  const probe = await sb.from('playground_track_badges').select('user_id').limit(1);
  /* PGRST205 = table not in the schema cache, i.e. it does not exist yet. */
  legacyBadgeTable = probe.error && probe.error.code === 'PGRST205' ? 'badges' : 'playground_track_badges';
  return legacyBadgeTable;
}

/** For tests that move the database underneath a running isolate. */
export function _resetTableCache() {
  legacyBadgeTable = null;
}

/* ---- the verbs ------------------------------------------------------------ */

/** Record or clear one Playground step for one user. Idempotent both ways. */
export async function recordStep(
  env: ServerEnv,
  userId: string,
  trackSlug: string,
  stepIndex: number,
  done: boolean
): Promise<void> {
  const sb = serviceClient(env);
  if (done) {
    const { error } = await sb
      .from('progress')
      .upsert(
        { user_id: userId, track_slug: trackSlug, step_index: stepIndex },
        { onConflict: 'user_id,track_slug,step_index' }
      );
    if (error) throw new Error(`recordStep: ${error.message}`);
  } else {
    const { error } = await sb
      .from('progress')
      .delete()
      .eq('user_id', userId)
      .eq('track_slug', trackSlug)
      .eq('step_index', stepIndex);
    if (error) throw new Error(`recordStep: ${error.message}`);
  }
}

/** Award the v2.x track badge. Idempotent — re-taking a quiz never duplicates. */
export async function awardTrackBadge(
  env: ServerEnv,
  userId: string,
  trackSlug: string
): Promise<void> {
  const sb = serviceClient(env);
  const table = await resolveLegacyBadgeTable(sb);
  const { error } = await sb
    .from(table)
    .upsert({ user_id: userId, track_slug: trackSlug }, { onConflict: 'user_id,track_slug' });
  if (error) throw new Error(`awardTrackBadge: ${error.message}`);
}
