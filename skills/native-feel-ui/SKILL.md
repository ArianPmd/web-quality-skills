---
name: native-feel-ui
description: Design and build web or PWA interfaces that feel like polished native mobile and desktop apps — design principles, foundations, a full component catalog, UX patterns and input handling (grouped settings lists, segmented controls, sheets, alerts, glass materials, light/dark themes, right-to-left, accessibility). Use when creating or restyling UI screens, components, settings pages, dialogs, onboarding or permission prompts, a product landing page, or sign-in / sign-up / password-reset screens, or when the user asks for a clean, native-app look. Not for auditing an existing app for bugs (use web-ui-pitfalls).
---

# Native-feel UI for the web

Build web interfaces that feel at home next to the best native apps on
phones and desktops, using only your own code and assets.

## Ground rules (always)

1. **Ship only your own assets.** No proprietary system fonts or icon sets
   copied from an operating system vendor, no other companies' icons,
   wallpapers or screenshots. Use the system font stack
   (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` — CSS
   keywords that pick each device's own font) and draw your own icons
   (simple 24×24 SVG strokes). Don't describe your product as another
   company's style in names or marketing (trademark).
2. **Content first, chrome last.** One primary action per screen. Remove a
   control before adding a setting for it.
3. **Every control applies instantly** unless it is destructive or costly.
   No "Save" button on preference screens.
4. **Both themes, from the first line of CSS.** Colors are tokens; nothing is
   hard-coded in components. See `references/tokens.md`.
5. **Back always goes back** — to the screen the person came from, with a
   sensible fallback when there is no history (installed PWAs have no browser
   back button).
6. **Respect the person's settings:** reduced motion, dark mode, text size,
   language direction.

## Workflow

0. For a new product or a big redesign, read `references/principles.md`
   first; for each component you use, check its rules in
   `references/components.md`.
1. Identify the screen type and pick the pattern from
   `references/patterns.md` (settings list, segmented control, sheet, alert,
   empty state, permission pre-prompt, onboarding tips, forms, ...).
2. Set up / reuse the design tokens (`references/tokens.md`,
   `references/typography.md`) before writing component CSS. The files in
   `examples/` show a complete screen built from them.
3. Build the component; check it against the checklist below.
4. If the app supports more than one language or a right-to-left language,
   apply `references/rtl-i18n.md`.
5. Verify in a browser: phone width (375px), light and dark, keyboard only,
   reduced motion. Take a screenshot of each state you changed.

## Checklist before you call a screen done

**Must**
- [ ] Works at 375px wide with no horizontal scroll; 16px side gutters.
- [ ] Light and dark both checked; text contrast ≥ 4.5:1 (3:1 for large text).
- [ ] Tap targets ≥ 44×44px.
- [ ] Every icon-only button has an accessible name.
- [ ] Dialogs trap focus, close on Escape, return focus to the trigger.
- [ ] Back / Close / Cancel are always reachable.
- [ ] Safe areas respected (`env(safe-area-inset-*)`) for fixed bars.
- [ ] No text baked into images; all strings translatable.

**Should**
- [ ] Grouped, inset lists for settings; values on the trailing side.
- [ ] Destructive actions red, confirmed in an alert/action sheet, Cancel is
      the default focus.
- [ ] Motion ≤ 300ms, eased, and off under `prefers-reduced-motion`.
- [ ] Glass (blur) only on floating chrome (bars, sheets), never behind body
      text.
- [ ] Icons in colored tiles are white in both themes (don't inherit text color).
- [ ] Empty states say what this is and offer the first action.

## References

- `references/principles.md` — the design principles that decide
  conflicts, plus writing, inclusion and branding. Read first.
- `references/foundations.md` — color, dark mode, materials, layout,
  typography, icons, app icon, images, motion, launch, privacy in the UI.
- `references/components.md` — every common component (buttons, menus,
  toolbars, tabs, sidebars, search, alerts, sheets, popovers, lists, charts,
  text fields, pickers, toggles, sliders, progress, badges…): when to use
  it and the rules for it.
- `references/ux-patterns.md` — flows and behaviors: accounts, entering
  data, feedback, loading, onboarding and help, search, settings, undo,
  drag and drop, saving, sharing, ratings, media, printing, AI features.
- `references/landing-page.md` — building a "living" landing page where
  scrolling is the animation: what to find in the codebase first (real
  numbers, hero object, brand, tests), page structure, look, motion
  architecture without libraries, must-haves (reduced motion, RTL, a11y,
  performance) and how to verify it. Follow it whenever the task is a
  landing/marketing page.
- `references/auth-flow.md` — sign-in, sign-up (personal touches first,
  credentials last) and password reset: screens, code input, forms and
  errors, security, accessibility and verification. Follow it whenever the
  task is an account/auth flow.
- `references/inputs.md` — keyboard, pointer, touch and gestures, focus,
  virtual keyboards, voice and assistive technology.
- `references/patterns.md` — the component patterns: settings lists,
  segmented control, sheets, alerts, permission pre-prompt, status card,
  empty state, onboarding, tab/navigation bars, forms, toasts, loading,
  pull to refresh, swipe actions, push notifications, option picker,
  errors shown at the field, a not-found (404) page made for the product.
- `references/tokens.md` — color/radius tokens, light/dark/automatic, glass.
- `references/typography.md` — type scale and spacing.
- `references/motion-sound.md` — animation timings, reduced motion, sound,
  haptics.
- `references/rtl-i18n.md` — right-to-left, mixed-direction text, translation.
- `references/accessibility.md` — focus, names, motion, contrast.
- `examples/settings-screen.html`, `examples/sheet-and-alert.html` —
  complete, dependency-free pages to copy from (open them in a browser).
