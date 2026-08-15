/* =============================================================================
   remark-terms — [[English term]] inside Markdown (§11)
   =============================================================================
   copy.ts has always supported a [[term]] marker, and Rich.astro renders it as
   a bidi-isolated LTR run so English technical terms stay English on an Arabic
   page. Markdown bodies did not go through Rich, so an Arabic guide written
   with the same convention shipped the literal brackets to the reader.

   One convention, both places. An author writes [[prompt]] in copy.ts or in a
   .md file and gets the same result.

   SAFETY: the term is inserted as raw HTML, so it is escaped here first.
   Astro's Markdown pipeline does not sanitise author content — but the content
   is files in git written by Adel, and a marker in the body was already able to
   contain raw HTML before this plugin existed. Escaping keeps this plugin from
   widening that.
   ========================================================================== */

import { visit } from 'unist-util-visit';

const MARKER = /\[\[(.+?)\]\]/g;

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function remarkTerms() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null || !MARKER.test(node.value)) return;
      MARKER.lastIndex = 0;

      const parts = node.value.split(/\[\[(.+?)\]\]/g);
      const replacement = [];

      parts.forEach((part, i) => {
        if (part === '') return;
        if (i % 2 === 1) {
          /* Three words or more is a phrase and is allowed to wrap; a short
             term is kept on one line, matching Rich.astro exactly. */
          const wrap = part.trim().split(/\s+/).length > 2 ? ' term--wrap' : '';
          replacement.push({
            type: 'html',
            value: `<span class="term${wrap}">${escapeHtml(part)}</span>`,
          });
        } else {
          replacement.push({ type: 'text', value: part });
        }
      });

      parent.children.splice(index, 1, ...replacement);
      /* Skip the nodes just inserted so the visitor does not re-scan them. */
      return index + replacement.length;
    });
  };
}
