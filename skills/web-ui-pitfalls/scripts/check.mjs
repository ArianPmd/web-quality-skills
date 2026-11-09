#!/usr/bin/env node
// Quick, dependency-free scan for mechanical front-end problems.
// Usage (from the project root): node check.mjs [build-output-dir]
// Prints findings as leads; confirm each before reporting it.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const root = process.cwd();
const buildDir = process.argv[2] ?? ['dist', 'build', 'out', '.next/static'].find((d) => existsSync(join(root, d)));
const SKIP = new Set(['node_modules', '.git', 'coverage', '.turbo', '.cache', '.vercel', '.claude', 'worktrees']);
const findings = [];
const add = (level, where, msg) => findings.push({ level, where, msg });

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(root);
const rel = (p) => relative(root, p).replaceAll('\\', '/');
const text = (p) => {
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return '';
  }
};
const SOURCE = new Set(['.css', '.scss', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.html', '.vue', '.svelte']);
// Build output anywhere in the tree (monorepos: apps/web/dist, …), plus the
// folder passed on the command line.
const BUILD_SEGMENT = /(^|\/)(dist|build|out|\.next|\.output|\.svelte-kit)\//;
const inBuild = (p) => BUILD_SEGMENT.test(rel(p)) || Boolean(buildDir && rel(p).startsWith(buildDir.replaceAll('\\', '/')));
// Comments blanked but newlines kept, so reported line numbers stay right.
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

// 1. Merge-conflict leftovers
for (const f of files.filter((f) => SOURCE.has(extname(f)) && !inBuild(f))) {
  const lines = text(f).split('\n');
  lines.forEach((l, i) => {
    if (/^(<{7}|>{7})( |$)/.test(l) || l === '=======') add('Must', `${rel(f)}:${i + 1}`, 'merge-conflict marker');
  });
}

// 2. CSS brace balance + nested-looking top-level selector
for (const f of files.filter((f) => ['.css', '.scss'].includes(extname(f)) && !inBuild(f))) {
  const css = text(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
  const open = (css.match(/{/g) ?? []).length;
  const close = (css.match(/}/g) ?? []).length;
  if (open !== close) {
    let depth = 0;
    let where = '';
    css.split('\n').forEach((l, i) => {
      if (!where && depth > 0 && /^[.#a-zA-Z[:*][^{]*\{\s*$/.test(l) && !/^\s/.test(l)) where = `${rel(f)}:${i + 1}`;
      depth += (l.match(/{/g) ?? []).length - (l.match(/}/g) ?? []).length;
    });
    add('Must', where || rel(f), `unbalanced braces in CSS ({ ${open} vs } ${close}) — a block is not closed`);
  }
  if (/backdrop-filter\s*:/.test(css) && !/-webkit-backdrop-filter\s*:/.test(css)) {
    add('Should', rel(f), 'backdrop-filter without -webkit-backdrop-filter (Safari)');
  }
  if (/filter\s*:\s*url\(#/.test(css)) add('Should', rel(f), 'filter: url(#…) — breaks if the SVG filter is not in the DOM');
}

// 3. Built CSS still has backdrop-filter?
const builtCss = files.filter((f) => inBuild(f) && extname(f) === '.css');
if (builtCss.length) {
  const where = buildDir ?? rel(builtCss[0]).split('/').slice(0, -1).join('/');
  const srcHas = files.some((f) => ['.css', '.scss'].includes(extname(f)) && !inBuild(f) && /backdrop-filter/.test(text(f)));
  const built = builtCss.map(text).join('\n');
  if (srcHas && !/backdrop-filter/.test(built)) add('Must', where, 'source CSS uses backdrop-filter but the build output has none — the minifier dropped it');
  else if (srcHas && !/-webkit-backdrop-filter/.test(built)) add('Must', where, 'build output has no -webkit-backdrop-filter — glass effects missing in Safari');
} else {
  add('Info', '-', 'no build output found — build the app and pass its folder to also check the built CSS');
}

// 4. Entry HTML basics
for (const f of files.filter((f) => extname(f) === '.html' && !inBuild(f) && /index\.html$/.test(f))) {
  const h = text(f);
  if (!/<html[^>]*\blang=/.test(h)) add('Must', rel(f), '<html> without lang');
  if (!/name=["']viewport["']/.test(h)) add('Must', rel(f), 'no viewport meta tag');
  if (/name=["']viewport["'][^>]*(user-scalable\s*=\s*no|maximum-scale\s*=\s*1)/.test(h)) add('Should', rel(f), 'viewport blocks zoom (accessibility)');
}

// 5. Web app manifest
const manifests = files.filter((f) => /manifest\.(webmanifest|json)$/.test(f) && !inBuild(f) && !rel(f).includes('/locales/'));
for (const f of manifests) {
  let m;
  try {
    m = JSON.parse(text(f));
  } catch {
    continue;
  }
  if (!m.name && !m.short_name) continue;
  if (!m.start_url) add('Should', rel(f), 'manifest has no start_url');
  else if (m.start_url === '/' || m.start_url === './') add('Should', rel(f), 'start_url is "/" — if "/" is a landing page, an installed app reopens there (looks logged out)');
  if (!m.id) add('Should', rel(f), 'manifest has no id');
  if (!(m.icons ?? []).some((i) => /maskable/.test(i.purpose ?? ''))) add('Should', rel(f), 'no maskable icon');
}
// manifest generated by a bundler plugin (e.g. vite-plugin-pwa) — check the config
for (const f of files.filter((f) => /(vite|next|nuxt)\.config\.(t|j|mj)s$/.test(f))) {
  const c = text(f);
  if (/manifest\s*:/.test(c) && /start_url\s*:\s*['"]\/['"]/.test(c)) add('Should', rel(f), 'PWA start_url is "/" — check what "/" shows to a signed-in person');
}

// 6. Translation JSON files: keys missing between languages
const localeDirs = new Map();
for (const f of files.filter((f) => extname(f) === '.json' && /(locales?|i18n|lang|translations?)[\\/]/i.test(f) && !inBuild(f))) {
  const dir = f.slice(0, f.lastIndexOf(f.includes('\\') ? '\\' : '/'));
  if (!localeDirs.has(dir)) localeDirs.set(dir, []);
  localeDirs.get(dir).push(f);
}
const flat = (o, p = '') =>
  Object.entries(o ?? {}).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
for (const [dir, list] of localeDirs) {
  if (list.length < 2) continue;
  const sets = list.map((f) => {
    try {
      return [f, new Set(flat(JSON.parse(text(f))))];
    } catch {
      return [f, null];
    }
  }).filter(([, s]) => s);
  const all = new Set(sets.flatMap(([, s]) => [...s]));
  for (const [f, s] of sets) {
    const missing = [...all].filter((k) => !s.has(k));
    if (missing.length) add('Must', rel(f), `missing ${missing.length} translation key(s), e.g. ${missing.slice(0, 3).join(', ')}`);
  }
}

// Code with comments blanked (newlines kept, so line numbers stay right).
// Good enough for scanning: strings that contain "//" (URLs) are kept.
function stripCodeComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, pre) => pre + ' '.repeat(m.length - pre.length));
}
const lineAt = (src, index) => src.slice(0, index).split('\n').length;
const UI_EXT = ['.tsx', '.jsx', '.vue', '.svelte'];
const CODE_EXT = ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'];

// 7. Back controls that go to a fixed place instead of the previous screen.
// Only real Back controls count: labelled just "Back" (or aria-label
// "Back"/"Go back"), or showing a back-arrow icon. "Back to log in" is a
// link to a known screen, not a Back button.
for (const f of files.filter((f) => UI_EXT.includes(extname(f)) && !inBuild(f))) {
  const src = stripCodeComments(text(f));
  for (const m of src.matchAll(/<(Link|NavLink|a|button)\b([^>]*)>([\s\S]{0,400}?)<\/\1>/g)) {
    const [, , attrs, inner] = m;
    const label = inner
      .replace(/\{\s*t\(\s*['"`]([^'"`]+)['"`][^)]*\)\s*\}/g, '$1')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\{[^}]*\}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (/^back\s+to\b/i.test(label)) continue;
    const ariaBack = /aria-label=\{?\s*(?:t\()?\s*["'`](back|go back)["'`]/i.test(attrs);
    const backIcon = /<(\w*Back\w*Icon|BackArrow\w*|ArrowLeft\w*|ChevronLeft\w*|ArrowBack\w*)\b/.test(inner);
    const isBack = /^(back|go back)$/i.test(label) || ariaBack || backIcon;
    if (!isBack) continue;
    const fixed = /\b(to|href)=\{?\s*["'`]\/[\w/-]*["'`]/.test(attrs) || /navigate\(\s*["'`]\/[\w/-]*["'`]/.test(attrs);
    if (fixed) add('Should', `${rel(f)}:${lineAt(src, m.index)}`, 'Back control with a fixed destination — should return to the previous screen (history back with a fallback)');
  }
}

// 8. Native confirm/alert/prompt calls in UI code (comments ignored; only
// real calls: window.confirm( or a bare confirm( / alert( / prompt( call).
for (const f of files.filter((f) => CODE_EXT.includes(extname(f)) && !inBuild(f))) {
  const src = stripCodeComments(text(f));
  for (const m of src.matchAll(/(?<![\w.$])(?:window\.)?(confirm|alert|prompt)\s*\(/g)) {
    const before = src.slice(Math.max(0, m.index - 20), m.index);
    if (/function\s+$|\b(const|let|var)\s+$|:\s*$/.test(before)) continue; // a definition, not a call
    // A method definition (`async confirm(a, b): Promise<X> {`), not a call.
    const eol = src.indexOf('\n', m.index);
    const rest = src.slice(m.index, eol === -1 ? undefined : eol).trim();
    if (/(^|\s)(async|static|public|private|protected|get|set)\s+$/.test(before) || /^\w+\s*\([^)]*\)\s*(:[^={]+)?\{$/.test(rest)) continue;
    if (/["'`]$/.test(before)) continue; // inside a string
    add('Should', `${rel(f)}:${lineAt(src, m.index)}`, `native ${m[1]}() — a no-op in some installed PWAs/webviews; use an in-app dialog`);
  }
}

// 8a. fetch() proxies that forward Content-Encoding / Content-Length. fetch()
// already decompressed the body; passing those headers on makes the browser
// decode it again and every response arrives empty.
for (const f of files.filter((f) => ['.ts', '.js', '.mjs'].includes(extname(f)) && !inBuild(f) && !/\.(test|spec)\./.test(f))) {
  const src = stripCodeComments(text(f));
  if (!/\bfetch\(/.test(src)) continue;
  const forwards = src.match(/new Headers\(\s*(\w+)\.headers\s*\)|headers\s*:\s*(\w+)\.headers\b/);
  if (!forwards || !/new Response\(/.test(src)) continue;
  if (/content-encoding/i.test(src)) continue; // handled (deleted or filtered)
  add('Must', `${rel(f)}:${lineAt(src, forwards.index)}`, 'fetch() proxy forwards the upstream headers incl. Content-Encoding/Content-Length — fetch already decompressed the body, so the browser gets an empty/broken response; delete both headers');
}
// …and API clients that turn a broken response into null.
for (const f of files.filter((f) => CODE_EXT.includes(extname(f)) && !inBuild(f) && !/\.(test|spec)\./.test(f))) {
  const src = stripCodeComments(text(f));
  for (const m of src.matchAll(/\.json\(\)\s*\.catch\(\s*\(\s*\w*\s*\)\s*=>\s*(null|undefined|\{\s*\}|\[\s*\])\s*\)/g)) {
    add('Should', `${rel(f)}:${lineAt(src, m.index)}`, `.json().catch(() => ${m[1]}) hides a broken response as "no data" — throw with the status instead (return null only for an expected empty 204)`);
  }
}

// 8c. App-level resilience: an error boundary (else any exception blanks
// the page), a custom not-found route, and native <select> lists.
{
  const pkgs = files.filter((f) => /(^|[\\/])package\.json$/.test(f) && !rel(f).includes('node_modules'));
  const deps = new Set();
  for (const f of pkgs) {
    try {
      const p = JSON.parse(text(f));
      Object.keys({ ...p.dependencies, ...p.devDependencies }).forEach((d) => deps.add(d));
    } catch {
      /* ignore */
    }
  }
  const ui = files.filter((f) => ['.tsx', '.jsx', '.ts', '.js'].includes(extname(f)) && !inBuild(f) && !/\.(test|spec|stories)\./.test(f));
  const all = ui.map((f) => stripCodeComments(text(f))).join('\n');
  if (deps.has('react') && ui.length) {
    const hasBoundary = /componentDidCatch|getDerivedStateFromError|errorElement|ErrorBoundary|useRouteError|error\.(t|j)sx?/.test(all) || files.some((f) => /(^|[\\/])error\.(t|j)sx?$/.test(f));
    if (!hasBoundary) add('Must', '-', 'no error boundary in this React app — any runtime error blanks the whole page; add a top-level boundary (and per-route errorElement) with a friendly message, Reload and Go home');
  }
  const usesRouter = deps.has('react-router-dom') || deps.has('react-router') || deps.has('@tanstack/react-router') || deps.has('vue-router');
  const hasNotFound = /path\s*[:=]\s*\{?\s*["'`]\*["'`]|path\s*[:=]\s*\{?\s*["'`]\/\*["'`]|errorElement|notFoundComponent|NotFound|not-found|\/:pathMatch\(\.\*\)/.test(all) || files.some((f) => /(^|[\\/])(not-found|404)\.(t|j)sx?$/.test(f));
  if (usesRouter && !hasNotFound) add('Should', '-', 'no catch-all (404) route — unknown URLs show the router\'s default error or a blank page; add a not-found page made for this product');
  const selects = ui.filter((f) => ['.tsx', '.jsx'].includes(extname(f)) && /<select\b/.test(stripCodeComments(text(f))));
  if (selects.length) add('Should', selects.slice(0, 3).map(rel).join(', ') + (selects.length > 3 ? ` +${selects.length - 3} more` : ''), 'native <select> lists — in a native-feel UI, use the option-picker sheet (native-feel-ui patterns.md › 16)');
}

// 8b. React effects that return a value: `useEffect(() => doSomething())`
// returns doSomething's result, React calls it as the cleanup, and the page
// goes blank ("destroy is not a function"). Bodies belong in braces.
// Severity depends on what the call returns:
//  - Must: async bodies, assignments, and calls known to return a value —
//    timers (a number), fetch/promises, and the scroll APIs, which return a
//    Promise in current browsers (`useEffect(() => window.scrollTo(0, 0))`
//    blanks the page on navigation) — and project functions that return a
//    value.
//  - Skipped: project functions with no value return (`save(...)` that
//    returns undefined is harmless), and cleanup-returning calls
//    (subscribe/listen/on…).
//  - Should: anything else we can't see the definition of.
const codeFiles = files.filter((f) => ['.tsx', '.jsx', '.ts', '.js', '.mjs'].includes(extname(f)) && !inBuild(f));
const returnsValue = new Map(); // function name -> true (returns a value) / false (never)
for (const f of codeFiles) {
  const src = stripCodeComments(text(f));
  for (const m of src.matchAll(/(?:function\s+([\w$]+)\s*\([^)]*\)[^{]*\{|(?:const|let)\s+([\w$]+)\s*=\s*(?:async\s*)?\([^)]*\)[^=]*=>\s*\{)/g)) {
    const name = m[1] ?? m[2];
    // the body: up to the matching closing brace
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < src.length && depth) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    const body = src.slice(m.index + m[0].length, i - 1);
    const valueReturn = /\breturn\s+(?![;}\n])/.test(body.replace(/=>\s*\{[\s\S]*?\}/g, ''));
    returnsValue.set(name, (returnsValue.get(name) ?? false) || valueReturn || /^\s*async\b/.test(m[0].replace(/^(const|let)\s+\w+\s*=\s*/, '')));
  }
}
const ALWAYS_VALUE = /(^|\.)(scrollTo|scroll|scrollBy|scrollIntoView|setTimeout|setInterval|requestAnimationFrame|requestIdleCallback|fetch|then|catch|finally|play|requestFullscreen|exitFullscreen|showModal|open|postMessage)$/;
for (const f of codeFiles) {
  const src = stripCodeComments(text(f));
  for (const m of src.matchAll(/\buse(?:Layout)?Effect\(\s*(async\s*)?\(\s*\)\s*=>\s*(?!\{|\(\s*\)\s*=>)([\w$.]+)\s*(\(|=[^=>])/g)) {
    const [, isAsync, callee, after] = m;
    const where = `${rel(f)}:${lineAt(src, m.index)}`;
    const fix = 'React treats the returned value as the cleanup and crashes ("destroy is not a function") — wrap the body in {}';
    if (isAsync) { add('Must', where, `async effect returns a Promise — ${fix}`); continue; }
    if (after.startsWith('=')) { add('Must', where, `effect body is an assignment, which returns its value — ${fix}`); continue; }
    if (/(^|\.)(subscribe|listen|watch|observe|on|register|connect|bind|attach|track)$/i.test(callee)) continue;
    const name = callee.split('.').pop();
    if (ALWAYS_VALUE.test(callee)) { add('Must', where, `effect body returns the result of ${callee}(…) (${/scroll/i.test(callee) ? 'a Promise in current browsers' : 'a value'}) — ${fix}`); continue; }
    if (returnsValue.has(name)) {
      if (returnsValue.get(name)) add('Must', where, `effect body returns the result of ${callee}(…), which returns a value — ${fix}`);
      continue; // defined in the project without a value return: harmless
    }
    add('Should', where, `effect body returns the result of ${callee}(…) — make sure it returns nothing or a cleanup function, or wrap the body in {}`);
  }
}

// 9. iOS: inputs under 16px zoom the page; 100vh taller than the screen
for (const f of files.filter((f) => ['.css', '.scss'].includes(extname(f)) && !inBuild(f))) {
  const css = stripComments(text(f));
  for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    // The rule must style the field itself: in at least one selector of the
    // list, the last compound (after any combinator) is input/textarea/select.
    // `.search-input` (a class) and `input ~ label` (styles the label) don't count.
    const stylesField = m[1]
      .split(',')
      .map((sel) => sel.trim().split(/\s*[\s>+~]\s*/).pop() ?? '')
      .some((subject) => /^(input|textarea|select)(?![\w-])/.test(subject));
    if (!stylesField) continue;
    const fs = m[2].match(/font-size\s*:\s*([\d.]+)(px|rem|em)/);
    if (!fs) continue;
    const px = fs[2] === 'px' ? Number(fs[1]) : Number(fs[1]) * 16;
    if (px < 16) {
      const start = m.index + (m[1].length - m[1].trimStart().length);
      const line = css.slice(0, start).split('\n').length;
      add('Should', `${rel(f)}:${line}`, `form field font-size ${fs[1]}${fs[2]} (<16px) — iOS Safari zooms into it`);
    }
  }
  if (/\b100vh\b/.test(css) && !/\b100[ds]vh\b/.test(css)) add('Should', rel(f), '100vh without 100dvh/100svh — taller than the visible screen on mobile browsers');
}

// 10. Hard-coded colors for text and backgrounds in components (should be
// theme tokens). Not flagged: white fill/stroke on SVG icons (icons on
// colored tiles are white in both themes), and colors in a palette object
// or array (keys like color, tint, bg, tile, brand) that deliberately pick a
// fixed hue.
{
  const hits = [];
  for (const f of files.filter((f) => UI_EXT.includes(extname(f)) && !inBuild(f))) {
    const src = stripCodeComments(text(f));
    let n = 0;
    // style={{ color: '#…', background: '#…' }} and CSS-in-JS templates/objects
    for (const m of src.matchAll(/style=\{\{([^}]*)\}\}/g)) {
      n += (m[1].match(/\b(color|background(?:Color)?|borderColor)\s*:\s*["'`]#[0-9a-fA-F]{3,8}\b/g) ?? []).length;
    }
    for (const m of src.matchAll(/(?:css|styled\.\w+|styled\([^)]*\))\s*`([^`]*)`/g)) {
      n += (m[1].match(/(^|[\s;{])(color|background(?:-color)?)\s*:\s*#[0-9a-fA-F]{3,8}\b/g) ?? []).length;
    }
    // color="#123456" on non-SVG elements (SVG fill/stroke white is fine)
    for (const m of src.matchAll(/<(\w+)[^>]*\b(color|bgcolor)=["']#[0-9a-fA-F]{3,8}["']/g)) {
      if (!/^(svg|path|circle|rect|g|line|polyline|polygon|ellipse)$/i.test(m[1])) n++;
    }
    if (n >= 2) hits.push(`${rel(f)} (${n})`);
  }
  if (hits.length) add('Should', hits.slice(0, 4).join(', ') + (hits.length > 4 ? ` +${hits.length - 4} more` : ''), 'hard-coded text/background colors in components — check both themes, prefer CSS variables');
}

// 11. Text that skips the translation function (only if the app is translated)
{
  const uiFiles = files.filter((f) => ['.tsx', '.jsx'].includes(extname(f)) && !inBuild(f) && !/\.(test|spec|stories)\./.test(f));
  const usesT = uiFiles.some((f) => /\bt\(\s*['"`]|useTranslation|FormattedMessage|\$t\(/.test(text(f)));
  if (usesT && localeDirs.size + files.filter((f) => /i18n|locale/i.test(f)).length > 0) {
    // a) Every source string the dictionaries already know.
    const known = new Set();
    const collectKeys = (o) => {
      for (const [k, v] of Object.entries(o ?? {})) {
        known.add(k);
        if (v && typeof v === 'object') collectKeys(v);
      }
    };
    for (const f of files.filter((f) => /(^|\/)(i18n|locales?|lang|translations?)\//i.test(rel(f)) && !inBuild(f))) {
      const ext = extname(f);
      if (ext === '.json') {
        try {
          collectKeys(JSON.parse(text(f)));
        } catch {
          /* not JSON */
        }
      } else if (['.ts', '.js', '.mjs'].includes(ext)) {
        for (const m of text(f).matchAll(/^\s*(?:"((?:[^"\\]|\\.)+)"|'((?:[^'\\]|\\.)+)')\s*:/gm)) known.add((m[1] ?? m[2]).replace(/\\(['"\\])/g, '$1'));
      }
    }
    // b) Components that translate a prop themselves: <Row label="…"> is fine
    //    when Row's source passes `label` through t()/i18n.t().
    const translatesProp = new Map(); // component name -> Set of prop names
    for (const f of uiFiles) {
      const src = stripCodeComments(text(f));
      const props = new Set([...src.matchAll(/\b(?:t|i18n\.t|translate)\(\s*(?:props\.)?([a-zA-Z_]\w*)\s*[,)]/g)].map((m) => m[1]));
      if (!props.size) continue;
      for (const m of src.matchAll(/(?:function\s+([A-Z]\w*)|(?:const|let)\s+([A-Z]\w*)\s*=)/g)) {
        const name = m[1] ?? m[2];
        if (!translatesProp.has(name)) translatesProp.set(name, new Set());
        props.forEach((p) => translatesProp.get(name).add(p));
      }
    }
    // c) Brand and product names.
    const brands = new Set();
    for (const f of files.filter((f) => /(manifest\.(webmanifest|json)|package\.json)$/.test(f) && !inBuild(f) && !rel(f).includes('node_modules'))) {
      try {
        const j = JSON.parse(text(f));
        for (const k of ['name', 'short_name', 'productName']) if (typeof j[k] === 'string') brands.add(j[k].toLowerCase());
      } catch {
        /* ignore */
      }
    }
    for (const f of files.filter((f) => extname(f) === '.html' && !inBuild(f))) {
      const t = text(f).match(/<title>([^<]+)<\/title>/i);
      if (t) brands.add(t[1].trim().toLowerCase());
    }
    const isBrand = (s) => brands.has(s.toLowerCase()) || /^[A-Z][\w-]*\.(js|ts|io|com|net|org|app|dev)$/i.test(s) || /^[A-Z][a-z]+[A-Z0-9]\w*$/.test(s);

    const hits = [];
    for (const f of uiFiles) {
      const src = stripCodeComments(text(f));
      // JSX text between tags: >Two words< (letters, starting upper-case)
      for (const m of src.matchAll(/>\s*([A-Z][a-z]+(?:[ '’][A-Za-z]+)+[.!?…]?)\s*</g)) {
        if (known.has(m[1]) || isBrand(m[1])) continue;
        hits.push(`${rel(f)}:${lineAt(src, m.index)} "${m[1]}"`);
      }
      // Plain-text props
      for (const m of src.matchAll(/\b(placeholder|aria-label|title|alt|label|text)="([A-Z][a-z]*[^"{}]*)"/g)) {
        const value = m[2];
        if (known.has(value) || isBrand(value)) continue;
        // which component receives it?
        const open = src.lastIndexOf('<', m.index);
        const tag = src.slice(open + 1).match(/^([A-Za-z][\w.]*)/)?.[1] ?? '';
        if (translatesProp.get(tag)?.has(m[1])) continue;
        hits.push(`${rel(f)}:${lineAt(src, m.index)} ${m[1]}="${value}"`);
      }
    }
    // One line per file: count + first example.
    const byFile = new Map();
    for (const h of hits) {
      const file = h.split(':')[0];
      if (!byFile.has(file)) byFile.set(file, []);
      byFile.get(file).push(h);
    }
    for (const [file, list] of [...byFile].sort((a, b) => b[1].length - a[1].length).slice(0, 12)) {
      add('Should', list[0].split(' ')[0], `${list.length} possibly untranslated string(s) in ${file}, e.g. ${list[0].slice(list[0].indexOf(' ') + 1)}`);
    }
    if (byFile.size > 12) add('Should', '-', `${byFile.size - 12} more files with possibly untranslated strings`);
  }
}

// 12. Service worker without an update path
{
  const registers = files.some((f) => !inBuild(f) && /\.(t|j)sx?$|\.mjs$/.test(f) && /serviceWorker\.register|registerSW|useRegisterSW|workbox-window/.test(text(f)));
  const handlesUpdate = files.some((f) => !inBuild(f) && /\.(t|j)sx?$|\.mjs$/.test(f) && /skipWaiting|onNeedRefresh|needRefresh|registration\.waiting|controllerchange/.test(text(f)));
  if (registers && !handlesUpdate) add('Should', '-', 'service worker registered but no update handling (waiting/skipWaiting) — people may run an old version for days');
}

// 13. Heavy images shipped as-is
{
  const big = files.filter((f) => /\.(png|jpe?g|gif|webp|avif)$/i.test(f) && !inBuild(f) && statSync(f).size > 400 * 1024);
  for (const f of big.slice(0, 10)) add('Should', rel(f), `image is ${Math.round(statSync(f).size / 1024)} KB — resize/compress (AVIF/WebP, srcset)`);
}

const order = { Must: 0, Should: 1, Info: 2 };
findings.sort((a, b) => order[a.level] - order[b.level]);
if (!findings.length) console.log('check.mjs: no mechanical problems found.');
for (const f of findings) console.log(`[${f.level}] ${f.where} — ${f.msg}`);
console.log(`\n${findings.filter((f) => f.level === 'Must').length} must, ${findings.filter((f) => f.level === 'Should').length} should. Leads only — confirm before reporting.`);
