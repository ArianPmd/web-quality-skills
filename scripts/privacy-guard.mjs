#!/usr/bin/env node
// Blocks a commit that would publish something private.
//
// Two kinds of checks on the staged files:
//  1. Generic: e-mail addresses, private keys, common API key / token shapes.
//  2. Personal: every line of `.private-words` (git-ignored, never committed)
//     is a word that must never appear here — your project names, domains,
//     usernames, service accounts. Case-insensitive.
//
// Run by .githooks/pre-commit; also `node scripts/privacy-guard.mjs --all`
// to scan every tracked file.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const all = process.argv.includes('--all');
const files = execSync(all ? 'git ls-files' : 'git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => f !== 'scripts/privacy-guard.mjs');

const GENERIC = [
  ['e-mail address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /AKIA[0-9A-Z]{16}/],
  ['GitHub token', /gh[pousr]_[A-Za-z0-9]{30,}/],
  ['Stripe live key', /sk_live_[A-Za-z0-9]{10,}/],
  ['Slack token', /xox[baprs]-[A-Za-z0-9-]{10,}/],
  ['JWT', /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
];
// Placeholder addresses used in examples are fine.
const ALLOWED_EMAIL = /@(example\.(com|org|net)|your-domain\.\w+|noreply\.github\.com)$/i;

const words = existsSync('.private-words')
  ? readFileSync('.private-words', 'utf8')
      .split('\n')
      .map((w) => w.trim())
      .filter((w) => w && !w.startsWith('#'))
  : [];

const problems = [];
for (const file of files) {
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line, i) => {
    for (const [label, re] of GENERIC) {
      const m = line.match(re);
      if (m && !(label === 'e-mail address' && ALLOWED_EMAIL.test(m[0]))) problems.push(`${file}:${i + 1}  ${label}`);
    }
    for (const w of words) {
      if (line.toLowerCase().includes(w.toLowerCase())) problems.push(`${file}:${i + 1}  private word (see .private-words)`);
    }
  });
}

if (!existsSync('.private-words')) {
  console.warn('privacy-guard: no .private-words file — only generic checks ran. Create it (one word per line).');
}
if (problems.length) {
  console.error('privacy-guard: blocked — this would publish something private:\n  ' + problems.join('\n  '));
  console.error('Remove it (or, if it is a false alarm, adjust the pattern) and commit again.');
  process.exit(1);
}
console.log(`privacy-guard: ${files.length} file(s) clean.`);
