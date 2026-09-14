#!/usr/bin/env node
/* Exportability test.
 *
 * The generic tree — engine/, skills/, templates/, docs/ and the top-level files —
 * must contain NO brand-specific value. Any brand's configuration belongs in its
 * own profile under examples/.
 *
 * Without this test, "exportable" is an intention that rots on the first edit.
 *
 * Run: node scripts/check-generic.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');

/* Everything here must stay brand-neutral. examples/ is deliberately excluded —
   that is where brand-specific material is supposed to live. */
const GENERIC = ['engine', 'skills', 'templates', 'docs'];
const GENERIC_FILES = ['SKILL.md', 'README.md', 'QUICKSTART.md', 'LIMITATIONS.md'];

const FORBIDDEN = [
  { re: /adeltechtalks/i, why: 'brand name' },
  { re: /\b(?:#|0x)?(?:2563EB|1746A2|DCEBFF|2DD4A8|171A1F|667085|FAFAF8|E6E8EC|FF6B57|6C41E4|855FF2|DB4A9B|3E7BFA|0B0918)\b/i, why: 'brand colour value' },
  { re: /\b(?:Montserrat|Readex|Ghorab|JetBrains Mono|Caveat|Cairo|Tajawal|Amiri|Alexandria)\b/, why: 'brand typeface' },
  { re: /\b(?:site\/src|brand\/tokens|\.claude\/skills)\b/, why: 'host-project path' },
  { re: /\bFold-First\b/, why: 'brand programme name' },
  { re: /\bLiquid Glass\b/, why: 'brand feature name' },
];

function walk(p, acc = []) {
  for (const name of readdirSync(p)) {
    const full = join(p, name);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (/\.(md|json|mjs|js)$/.test(name)) acc.push(full);
  }
  return acc;
}

const files = [
  ...GENERIC.flatMap((d) => { try { return walk(join(pkg, d)); } catch { return []; } }),
  ...GENERIC_FILES.map((f) => join(pkg, f)),
];

const failures = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const { re, why } of FORBIDDEN) {
      const m = line.match(re);
      if (m) failures.push(`${relative(pkg, file)}:${i + 1}  ${why} — "${m[0]}"`);
    }
  });
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} brand-specific value(s) leaked into the generic tree:\n`);
  for (const f of failures) console.error('  ' + f);
  console.error('\nMove them into a brand profile under examples/, or phrase the rule in terms of the profile.\n');
  process.exit(1);
}
console.log(`✓ generic tree is brand-neutral (${files.length} files checked)`);
