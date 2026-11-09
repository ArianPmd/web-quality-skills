# Foundations

Color, dark mode, materials, layout, typography, icons, images, motion,
launch and privacy — as they apply to a web app or PWA. Token values live in
`tokens.md` and `typography.md`.

## Color

- **One meaning per color.** Red = destructive/error, green = success, the
  accent = interactive. Never reuse a meaning color decoratively.
- **Semantic tokens, not raw values,** in components (`--color-danger`, not
  `#ff3b30`) — so light, dark and high-contrast variants come for free.
- **Check every theme:** light, dark, and `prefers-contrast: more` (raise
  separators and muted text contrast there).
- **Never color alone:** pair state colors with an icon, text or shape
  (error icon + message; selected = checkmark, not just tint).
- Avoid hard-to-see combinations (red/green, low-contrast pastels); check
  color-blind simulations in dev tools.
- Colors carry cultural meaning (red = luck in some places, danger in
  others) — keep critical meanings reinforced by text.
- Color on glass/translucent surfaces: sparingly; labels on colorful
  backgrounds must not share the background's hue.
- Let people pick colors with the platform's color input
  (`<input type="color">`) or a curated swatch set.
- Images: export with an sRGB profile; offer wide-gamut (P3) only as an
  enhancement (`@media (color-gamut: p3)`).
- Background layers: primary (page), secondary (grouped cells), tertiary
  (nested groups) — use the same three levels everywhere.

## Dark mode

- **Follow the system by default** (Automatic). An in-app override is fine,
  but Automatic must be the default and update live.
- Design both appearances deliberately; dark is not inverted light. Pure
  black page background, slightly lighter elevated surfaces; soften pure
  white text/backgrounds.
- Contrast in both; re-check images, illustrations, charts, shadows (use
  borders/lighter surfaces for elevation in dark).
- Icons: one set that works in both, or separate light/dark variants where a
  glyph relies on fill/outline contrast.
- Text fields and text areas use the theme tokens, never a fixed white
  background.

## Materials (glass / translucency)

- Glass belongs to the **controls layer** floating above content (bars, tab
  bar, sheets, popovers) — never to the content itself (cards, list rows,
  text blocks).
- Use it sparingly; one or two glass layers per screen.
- Thicker (more opaque) material behind small text and fine detail; thinner
  where keeping the background visible helps orientation.
- Over bright or busy imagery add a dimming layer (~35% black) so controls
  stay legible.
- Respect `prefers-reduced-transparency: reduce` — fall back to an opaque
  surface.

## Layout

- **Hierarchy:** most important content first and largest; align to a grid
  so screens scan easily; indentation shows nesting; group related items.
- **Progressive disclosure:** show the essentials, reveal details on demand
  (disclosure, "More options", detail pages).
- **Controls look different from content** (buttons vs. text vs. cards).
- **Adapt, don't just shrink:** decide layout by available width (container
  queries / breakpoints), not by device type; keep the same functionality
  at every size; changes between sizes should feel familiar (e.g. tab bar
  on phones → sidebar on wide screens).
- Prepare for text up to 200%, long translations, RTL, and different date,
  time and number formats.
- Safe areas: keep controls out of notches, rounded corners and the home
  indicator (`env(safe-area-inset-*)`); content may extend underneath,
  controls may not.
- Avoid putting critical actions at the very bottom edge of large windows;
  on phones, primary actions are reachable by the thumb.
- Preview on several widths, both themes, two languages and large text
  before calling a layout done.

## Typography

- Readable sizes (body ≥ 16–17px); avoid light/thin weights for body and
  small text.
- Hierarchy through weight, size and color — not more typefaces. One or two
  families at most.
- Honor the person's text size: `rem` units, layouts that reflow, icons that
  scale with text, minimal truncation (wrap instead), and the same
  hierarchy at every size. Re-layout (e.g. stack label over value) at very
  large sizes.
- Custom fonts must stay legible at small sizes and support the scripts you
  ship; test a fallback stack.

## Icons

- One concept per icon, highly simplified, recognizable at 16–24px.
- One visual style across the app: same stroke weight (matching adjacent
  text weight), same corner style, same grid.
- Optical alignment: pad asymmetric glyphs so they look centered.
- A separate selected variant (e.g. filled) only when the state isn't
  shown otherwise.
- SVG, `currentColor`, an accessible name for meaningful icons and
  `aria-hidden` for decorative ones.
- No text inside icons unless essential (it won't translate); no
  replicas of real devices or other brands' products.
- Familiar actions get familiar icons (share, delete, edit, search,
  settings) — and the same icon always means the same action.

## App icon (installable app)

- Simple, filled, overlapping shapes; centered content that survives
  circular/rounded masking (maskable icon with a safe zone ≈ 80% center).
- Recognizable without text; illustrations over photos; don't replicate UI.
- Consistent across sizes and platforms; provide a monochrome version for
  badges and a version that works on dark backgrounds.

## Images

- Provide every bitmap at 1x/2x/3x (`srcset`) or as SVG; serve modern
  formats; embed an sRGB profile.
- Test on real devices, including low-end phones and slow networks.
- Text over images needs a scrim or enough contrast in every crop.

## Motion

- Purposeful: it explains a change or confirms an action — otherwise leave
  it out. Make it optional (`prefers-reduced-motion`).
- Feedback motion follows the person's gesture and expectations, is brief
  and precise, and can be interrupted or cancelled.
- Skip animation on very frequent interactions (it becomes a delay).
- No fast flashing or strobing; avoid animating blur and depth for people
  sensitive to motion. Details and timings: `motion-sound.md`.

## Launch

- Show the real interface as fast as possible; if a placeholder is needed,
  it mirrors the first screen (no logo show, no ads, no text).
- Restore where the person left off (route, scroll, draft) on return.
- A splash/intro, if any, is part of onboarding, brief, and skippable.

## Privacy in the interface

- Ask only for data and permissions you really need, at the moment you
  need them — not at launch unless the app can't work without it.
- Explain each request in one sentence of benefit, in your words, right
  before the browser's prompt (see the permission pre-prompt pattern). A
  pre-prompt has one button that leads to the real prompt (plus "Not Now"),
  and never misleads about what the system will ask.
- Process on the device when possible; say clearly what is stored, where,
  and why.
- Don't rely on passwords alone (offer passkeys / two-factor), never store
  secrets in plain text, don't invent your own authentication scheme.
