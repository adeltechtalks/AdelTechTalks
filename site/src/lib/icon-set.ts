/* =============================================================================
   The icon glyphs, bundled — not read from disk at render time
   =============================================================================
   `Icon.astro` used to resolve every glyph with `createRequire().resolve()` and
   `readFileSync`. On a prerendered page that runs at BUILD time under Node and
   is fine. On a server-rendered page it runs at REQUEST time inside the
   Cloudflare Worker, where there is no node_modules to resolve and no file to
   read: `require.resolve` returns undefined, `readFileSync(undefined)` throws,
   and because Astro streams the response the visitor gets HTTP 200 with an
   empty body. That is exactly what /badge/<id> — the only prerender = false
   route in the site — was doing in production.

   Importing the SVGs with Vite's `?raw` puts their text in the module graph, so
   the Worker ships the bytes it needs and never touches a filesystem. Twenty
   glyphs, about 9 KB.

   Add an entry here when a NEW icon is used on a server-rendered route. Icons on
   prerendered pages still fall back to the build-time file read, so they keep
   working whether or not they are listed.
   ========================================================================== */

import i_arrow_right from 'lucide-static/icons/arrow-right.svg?raw';
import i_award from 'lucide-static/icons/award.svg?raw';
import i_building_2 from 'lucide-static/icons/building-2.svg?raw';
import i_check from 'lucide-static/icons/check.svg?raw';
import i_clapperboard from 'lucide-static/icons/clapperboard.svg?raw';
import i_copy from 'lucide-static/icons/copy.svg?raw';
import i_crosshair from 'lucide-static/icons/crosshair.svg?raw';
import i_download from 'lucide-static/icons/download.svg?raw';
import i_external_link from 'lucide-static/icons/external-link.svg?raw';
import i_facebook from 'lucide-static/icons/facebook.svg?raw';
import i_link from 'lucide-static/icons/link.svg?raw';
import i_linkedin from 'lucide-static/icons/linkedin.svg?raw';
import i_mail from 'lucide-static/icons/mail.svg?raw';
import i_party_popper from 'lucide-static/icons/party-popper.svg?raw';
import i_play from 'lucide-static/icons/play.svg?raw';
import i_smartphone from 'lucide-static/icons/smartphone.svg?raw';
import i_sparkles from 'lucide-static/icons/sparkles.svg?raw';
import i_store from 'lucide-static/icons/store.svg?raw';
import i_twitter from 'lucide-static/icons/twitter.svg?raw';
import i_workflow from 'lucide-static/icons/workflow.svg?raw';

export const BUNDLED_ICONS: Record<string, string> = {
  'arrow-right': i_arrow_right,
  'award': i_award,
  'building-2': i_building_2,
  'check': i_check,
  'clapperboard': i_clapperboard,
  'copy': i_copy,
  'crosshair': i_crosshair,
  'download': i_download,
  'external-link': i_external_link,
  'facebook': i_facebook,
  'link': i_link,
  'linkedin': i_linkedin,
  'mail': i_mail,
  'party-popper': i_party_popper,
  'play': i_play,
  'smartphone': i_smartphone,
  'sparkles': i_sparkles,
  'store': i_store,
  'twitter': i_twitter,
  'workflow': i_workflow,
};
