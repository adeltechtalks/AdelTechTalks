/// <reference types="astro/client" />

/* The Cloudflare adapter puts the Worker's bindings on locals.runtime.env.
   SUPABASE_SERVICE_ROLE_KEY is a secret binding — set with
   `wrangler secret put SUPABASE_SERVICE_ROLE_KEY` for production, and in
   `.dev.vars` (gitignored) for `wrangler dev`. It is never committed and never
   reaches the browser. */
type Env = {
  SUPABASE_SERVICE_ROLE_KEY?: string;
  /* Optional override; production reads the URL from site.config.ts. */
  SUPABASE_URL?: string;
};

declare namespace App {
  interface Locals {
    runtime?: { env: Env };
  }
}
