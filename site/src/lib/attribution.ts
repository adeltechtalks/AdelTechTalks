/* =============================================================================
   Attribution (§21)
   =============================================================================
   Adel posts a TikTok, the link carries `?source=tiktok&campaign=ai-guide-001`,
   and when somebody subscribes we know which post did it.

   WHAT THIS IS NOT
   ----------------
   No third-party script, no cookie, no fingerprint, no cross-site identifier,
   no pageview beacon. Nothing is sent anywhere until the visitor deliberately
   submits a form, and the only thing stored is the four values that were in
   the URL they arrived on. §21: "Do not create invasive tracking."

   FIRST TOUCH WINS
   ----------------
   The parameters are captured once per browser session and not overwritten, so
   a visitor who lands from TikTok, reads three pages and then subscribes is
   still attributed to TikTok rather than to the internal link they last
   clicked. sessionStorage, not localStorage: it is gone when the tab closes.
   ========================================================================== */

const KEY = 'adel.attribution';
const PARAMS = ['source', 'platform', 'campaign', 'guide'] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>>;

/* Values go into a database column, so bound them. Anything longer or stranger
   than this is not a campaign name. */
const clean = (v: string) => v.trim().slice(0, 64).replace(/[^\w .\-/]/g, '');

/** Read the attribution params out of the current URL, if any. */
export function fromUrl(url: URL): Attribution {
  const out: Attribution = {};
  for (const p of PARAMS) {
    const raw = url.searchParams.get(p);
    if (raw) {
      const value = clean(raw);
      if (value) out[p] = value;
    }
  }
  return out;
}

/**
 * Capture on page load. Safe to call on every page; only the first call in a
 * session that actually finds parameters stores anything.
 */
export function capture(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const existing = read();
    if (Object.keys(existing).length > 0) return existing;

    const found = fromUrl(new URL(window.location.href));
    if (Object.keys(found).length === 0) return {};

    sessionStorage.setItem(KEY, JSON.stringify(found));
    return found;
  } catch {
    /* Private mode, storage disabled, quota — none of these are worth an error
       on a page whose job is to show an article. */
    return {};
  }
}

/** Whatever was captured this session. */
export function read(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** The page the visitor was on when they converted — path only, never a query
    string, so nothing accidental (a token, an email in a param) is stored. */
export function landingPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.slice(0, 200);
}
