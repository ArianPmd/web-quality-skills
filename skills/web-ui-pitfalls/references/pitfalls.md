# Pitfall catalog

Each entry: **symptom** → how to detect → fix. `[M]` = usually Must fix,
`[S]` = usually Should fix (adjust to the context).

## Build & CSS

- `[M]` **Blur/glass missing in production only.** Some CSS minifiers drop or
  rewrite unprefixed `backdrop-filter`, or a `filter: url(#svg-filter)`
  referencing an SVG filter that isn't in the DOM kills the effect.
  *Detect:* grep the built CSS for `backdrop-filter` and `-webkit-backdrop-filter`.
  *Fix:* keep both declarations; switch the minifier (or its target) if it
  strips them; remove SVG-filter references.
- `[M]` **Leftover merge-conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
  in CSS/JSON/TS — CSS silently ignores everything after them.
  *Detect:* scanner. *Fix:* resolve each hunk, then re-check; a file can have
  several hunks.
- `[M]` **Unbalanced braces after a merge** — two branches appended blocks at
  the end of the same stylesheet and the shared closing `}` was kept once.
  *Detect:* count `{` vs `}` (scanner). *Fix:* add the missing brace where the
  first nested-looking top-level selector appears.
- `[S]` **Duplicated blocks after a merge** — both sides kept.
- `[S]` **CI fails without a code change** (timeouts downloading browsers or
  packages, flaky network). Read the log before changing code: if it's a
  download/timeout, re-run; if it repeats, cache the downloads and raise the
  timeout. Don't "fix" code that wasn't broken.
  *Detect:* the same selector block twice. *Fix:* keep one.
- `[S]` **`position: fixed` child positioned inside a panel** — an ancestor
  has `transform`, `filter` or `backdrop-filter`. *Fix:* portal to `body`.

## PWA / installed app

- `[M]` **Reopening the installed app shows the landing page, looks like
  "logged out".** `start_url` points at `/` and `/` is the marketing page.
  *Fix:* `start_url` to the app's home route, and redirect signed-in people
  away from guest-only pages.
- `[M]` **Manifest or icons blocked** by auth/middleware (fetched without
  cookies) → app can't be installed. *Fix:* exclude manifest and icons from
  the gate.
- `[M]` **No way back in standalone mode** — there is no browser back button.
  See Navigation.
- `[S]` Manifest missing `id`, `scope`, maskable icon, `theme_color`.
- `[S]` Service worker caches API responses or HTML so long that users run
  old code; make sure updates are picked up (and that the update prompt works).

## Navigation

- `[M]` **A runtime error turns the whole app into a blank page.** With no
  error boundary, one exception in any component unmounts everything —
  people see an empty screen with no way forward. *Fix:* a top-level error
  boundary (and one per route: `errorElement` / `error.tsx` / an
  `ErrorBoundary` component) that shows a friendly message in the app's
  style with "Reload" and "Go home", and reports the error. *Detect:* a
  React app without `componentDidCatch` / `getDerivedStateFromError` /
  `errorElement` / an error-boundary component (the scanner checks).
- `[S]` **No custom 404.** Unknown URLs show the framework's default
  ("Unexpected Application Error", a bare "404"), a blank page, or silently
  go home. *Fix:* a catch-all route with a not-found page made for the
  product (native-feel-ui `patterns.md` › 18), also for deleted items.

- `[M]` **Back buttons hard-coded to a route** (`<Link to="/profile">`)
  instead of going to the previous screen. *Detect:* grep back buttons for
  fixed `to=`/`href`/`navigate('/…')`. *Fix:* a "smart back": history back
  when there is in-app history, otherwise a sensible fallback route.
- `[M]` `history.back()` / `navigate(-1)` with **no history** (opened from a
  link, a notification, or as the PWA's first screen) does nothing. Same fix.
- `[S]` Back inside multi-step flows/panels should step back one level, not
  leave the flow.

## Theme (light/dark)

- `[M]` **Icons turn black on colored tiles in light mode** — glyphs use
  `currentColor` and inherit the text color. *Fix:* set `color: #fff` (and a
  size) on the tile.
- `[M]` Hard-coded colors that are unreadable in one theme (check contrast in
  both).
- `[S]` A theme setting without "Automatic"; Automatic not updating live.
- `[S]` Dark-on-dark mockups/borders invisible (e.g. a dark preview's frame).

## Overlays, onboarding, layout

- `[M]` **Onboarding spotlight scrolls the page** to an element that is
  already visible → fixed header (profile, bell) disappears. *Fix:* scroll
  only if the target is off screen; `focus({ preventScroll: true })`.
- `[M]` **A floating pill/banner covers important content** on one screen
  (it was placed for another). *Fix:* per-screen position.
- `[M]` Clicking an overlay's dimmed backdrop also closes a sheet underneath
  (event bubbling between stacked layers).
- `[S]` Horizontal scrolling rows people don't discover — wrap instead.
- `[S]` Long option lists open by default and push the form down — start
  collapsed, open by category.
- `[S]` **Scrollbars in the browser's default style** — wide, gray, with
  arrows, out of place in both themes. *Fix:* style them once globally from
  theme tokens (thin, rounded, transparent track; see native-feel-ui
  `tokens.md` › Scrollbars).
- `[S]` **Native `<select>` lists** that open in the browser's own style,
  can't search, and look different on every platform. *Fix:* a button that
  opens a shared picker sheet (native-feel-ui `patterns.md` › Option
  picker).
- `[M]` **A search field that scrolls away with its list** in a picker or
  long list. *Fix:* put it in a toolbar under the title, outside the
  scrolling area.
- `[M]` **A panel or sheet that covers the top bar and tab bar**, so people
  can't navigate while it's open. *Fix:* place it in the space between them
  (measured on open and on resize), with a lower `z-index` than both; a tap
  outside closes it and still performs the tap.
- `[M]` **The page goes blank when a dialog closes or on navigation**
  (React: "destroy is not a function"). A `useEffect` written as an arrow
  function without braces returns a value, and React calls it as the
  cleanup. Easy to miss: `useEffect(() => window.scrollTo(0, 0), [path])`
  looks harmless, but **the scroll APIs (`scrollTo`, `scrollBy`,
  `scrollIntoView`) return a Promise in current browsers**, so this blanks
  the app on the next route change; timers return a number, `fetch` a
  Promise. *Fix:* write effect bodies in `{}` and return only a cleanup
  function or nothing. *Detect:* `useEffect(() => someCall(...)` without
  `{` (the scanner rates it by what the call returns).

## Forms

- `[M]` A preset picker that doesn't contain the prefilled value (e.g. an
  emoji/icon not in the preset list) falls back to the "custom" input — show
  the current value as a selected option instead.
- `[M]` **Silent validation failure: Save does nothing and shows no error.**
  Four ways it happens — check every form:
  1. *The error has nowhere to show.* The schema (zod, yup, …) fails a
     field — or a path set in `refine`/`superRefine` — that the page has no
     error slot for. *Detect:* list every field and refine path in each
     schema and compare with the fields that render an error message.
  2. *An empty input becomes the wrong value.* An empty picker or number
     field turns into `0`, `NaN` or `""` instead of `undefined`, so a basic
     rule (`min(1)`, "expected number") fails with a generic message while
     the friendly rule meant for that case ("Select at least one day.")
     never runs. *Fix:* convert empty to `undefined` before validating.
  3. *Validation runs inside the submit handler or mutation*
     (`schema.parse` in `mutationFn`) and its error reaches a generic
     handler that only understands API errors → "Something went wrong" or
     nothing. *Fix:* validate before submitting; make the shared
     error-message helper recognize the validation error type (e.g.
     `ZodError`) and return the first issue's message.
  4. *The submit button stays disabled* while the form is invalid, without
     saying what is missing. *Fix:* keep it enabled and show the errors on
     submit, or show the reason next to it.
  For every field that can fail: its own message under it (`role="alert"`,
  `aria-invalid`, an `id`), focus/scroll to the first invalid field on
  submit, clear the error as soon as it's fixed, and translations for every
  message in every language.
- `[M]` **Errors that don't lead to the problem.** A generic message
  ("Something went wrong", "Invalid input") in a toast or at the top, while
  the field at fault isn't marked and may be off screen. *Fix:* a specific
  message under the field, the field outlined in red (`aria-invalid`), and
  on submit: open the section that hides it, scroll it into view, focus it
  (native-feel-ui `patterns.md` › 17).
  Common misses: the field sits in a collapsed "More options" or another
  tab/step, so scrolling does nothing; the fixed top bar covers the field
  after scrolling (no `scroll-margin-top`); the scroll targets the page
  instead of the sheet the form is in; server-side validation errors are
  shown as a toast instead of on their field; the red state stays after
  the field is fixed.
- `[S]` Placeholders, units and select labels not translated.
- `[S]` Max-length counters that a translation can overflow.

## Translation & RTL

- `[S]` **Messages stored already translated.** An error or status saved as
  the translated text (`setError(t('wrongPassword'))`) stays in the old
  language after the person switches language. *Fix:* store the message
  key (and its variables) and translate when rendering.
- `[S]` **Plurals built by hand** ("1 items", "{n} item(s)"): languages
  have different plural rules. *Fix:* `Intl.PluralRules` (or the i18n
  library's plural support) with a string per category — accessible labels
  too ("Bag, 1 item").
- `[M]` Strings rendered without the translate function (option labels,
  units, error messages from the server).
- `[M]` Translation files missing keys present in the source language
  (scanner compares JSON locale files).
- `[S]` The same concept translated with different words in different places;
  near-synonyms for two different features. Build a glossary.
- `[S]` English words left inside translated sentences.
- `[S]` Physical `left/right` CSS that doesn't mirror in RTL; back arrow on
  the wrong side.
- `[S]` Browser auto-translate garbles an already-translated UI — add
  `translate="no"`.

## Permissions & notifications

- `[M]` Asking for notification permission without a user gesture or before
  explaining why → the person says no, permanently. Use a pre-prompt.
- `[M]` No in-app indication when notifications are off/blocked, and no
  steps to re-enable them.
- `[S]` Reminders sent earlier than the time the person set (or text saying
  so); timing jobs on sleeping free hosts that miss their window — allow a
  catch-up window and send once.
- `[S]` Notification text not in the person's language.
- `[M]` **The same notification arrives twice.** Two schedulers run the same
  job (an in-process timer *and* an external pinger, two server instances,
  a retry) and both read "not sent yet" before either writes "sent".
  *Fix:* claim the notification atomically before sending — e.g.
  `UPDATE … SET notified_at = now() WHERE id = $1 AND notified_at IS NULL`
  and send only if one row changed (or a unique "sent" record / a lock).
  Mark-after-send is not enough.
- `[S]` **"It's today" reminders delivered at midnight.** A job that fires
  "as soon as the day starts" in the person's time zone wakes them up.
  *Fix:* send day-level reminders at a sensible local hour (e.g. 08:00);
  skip it for items whose own reminder time is at or before that hour (they
  get their timed reminder instead).
- `[S]` **Notifications arrive silently.** A web page can't choose the
  sound. *Fix:* don't set `silent: true`; pass a `vibrate` pattern on
  Android; same `tag` + `renotify: true` when replacing one so it alerts
  again. If it is still silent, it's the device's per-app notification
  settings (Android channel, iOS Focus / notification style) — tell people
  where to look.
- `[S]` **A second app logo inside the notification.** Android already shows
  the app's badge in the header; a large `icon` with the same logo looks
  duplicated. *Fix:* omit `icon` on Android, or use a contextual image (the
  person's avatar, the item's picture) — generate it once and cache it,
  regenerate only when it changes.

## State that should survive

- `[S]` In-app notifications/history lost on reload — persist them locally,
  clear on sign-out.
- `[S]` A "demo" or "guest" mode that writes to storage when it promised
  not to (or the reverse: settings that never persist).

## Sound & motion

- `[S]` Sounds that can't be turned off, or play before any user interaction
  (autoplay policies block them anyway).
- `[S]` Animations without a reduced-motion fallback.

## Service worker & updates

- `[M]` **People stay on an old version for days.** The new service worker
  waits until every tab is closed (installed PWAs are rarely fully closed).
  *Fix:* detect `registration.waiting`, show "Update available — Reload",
  then `postMessage({type:'SKIP_WAITING'})` and reload on
  `controllerchange`; or `skipWaiting()` + `clients.claim()` if a
  mid-session switch is safe.
- `[M]` **HTML or API responses cached by the service worker** → stale
  data, or a broken app after a deploy (old HTML pointing to deleted JS
  chunks). *Fix:* network-first (or network-only) for HTML and `/api/`,
  cache-first only for hashed assets.
- `[S]` Old caches never deleted — clean them in `activate`.
- `[S]` `index.html` / `sw.js` served with long cache headers — serve them
  with `Cache-Control: no-cache`.
- `[S]` After a deploy, lazily loaded chunks 404 for open tabs — catch the
  import error and reload once.

## iOS Safari & installed iOS apps

- `[M]` **`100vh` taller than the visible screen** (address bar) → bottom
  buttons cut off. *Fix:* `100dvh` (or `svh`), with `100vh` as fallback.
- `[M]` **Page zooms in when an input is focused** — font-size under 16px.
  *Fix:* inputs ≥ 16px. Don't block zoom in the viewport tag instead.
- `[M]` **Keyboard covers the focused field / fixed footer.** *Fix:* keep
  forms in normal flow, `scrollIntoView({ block: 'center' })` on focus, or
  use the `visualViewport` API for fixed bars.
- `[M]` **Sound or vibration doesn't work** — audio needs a user gesture to
  start; `navigator.vibrate` doesn't exist on iOS.
- `[M]` **Push only works once the site is added to the Home Screen**
  (iOS 16.4+), and the permission must be requested from a tap. Tell
  Safari users to install first instead of showing a broken switch.
- `[S]` Fixed bars ignore `env(safe-area-inset-*)` → content under the
  notch/home indicator (needs `viewport-fit=cover`).
- `[S]` `position: fixed` inside a scrolling container jitters; long-press
  shows the text callout / image menu on draggable elements
  (`-webkit-touch-callout: none` on those only).
- `[S]` Rubber-band overscroll reveals a white background — set the
  `html` background too.
- `[S]` Date/time inputs look different per platform — test the native
  pickers or use a custom one.

## Performance

- `[M]` **Images far larger than displayed** (a 4000px photo in a 300px
  slot). *Fix:* resize, modern formats (AVIF/WebP), `srcset`/`sizes`,
  `loading="lazy"` below the fold, `width`/`height` attributes.
- `[M]` **Layout shift while loading** (images without size, fonts
  swapping, content inserted above). *Fix:* reserve space, skeletons,
  `font-display: swap` with a metric-matched fallback or system fonts.
- `[S]` One huge JS bundle — split by route; check the build's size report.
- `[S]` Web fonts: subset, preload the one used above the fold, at most
  2–3 files.
- `[S]` Heavy work on every keystroke/scroll — debounce, use
  `requestAnimationFrame`, passive listeners.
- `[S]` Run Lighthouse (mobile) and look at LCP, CLS, INP.

## Offline & network errors

- `[M]` **Blank screen or endless spinner when offline / the API is down.**
  *Fix:* show cached data if you have it, otherwise a clear message with
  Try Again.
- `[M]` **Raw technical errors shown to people** ("TypeError: Failed to
  fetch", stack traces, status codes). Map them to plain sentences in the
  person's language.
- `[S]` Free hosts that sleep: the first request after idle takes
  10–60 seconds — show a "waking up" state instead of an error, and retry.
- `[S]` Writes made offline are lost — queue them or say clearly they
  weren't saved.
- `[S]` No timeout on requests — the UI waits forever.

## Proxies & API responses

- `[M]` **Every API response arrives empty through a `fetch()` proxy.** A
  proxy built with `fetch()` (edge/middleware functions, workers) receives
  a compressed response (`Content-Encoding: br`/`gzip`); `fetch()` already
  decompresses the body, but the proxy copies the original headers to the
  browser — including `Content-Encoding` and `Content-Length`. The browser
  tries to decompress again, fails, and the body is empty or broken.
  Symptoms: works locally, breaks once deployed behind the proxy; demo
  shows no data; "Cannot read properties of null (reading 'email')".
  *Detect:* `curl -sI -H 'accept-encoding: gzip, br' <backend-url>` shows
  `Content-Encoding`; the proxy code does `new Response(res.body, { headers:
  res.headers })` or copies `res.headers` without deleting those two.
  *Fix:* copy the headers, then
  `out.delete('content-encoding'); out.delete('content-length');` (also
  drop hop-by-hop headers such as `connection`, `transfer-encoding`). Add a
  test that feeds the proxy a response with these headers and checks they
  are gone and the JSON body is intact.
- `[S]` **Errors hidden as `null`.** `res.json().catch(() => null)` (or
  `return null` on any failure) turns a broken response into "no data", so
  the real error shows up later as a crash somewhere else. *Fix:* only
  return `null` for an expected empty response (204); otherwise throw an
  error with the status and URL, and show a clear message.
- `[S]` A proxy that drops `Set-Cookie` (or merges several into one) — use
  `getSetCookie()` and append each.

## Sign-in & sessions (the UI side)

- `[M]` **"I keep getting logged out"** — common causes: refresh token
  rejected because two tabs refreshed at once (no grace window); treating
  a network error or 5xx as "signed out"; cookie `SameSite`/domain wrong
  between frontend and API; the installed app opening a public landing page.
  *Fix:* see the session items in launch-security-legal-check; retry on
  network errors; only sign out on a definite "invalid".
- `[M]` Guest-only pages (sign in / sign up) reachable when signed in, and
  protected pages briefly flashing before the redirect.
- `[S]` After sign-in, return to the page the person wanted, not always
  home.
- `[S]` Sign-out clears per-user local data (cached lists, notifications).

## Demo / guest mode

- `[M]` Demo mode calls the real API or writes to real storage.
- `[S]` Demo data created in one language and never re-localized.
- `[S]` A demo banner that covers controls on some screens.
- `[S]` Features that can't work in the demo (push, saving settings)
  silently fail — say so.
