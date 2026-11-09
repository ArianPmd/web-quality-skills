# Living landing page

Build (or rebuild) a product's landing page as a calm, premium, "living"
page where scrolling itself is the animation — not a template with
fade-ins. Adapt everything to the product's topic and audience.

## 0. Before designing anything (do this first, without asking)

- Read the codebase and work out the product: name, one-line promise, who
  it's for, 4–6 real features, the main call to action, and whether a "try
  it without signing up" path (demo, guest mode, sandbox) exists or can be
  wired to an existing one.
- Pick the **hero object**: the one visual that *is* the product (a device
  mockup showing the real UI, a dashboard, a mascot, a product photo). If
  the current landing page already has a strong one, keep it unchanged and
  give it a new stage. Say which one you picked.
- Get **3 real numbers** from the data source (database counts, content
  files, config): items in the catalogue, lessons, topics, users… Never
  invent figures and never show user counts you can't prove. Put them in
  one constant with a comment saying where they came from.
- Get the brand colours (one main, one accent) from the existing
  theme/tokens, and the languages from the i18n system, including any
  right-to-left ones.
- Find every test ID, route and component the current landing page exposes
  that tests or other pages depend on (sign-in link, CTA, demo button,
  theme/language toggles, cookie notice). Keep them, or update the tests in
  the same change.
- If something essential is truly missing (no brand colour, no features),
  choose a sensible default and say so in the final report.

## 1. Page structure (in this order)

1. **Floating glass nav**: logo (icon only on phones, with an accessible
   name), language picker, theme toggle if the app has themes, "Log in",
   primary "Sign up". It stays `position: fixed` — check that no general
   rule like `.page > *` overrides it.
2. **Hero**
   - A big headline whose pieces drift in on a "breeze": each starts
     offset, tilted and faded, then settles in reading order.
     - Latin/Cyrillic scripts: animate letter by letter, but wrap each
       word so lines only break between words.
     - Scripts whose letters join (Arabic, Persian, Urdu…): animate whole
       words, never split letters.
   - The last 1–3 words are drawn in the brand gradient: one colour per
     letter for Latin, `background-clip: text` for whole words.
   - Behind and around the headline, 3D cards built from the real app UI
     float at different depths, plus 3–4 small tilted "stickers" with
     short playful words in the product's tone.
   - Mouse only: the cards drift with the pointer, eased, never snapping;
     closer cards move more.
   - As you scroll away, the hero sinks and fades.
   - Two CTAs: the primary one, and "Try the demo" (or the closest
     equivalent).
   - Phones: no stickers; two UI cards sit statically under the buttons.
   - Desktop: limit the headline width so floating cards never overlap
     the text.
3. **Feature cards**
   - Frosted-glass cards, each with its own colour and a soft glow that
     follows the pointer; they rise in one after another.
   - On large screens the section pins while you scroll and the cards
     glide sideways along a gentle curve: the middle card faces you and
     lights up; the side cards turn toward it, sink back and dim.
   - Dim with an overlay pseudo-element's opacity, not with `filter`.
   - The pinned stage is full-bleed (not inside the max-width wrapper), or
     the outer cards get clipped.
   - A small progress indicator.
4. **Hero-object scene**
   - The hero object in its own world inside a pinned section. Scrolling
     "walks the camera in": the object turns from tilted to facing you,
     rings or shapes open up, small topic-related labels drift outward.
   - A caption (eyebrow, title, one sentence) fades in near the end.
   - The object and the caption never overlap at 1280×800: move or scale
     the whole world up as the caption comes in.
   - Phones: a static scene without floating labels (they'd be clipped).
5. **Stats band**: the 3 real numbers, counting up once when they come
   into view, formatted for the current locale (e.g. native digits).
   Screen readers get the final value, not every intermediate one.
6. **FAQ**: native `<details>` accordions with 5–7 real questions answered
   from what the product actually does (price, content, install,
   languages, privacy, demo).
7. **Closing line**: one short sentence whose words rise in one after
   another (last words in the gradient), then the CTA fades in.
8. **Footer**: privacy, terms, cookies, imprint if the project has one, a
   "Cookie settings" button that reopens the consent/notice banner (add a
   small event/hook if it can't be reopened yet), copyright with the
   current year.

## 2. Look

- Rich background: a fixed soft gradient wash (3 large radial gradients in
  brand tints) plus a very fine SVG noise grain over everything (opacity
  ~0.04, a bit more in dark mode), `pointer-events: none`.
- Each section gets a small uppercase "eyebrow" label with wide letter
  spacing and a coloured dot above the title. For RTL or joined scripts:
  no letter spacing and no uppercase.
- Layered shadows tinted with the brand colours, not flat grey.
- Every colour is a CSS custom property on the landing root, with a full
  dark theme that follows the app's existing theme switch (class or
  attribute), plus a `--dir: 1 / -1` variable for RTL-aware transforms.
- Use the project's existing font stack and icon set.

## 3. How to build the motion

- One small hook, `useScrollProgress(ref, mode, prop)`, writes 0 → 1 into a
  CSS custom property on the section:
  - only once per animation frame;
  - only while the section is near the screen (IntersectionObserver with
    a margin);
  - modes: `through` for pinned sections, `enter` for reveals on entry,
    `leave` for the hero scrolling away;
  - use `enter` instead of `through` when a section isn't pinned at the
    current width.
- CSS does all the transforms from those variables (`calc`, `clamp`, and
  `max(x, -x)` as abs()). The framework never re-renders while scrolling.
- Count-ups and staggered reveals start once, from an IntersectionObserver.
- Pointer drift: eased `--mx`/`--my` written from a rAF loop that stops
  when it settles. Card glow: `--gx`/`--gy` on `pointermove`, mouse only.
- Letter offsets come from a seeded PRNG keyed by the text, so every
  render looks the same.
- Animate only `transform` and `opacity`. Use the separate `translate`
  property for idle bobbing so it never fights the main transform.
- No scroll-jacking: native scroll always works. No animation library.
- Structure: one component per section, one shared motion helper file,
  one stylesheet scoped to the landing root.

## 4. Must-haves

- `prefers-reduced-motion`: every effect off and all content simply shown.
  Pinned sections fall back to normal flow (put the pinned layout inside
  `@media (min-width: …) and (prefers-reduced-motion: no-preference)`), and
  the carousel becomes a plain grid.
- Real text stays in the DOM for screen readers and SEO: a visually-hidden
  copy of each animated heading, with the animated pieces `aria-hidden`.
  Exactly one `h1`, then a proper heading order, each section labelled by
  its heading.
- Pointer effects only on `(pointer: fine)`; touch gets a clean, static
  version.
- Works from 320px phones to wide desktops with no horizontal scroll
  (`document.documentElement.scrollWidth === innerWidth`). On narrow
  phones, hide secondary nav items (e.g. the theme toggle) so the primary
  button doesn't touch the edge.
- RTL mirrors correctly: logical properties, and `--dir` in sideways
  transforms. All copy goes through the translation system in every
  language the app has.
- Visible keyboard focus everywhere, alt text or `aria-hidden` on
  decoration, contrast at least AA in both themes.
- Fast: images sized and lazy-loaded below the fold; aim for Lighthouse
  performance and accessibility ≥ 90.

## 5. Verify before calling it done

- Type check, lint, unit tests and the production build pass.
- Update any E2E test that pointed at removed sections, and add one that
  checks: a single `h1` with the real text, the stats show the real
  numbers, a FAQ item opens, "Cookie settings" reopens the banner, and the
  CTA leads to sign-up.
- In the browser: desktop 1280×800 light; phone 375×812 dark; every
  language including RTL; reduced motion if the tooling can emulate it —
  if it can't, say so instead of claiming it.
- Scroll through each pinned section at 15%, 50% and 95% and look for
  overlaps and clipping.
- Entrance animations can be mid-flight in a screenshot: wait for them to
  finish, or check computed opacity, before concluding something is
  broken.
- Send screenshots, then report what was checked, what couldn't be
  checked, and which real numbers were used and where they came from.
