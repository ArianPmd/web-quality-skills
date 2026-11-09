#!/usr/bin/env node
// Pre-launch scan, dependency-free (Node 18+).
//   node scan.mjs                 secrets, committed .env files, licenses, lockfile
//   node scan.mjs --url <url>     also: response headers + cookies of a URL you own
// Found secrets are never printed in full.
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const findings = [];
const add = (level, where, msg) => findings.push({ level, where, msg });
const mask = (s) => `${s.slice(0, 4)}…(${s.length} chars)`;

// --- tracked files (git) or a plain walk -----------------------------------
let tracked = [];
try {
  tracked = execSync('git ls-files', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n').filter(Boolean);
} catch {
  add('Info', '-', 'not a git repository — scanning the folder instead');
  const walk = (d) =>
    readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      ['node_modules', '.git', 'dist', 'build'].includes(e.name) ? [] : e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)],
    );
  tracked = walk('.');
}

// --- 1. committed env / key files ------------------------------------------
for (const f of tracked) {
  const base = f.split('/').pop();
  if (/^\.env(\..+)?$/.test(base) && !/\.(example|sample|template)$/.test(base)) add('Must', f, '.env file is committed — remove it from git and rotate its secrets');
  if (/\.(pem|p12|pfx|key)$/.test(base) || /^id_(rsa|ed25519)$/.test(base)) add('Must', f, 'key/certificate file is committed');
}

// --- 2. secrets in tracked text files --------------------------------------
const PATTERNS = [
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['AWS access key', /\bAKIA[0-9A-Z]{16}\b/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['Stripe live key', /\b[sr]k_live_[A-Za-z0-9]{10,}\b/],
  ['Slack token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['DB URL with password', /\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis):\/\/[^:\s/]+:[^@\s]{3,}@/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ['assigned secret', /\b(secret|password|passwd|api[_-]?key|token|private[_-]?key)\s*[:=]\s*["'][^"'\s]{12,}["']/i],
];
const testHits = new Set();
const TEXT = /\.(js|mjs|cjs|ts|tsx|jsx|json|ya?ml|toml|env|ini|cfg|conf|properties|py|rb|go|java|php|cs|sh|md|txt|html|vue|svelte)$/i;
for (const f of tracked.filter((f) => TEXT.test(f) || /^\.env/.test(f.split('/').pop()))) {
  if (/(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock)$/.test(f)) continue;
  let text;
  try {
    text = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  if (text.length > 2_000_000) continue;
  text.split('\n').forEach((line, i) => {
    for (const [label, re] of PATTERNS) {
      const m = line.match(re);
      if (!m) continue;
      if (/example|placeholder|your[-_]|changeme|xxx|<.*>|\$\{|process\.env|import\.meta\.env/i.test(line)) continue;
      if (/\.(example|sample|template)$/.test(f)) continue;
      // Local / CI throwaway databases (localhost or a docker service name).
      if (label === 'DB URL with password' && /@(localhost|127\.0\.0\.1|postgres|mysql|db|database|redis|mongo)[:/]/.test(line)) continue;
      // Test fixtures usually hold throwaway values: one summary line, not one per hit.
      if (/(^|\/)(tests?|__tests__|e2e|fixtures?|mocks?)\/|\.(spec|test)\.[jt]sx?$/.test(f)) {
        testHits.add(f);
        continue;
      }
      add('Must', `${f}:${i + 1}`, `${label}: ${mask(m[0])} — rotate it and move it to environment variables`);
    }
  });
}

if (testHits.size) {
  add('Should', [...testHits].slice(0, 3).join(', ') + (testHits.size > 3 ? ` +${testHits.size - 3} more` : ''), 'secret-looking values in test files — fine if they are test-only, never real credentials');
}

// --- 2b. secrets in git history (removed files and old versions) ----------
// A secret deleted from the code is still in every clone of the history.
const STRONG = PATTERNS.filter(([label]) => label !== 'assigned secret' && label !== 'JWT');
try {
  const log = execSync('git log --all -p --no-color --no-ext-diff -U0 --pretty=format:@@@commit%x20%h', {
    encoding: 'utf8',
    maxBuffer: 512 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  let commit = '';
  let file = '';
  const reported = new Set();
  for (const line of log.split('\n')) {
    if (line.startsWith('@@@commit ')) commit = line.slice(10);
    else if (line.startsWith('+++ b/')) file = line.slice(6);
    else if (line.startsWith('+') && !line.startsWith('+++')) {
      if (/\.(example|sample|template)$/.test(file) || /(^|\/)(tests?|__tests__|e2e|fixtures?|mocks?)\//.test(file)) continue;
      for (const [label, re] of STRONG) {
        const m = line.match(re);
        if (!m || /example|placeholder|your[-_]|changeme|<.*>/i.test(line)) continue;
        if (label === 'DB URL with password' && /@(localhost|127\.0\.0\.1|postgres|mysql|db|database|redis|mongo)[:/]/.test(line)) continue;
        const key = `${label}|${m[0]}`;
        if (reported.has(key)) continue;
        reported.add(key);
        add('Must', `history ${commit} ${file}`, `${label}: ${mask(m[0])} was committed — rotate it (removing it from the code is not enough)`);
      }
    }
  }
} catch {
  /* not a git repo, or history too large — skipped */
}

// --- 2c. known-vulnerable dependencies (package manager audit) -------------
{
  const pm = existsSync('pnpm-lock.yaml') ? 'pnpm' : existsSync('yarn.lock') ? 'yarn' : existsSync('package-lock.json') ? 'npm' : null;
  if (pm) {
    const cmd = { npm: 'npm audit --omit=dev --json', pnpm: 'pnpm audit --prod --json', yarn: 'yarn npm audit --environment production --json' }[pm];
    let out = '';
    try {
      out = execSync(cmd, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'], timeout: 120_000 });
    } catch (e) {
      out = e.stdout ?? ''; // audit exits non-zero when it finds something
    }
    try {
      const j = JSON.parse(out);
      const v = j.metadata?.vulnerabilities ?? {};
      const crit = v.critical ?? 0;
      const high = v.high ?? 0;
      const mod = v.moderate ?? 0;
      if (crit + high) add('Must', pm, `${crit} critical, ${high} high vulnerabilities in production dependencies — run \`${cmd.replace(' --json', '')}\``);
      else if (mod) add('Should', pm, `${mod} moderate vulnerabilities in production dependencies`);
      else add('Info', pm, 'audit found no known vulnerabilities in production dependencies');
    } catch {
      add('Info', pm, `could not read the audit result — run \`${cmd.replace(' --json', '')}\` yourself (needs network)`);
    }
  }
}

// --- 3. lockfile -------------------------------------------------------------
if (existsSync('package.json') && !['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lockb'].some((l) => existsSync(l))) {
  add('Should', 'package.json', 'no lockfile committed — builds are not reproducible');
}

// --- 4. dependency licenses (node_modules, incl. pnpm store) ----------------
const RISKY = /(^|[^L])GPL|AGPL|SSPL|BUSL|Commons-Clause|CC-BY-NC|UNLICENSED/i;
const seen = new Map();
const dependents = new Map(); // package -> Set of packages that depend on it
// Old packages that state their license only in prose; verified by hand.
const KNOWN_LICENSES = { pause: 'MIT', 'buffer-equal-constant-time': 'BSD-3-Clause' };
// A license stated in a LICENSE/COPYING/README file when package.json has none.
function licenseFromFiles(dir) {
  let names = [];
  try {
    names = readdirSync(dir).filter((n) => /^(licen[cs]e|copying|readme)(\.|$)/i.test(n));
  } catch {
    return '';
  }
  names.sort((a, b) => (/^readme/i.test(a) ? 1 : 0) - (/^readme/i.test(b) ? 1 : 0)); // LICENSE first
  for (const n of names) {
    let t = '';
    try {
      t = readFileSync(join(dir, n), 'utf8').slice(0, 20000);
    } catch {
      continue;
    }
    if (/^readme/i.test(n)) {
      const i = t.search(/^#+\s*licen[cs]e/im);
      if (i === -1) continue;
      t = t.slice(i, i + 3000);
    }
    if (/\bMIT License\b|Permission is hereby granted, free of charge/i.test(t)) return 'MIT';
    if (/\bISC License\b|Permission to use, copy, modify, and\/or distribute/i.test(t)) return 'ISC';
    if (/Apache License,?\s+Version 2\.0/i.test(t)) return 'Apache-2.0';
    if (/Redistribution and use in source and binary forms/i.test(t)) return /Neither the name/i.test(t) ? 'BSD-3-Clause' : 'BSD-2-Clause';
    if (/GNU AFFERO GENERAL PUBLIC LICENSE/i.test(t)) return 'AGPL';
    if (/GNU LESSER GENERAL PUBLIC LICENSE/i.test(t)) return 'LGPL';
    if (/GNU GENERAL PUBLIC LICENSE/i.test(t)) return 'GPL';
    if (/\bCC0\b|Unlicense|public domain/i.test(t)) return 'Public domain / CC0';
  }
  return '';
}
// Which of the project's own (top-level) dependencies pulls a package in.
function topLevelVia(name, roots) {
  const seenUp = new Set([name]);
  let frontier = [name];
  const found = new Set();
  while (frontier.length && found.size < 3) {
    const next = [];
    for (const n of frontier) {
      for (const parent of dependents.get(n) ?? []) {
        if (seenUp.has(parent)) continue;
        seenUp.add(parent);
        if (roots.has(parent)) found.add(parent);
        else next.push(parent);
      }
    }
    frontier = next;
  }
  return [...found];
}
function readPkg(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
}
function scanModules(nm) {
  if (!existsSync(nm)) return;
  for (const e of readdirSync(nm, { withFileTypes: true })) {
    if (e.name === '.pnpm') {
      for (const s of readdirSync(join(nm, '.pnpm'), { withFileTypes: true })) scanModules(join(nm, '.pnpm', s.name, 'node_modules'));
      continue;
    }
    if (e.name.startsWith('.')) continue;
    const dirs = e.name.startsWith('@') ? readdirSync(join(nm, e.name)).map((n) => join(nm, e.name, n)) : [join(nm, e.name)];
    for (const d of dirs) {
      const p = readPkg(d);
      if (!p?.name) continue;
      for (const dep of Object.keys({ ...p.dependencies, ...p.optionalDependencies, ...p.peerDependencies })) {
        if (!dependents.has(dep)) dependents.set(dep, new Set());
        dependents.get(dep).add(p.name);
      }
      if (seen.has(p.name)) continue;
      const lic = typeof p.license === 'string' ? p.license : p.license?.type ?? (Array.isArray(p.licenses) ? p.licenses.map((l) => l.type ?? l).join(' OR ') : '');
      seen.set(p.name, lic || licenseFromFiles(d) || KNOWN_LICENSES[p.name] || 'NONE');
    }
  }
}
scanModules('node_modules');
// The project's own dependencies (root and workspace package.json files).
const roots = new Set();
const pkgFiles = new Set(tracked.filter((f) => /(^|\/)package\.json$/.test(f) && !f.includes('node_modules')));
if (existsSync('package.json')) pkgFiles.add('package.json');
for (const f of pkgFiles) {
  try {
    const p = JSON.parse(readFileSync(f, 'utf8'));
    Object.keys({ ...p.dependencies, ...p.devDependencies, ...p.optionalDependencies }).forEach((d) => roots.add(d));
  } catch {
    /* ignore */
  }
}
if (seen.size) {
  for (const [name, lic] of seen) {
    const via = roots.has(name) ? [] : topLevelVia(name, roots);
    const viaText = roots.has(name) ? ' (a direct dependency)' : via.length ? ` (pulled in by ${via.join(', ')})` : '';
    if (lic === 'NONE') add('Should', name, `no license in package.json, LICENSE or README${viaText} — check its repository`);
    else if (RISKY.test(lic) && !/LGPL/i.test(lic)) add('Must', name, `license "${lic}"${viaText} — check it is compatible with how you ship this app`);
    else if (/SEE LICENSE/i.test(lic)) add('Should', name, `custom license (${lic})${viaText} — read it`);
  }
  add('Info', 'node_modules', `${seen.size} packages' licenses read (includes dev dependencies — only shipped ones matter)`);
} else if (existsSync('package.json')) {
  add('Info', '-', 'node_modules not installed — install dependencies to check licenses');
}

// --- 5. optional: headers of a URL the user owns ----------------------------
const ui = process.argv.indexOf('--url');
if (ui > -1 && process.argv[ui + 1]) {
  const url = process.argv[ui + 1];
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const h = res.headers;
    const want = [
      ['strict-transport-security', 'Must', 'HSTS missing'],
      ['content-security-policy', 'Should', 'no Content-Security-Policy (start with Report-Only)'],
      ['x-content-type-options', 'Should', 'X-Content-Type-Options: nosniff missing'],
      ['referrer-policy', 'Should', 'Referrer-Policy missing'],
      ['permissions-policy', 'Should', 'Permissions-Policy missing'],
    ];
    for (const [name, level, msg] of want) if (!h.get(name)) add(level, url, msg);
    if (!h.get('x-frame-options') && !/frame-ancestors/.test(h.get('content-security-policy') ?? '')) add('Should', url, 'clickjacking protection missing (X-Frame-Options or CSP frame-ancestors)');
    if (/^\s*\*\s*$/.test(h.get('access-control-allow-origin') ?? '') && h.get('access-control-allow-credentials') === 'true') add('Must', url, 'CORS * with credentials');
    const cookies = typeof h.getSetCookie === 'function' ? h.getSetCookie() : [h.get('set-cookie')].filter(Boolean);
    for (const c of cookies) {
      const n = c.split('=')[0];
      if (!/;\s*secure/i.test(c)) add('Must', url, `cookie ${n} without Secure`);
      if (!/;\s*samesite/i.test(c)) add('Should', url, `cookie ${n} without SameSite`);
      if (/sess|token|auth|refresh/i.test(n) && !/;\s*httponly/i.test(c)) add('Must', url, `session-like cookie ${n} without HttpOnly`);
    }
    if (h.get('server') && /\d/.test(h.get('server'))) add('Should', url, `Server header reveals version: ${h.get('server')}`);
    if (h.get('x-powered-by')) add('Should', url, `X-Powered-By reveals the stack: ${h.get('x-powered-by')}`);
    const acao = h.get('access-control-allow-origin');
    if (acao === 'null') add('Must', url, 'CORS allows the "null" origin');

    // Files that must never be public. One GET each (no load); a 200 with
    // the expected content is a finding, anything else is fine.
    const origin = new URL(url).origin;
    const probes = [
      ['/.git/HEAD', /^ref: refs\//, 'Must', 'the .git folder is public — the whole source and history can be downloaded'],
      ['/.env', /^[A-Z0-9_]+=/m, 'Must', 'a .env file is public — rotate every secret in it'],
      ['/.DS_Store', /Bud1/, 'Should', '.DS_Store is public (lists file names)'],
    ];
    for (const [path, looksLike, level, msg] of probes) {
      try {
        const r = await fetch(origin + path, { redirect: 'manual' });
        if (r.status === 200 && looksLike.test((await r.text()).slice(0, 500))) add(level, origin + path, msg);
      } catch {
        /* unreachable — fine */
      }
    }
    try {
      const r = await fetch(origin + '/.well-known/security.txt', { redirect: 'manual' });
      if (r.status !== 200 || !/contact:/i.test(await r.text())) add('Should', origin, 'no /.well-known/security.txt with a Contact for vulnerability reports');
    } catch {
      /* ignore */
    }
  } catch (e) {
    add('Info', url, `could not fetch: ${e.message}`);
  }
}

// --- 6. risky code patterns (leads to confirm) -------------------------------
{
  const CODE = /\.(js|mjs|cjs|ts|tsx|jsx|vue|svelte)$/;
  const isTest = (f) => /(^|\/)(tests?|__tests__|e2e|fixtures?|mocks?)\/|\.(spec|test|stories)\./.test(f);
  const isBuild = (f) => /(^|\/)(dist|build|out|\.next|\.output|coverage)\//.test(f);
  const sinks = [];
  const weakRandom = [];
  for (const f of tracked.filter((f) => CODE.test(f) && !isTest(f) && !isBuild(f))) {
    let text;
    try {
      text = readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    text.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*)/.test(line)) return;
      if (/dangerouslySetInnerHTML|\.innerHTML\s*=|\bv-html\b|\{@html\b|document\.write\(|\beval\(|new Function\(/.test(line)) sinks.push(`${f}:${i + 1}`);
      if (/Math\.random\(\)/.test(line) && /token|secret|code|password|nonce|salt|otp|session|key|invite/i.test(line)) weakRandom.push(`${f}:${i + 1}`);
    });
  }
  for (const w of weakRandom) add('Must', w, 'Math.random() used for something secret-looking — use crypto.getRandomValues / randomBytes');
  if (sinks.length) add('Should', sinks.slice(0, 5).join(', ') + (sinks.length > 5 ? ` +${sinks.length - 5} more` : ''), 'HTML/code injection sinks (innerHTML, dangerouslySetInnerHTML, eval…) — confirm the input is trusted or sanitized');

  // Source maps shipped with the build
  const maps = tracked.filter((f) => isBuild(f) && f.endsWith('.js.map'));
  if (maps.length) add('Should', maps[0], 'source maps are committed in build output — make sure they are not served publicly');
}

// --- 7. CI workflows (GitHub Actions) ----------------------------------------
for (const f of tracked.filter((f) => /^\.github\/workflows\/.+\.ya?ml$/.test(f))) {
  let y;
  try {
    y = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  if (/pull_request_target/.test(y) && /actions\/checkout/.test(y) && /github\.event\.pull_request\.head/.test(y)) {
    add('Must', f, 'pull_request_target checks out the PR code — untrusted code runs with secrets');
  }
  if (!/^\s*permissions\s*:/m.test(y)) add('Should', f, 'no explicit `permissions:` — the job token may have more rights than needed');
  const unpinned = [...y.matchAll(/uses:\s*([\w.-]+\/[\w.\/-]+)@([\w.-]+)/g)].filter(([, repo, ref]) => !/^[0-9a-f]{40}$/.test(ref) && !repo.startsWith('actions/'));
  if (unpinned.length) add('Should', f, `third-party actions not pinned to a commit: ${unpinned.slice(0, 3).map((m) => `${m[1]}@${m[2]}`).join(', ')}`);
  if (/echo\s+.*\$\{\{\s*secrets\./.test(y)) add('Must', f, 'a secret is echoed in a workflow step — it can end up in logs');
}

const order = { Must: 0, Should: 1, Info: 2 };
findings.sort((a, b) => order[a.level] - order[b.level]);
if (!findings.some((f) => f.level !== 'Info')) console.log('scan.mjs: nothing found by the automatic checks.');
for (const f of findings) console.log(`[${f.level}] ${f.where} — ${f.msg}`);
console.log(`\nAutomatic checks only. Continue with the checklists (security, privacy-legal, licensing).`);
