#!/usr/bin/env node
// Scanner regression tests: each fixture has a real problem that must be
// reported and a look-alike that must not be. Run: node tests/run.mjs
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const check = join(here, '../skills/web-ui-pitfalls/scripts/check.mjs');
const scan = join(here, '../skills/launch-security-legal-check/scripts/scan.mjs');

function run(script, fixture) {
  try {
    return execFileSync(process.execPath, [script], { cwd: join(here, 'fixtures', fixture), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return (e.stdout ?? '') + (e.stderr ?? '');
  }
}

const cases = [
  {
    name: 'untranslated strings',
    script: check,
    fixture: 'translation',
    expect: [/Weekly summary|Nothing here yet/, /2 possibly untranslated string\(s\) in src\/Page\.tsx/],
    reject: [/Active today/, /Total points/, /Acme Notes/, /Redeem Code/],
  },
  {
    name: 'native confirm/alert',
    script: check,
    fixture: 'confirm',
    expect: [/src\/Delete\.tsx:3 — native confirm\(\)/, /src\/Delete\.tsx:3 — native alert\(\)/],
    reject: [/ConfirmDialog\.tsx/, /service\.ts/],
  },
  {
    name: 'hard-coded colors',
    script: check,
    fixture: 'colors',
    expect: [/src\/Banner\.tsx \(2\).*hard-coded text\/background colors/],
    reject: [/Icons\.tsx/],
  },
  {
    name: 'back controls',
    script: check,
    fixture: 'back',
    expect: [/src\/Profile\.tsx:6 — Back control/, /src\/Profile\.tsx:7 — Back control/],
    reject: [/Forgot\.tsx/],
  },
  {
    name: 'effects returning a value',
    script: check,
    fixture: 'effects',
    expect: [
      /\[Must\] src\/Picker\.tsx:14 — effect body returns the result of window\.scrollTo/,
      /\[Must\] src\/Picker\.tsx:15 — effect body returns the result of compute/,
      /\[Should\] src\/Picker\.tsx:17 — effect body returns the result of onMeasure/,
    ],
    reject: [/Picker\.tsx:(6|9|10|11|12) /],
  },
  {
    name: 'fetch proxy headers and hidden errors',
    script: check,
    fixture: 'proxy',
    expect: [/bad\/middleware\.ts:3 — fetch\(\) proxy forwards/, /bad\/middleware\.ts:9 — \.json\(\)\.catch/],
    reject: [/good\/middleware\.ts/],
  },
  {
    name: 'error boundary, 404 route, native select (missing)',
    script: check,
    fixture: 'resilience-bad',
    expect: [/\[Must\] - — no error boundary/, /\[Should\] - — no catch-all \(404\) route/, /src\/App\.tsx — native <select>/],
    reject: [],
  },
  {
    name: 'error boundary, 404 route (present)',
    script: check,
    fixture: 'resilience-good',
    expect: [],
    reject: [/error boundary/, /catch-all/, /native <select>/],
  },
  {
    name: 'licenses',
    script: scan,
    fixture: 'licenses',
    expect: [/no-license-pkg — no license in package\.json, LICENSE or README \(pulled in by passport\)/],
    reject: [/\] pause —/],
  },
];

let failed = 0;
for (const c of cases) {
  const out = run(c.script, c.fixture);
  const missing = c.expect.filter((re) => !re.test(out));
  const wrong = c.reject.filter((re) => re.test(out));
  if (missing.length || wrong.length) {
    failed++;
    console.log(`FAIL ${c.name}`);
    for (const re of missing) console.log(`  expected but not reported: ${re}`);
    for (const re of wrong) console.log(`  reported but should not be: ${re}`);
    console.log(out.split('\n').map((l) => '    | ' + l).join('\n'));
  } else {
    console.log(`ok   ${c.name}`);
  }
}
process.exit(failed ? 1 : 0);
