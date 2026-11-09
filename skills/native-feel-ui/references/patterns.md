# Patterns

Each pattern: when to use it, the structure, and the details that make it
feel native. Sketches are minimal — adapt names to the project.

## 1. Inset grouped list (settings)

Use for preferences, account screens, any list of options.

```html
<section class="group">
  <h2 class="group-header">Notifications</h2>
  <div class="group-body">
    <label class="row">
      <span class="icon-tile" style="background:#ff3b30"><svg>…</svg></span>
      <span class="row-label">Allow Alerts</span>
      <input type="checkbox" role="switch" class="switch">
    </label>
    <a class="row" href="/settings/sounds">
      <span class="row-label">Sounds</span>
      <span class="row-value">On</span>
      <svg class="chevron" aria-hidden="true">…</svg>
    </a>
  </div>
  <p class="group-footer">Reminders on this device, even when the app is closed.</p>
</section>
```

- Rows ≥ 44px tall; label leading, value + chevron trailing (mirrored in RTL).
- Separators start after the icon (inset), not edge to edge.
- Header small and muted above; footer explains consequences below.
- A row that navigates has a chevron; a row that acts (Sign Out) is centered
  or colored and has none; destructive rows are red.
- Toggles apply immediately. Never put a Save button on this screen.

## 2. Segmented control

Two to five mutually exclusive views or options of equal weight.

- One tab stop, arrow keys move the selection (`role="radiogroup"`/`radio`,
  or `tablist`/`tab` when it switches panels).
- Selected segment: raised surface on a muted track; equal widths.
- Labels short (one or two words) — check the longest translation.

## 3. Sheet (bottom / centered panel)

For a focused sub-task: add/edit an item, pick from many options.

- Header: Cancel (leading), title (center), Done/Save (trailing) — or a round
  ✕ close for read-only sheets.
- Closing with unsaved changes asks: Discard Changes (red) / Save / Cancel.
- Grabber + swipe down to close on touch; Escape on keyboard.
- Content scrolls inside; the header stays.
- Render through a portal to `body`.

## 4. Alert and action sheet

- Alert: short title, optional one-sentence message, at most 3 buttons.
  Cancel is the safe default (receives initial focus); destructive in red.
- Never use `window.confirm()` — it is a silent no-op in some installed PWAs
  and webviews.
- Action sheet (several choices) on phones; a menu/popover on wide screens.

## 5. Permission pre-prompt

The browser asks for notifications, location, camera **only once**; a "Don't
Allow" can't be undone from the page. So ask in two steps:

1. Right after the person does something that needs it (e.g. turns on a
   reminder), show **your own** small dialog: icon, one-line title, one
   sentence of benefit, **Allow** (primary) / **Not Now**.
2. Only **Allow** triggers the real system prompt (from that tap — Safari
   requires a user gesture).

"Not Now" leaves the permission askable; ask again the next time the person
does the same kind of action. If the permission is already *denied*, don't
ask — show short steps to re-enable it in the device/browser settings.

## 6. Status card ("something is off")

A dismissible card at the top of the main screen when something blocks the
core experience (notifications off, offline, update available):
icon tile, bold one-line state, one line of why, one action button, ✕.
Snooze it after ✕ (e.g. a week) — never nag on every visit.

## 7. Empty state

Icon, one sentence saying what this place is, and the first action as a
button or link. Optionally a few ready-made suggestions the person can tap to
start from (they prefill the form; nothing is saved until they confirm).

## 8. Onboarding tips (coach marks)

- Spotlight one element at a time with a short title + one sentence, step
  dots, Skip and Next. Shown once per screen; replayable from Settings.
- Don't scroll the page to an element that is already visible (it pushes
  fixed headers out of view); scroll only when it's off screen.
- Move focus to Next without scrolling: `focus({ preventScroll: true })`.

## 9. Disclosure ("More options")

At most one per view; closed by default, but open when editing something that
already has values in it — editing must never hide a value.

## 10. Capsule / pill buttons

Secondary actions inside cards ("Surprise me", "Turn On"): pill radius,
tinted background (`color-mix` of the accent at ~20%), text readable in both
themes (mix the accent with the text color if the plain accent is too dark on
dark backgrounds), optional 15px leading icon.

## 11. Floating notice that must not cover content

A fixed pill (demo mode, offline) belongs where it covers the least on each
screen — check every screen; move it (e.g. above the tab bar) where the top
holds important content.

## 12. Tab bar and navigation bar

**Tab bar** (3–5 top-level sections, bottom of the screen on phones):
- Icon + short label for each; the current one filled/tinted. Never hide
  labels.
- Fixed with `padding-bottom: env(safe-area-inset-bottom)`; content gets
  enough bottom padding to scroll clear of it.
- Tapping the current tab scrolls its screen to the top / back to its root.
- On wide screens, move it to a sidebar.

**Navigation bar** (top of each screen):
- Back (leading, with the previous screen's name when short), title
  (center or large title that collapses on scroll), up to two trailing
  actions as icons or a single text button.
- Glass background once content scrolls under it; a hairline separator.
- The page's `<h1>` is the title (visually hidden if the bar shows it).

## 13. Forms

- Labels above fields (or inside grouped rows); never placeholder-only.
- Field ≥ 44px tall, text ≥ 16px (iOS zooms smaller inputs).
- Set `type`, `inputmode`, `autocomplete`, `enterkeyhint`,
  `autocapitalize` so the right keyboard appears.
- A clear (✕) button inside text fields once they have content.
- Validate on submit, then on change of the field in error; show the
  message under the field (`role="alert"`), move focus to the first error.
- **Never fail silently:** every rule in the schema (including
  cross-field rules) has a visible place for its message; empty inputs are
  `undefined`, not `0`/`""`, so the specific message wins over a generic
  one; validation errors are shown as field messages, never swallowed by a
  generic "Something went wrong".
- Required fields marked; optional extras behind one "More options".
- Character counters for limited fields (and a limit that fits the longest
  translation).
- Dates and times: a native-feeling picker (wheel or calendar) plus typed
  entry; localized placeholder (`HH:MM` becomes a local example); 12/24-hour
  from the locale.
- Primary button disabled until the form can be submitted, with the reason
  visible somewhere; never only a disabled button with no explanation.
- Closing with unsaved text asks before discarding.

## 14. Feedback: toasts, loading, refresh, swipe

- **Toast / banner:** short past-tense message ("Saved", "Moved to
  Trash"), 2–4s, with **Undo** when the action is reversible. Top on
  phones (under the status bar) or bottom above the tab bar — pick one.
  `role="status"`.
- **Loading:** skeleton shapes matching the coming layout for content;
  spinner only for short, blocking actions inside a button
  (`aria-busy="true"`, label "Saving…"). Don't flash a loader for <300ms.
- **Pull to refresh** on lists that can change remotely; spinner revealed
  from the top, haptic tick at the threshold where supported.
- **Swipe actions** on rows: trailing = destructive (Delete, red) and
  secondary (Archive); leading = positive (Done). Always also reachable
  without swiping (a menu or the detail screen) for keyboard and assistive
  tech users.
- **Long press / drag to reorder:** lift the row with a shadow, auto-scroll
  near edges, and keep a non-drag way to reorder.

## 15. Notifications (push)

Notifications interrupt — each one has to earn it.

- **Timing:** at the time the person chose, not "a few minutes early".
  Day-level reminders ("today's the day") at a sensible local hour (e.g.
  08:00), never at midnight; skip them when a timed reminder comes anyway.
- **One per thing:** the same `tag` for everything about one item, so a
  newer notification replaces the older one (with `renotify: true` so it
  still alerts). Never two for the same event.
- **Content:** title = the item's name; body = what's happening in a few
  words; in the person's language and text direction. Offer to hide names
  on the lock screen ("Reminder" instead of the item's title).
- **Actions:** one or two real actions (Mark Done, Snooze 10 min) that work
  without opening the app; tapping the notification opens that item.
- **Look:** don't repeat the app logo as the large icon (Android already
  shows it); use a contextual image or none. Provide a monochrome badge for
  the status bar.
- **Sound:** pages can't pick a sound — leave `silent` off and add a
  `vibrate` pattern; point people to their device settings if they hear
  nothing.

## 16. Option picker (replaces native `<select>`)

The browser's own `<select>` looks out of place in a polished app and can't
hold search, icons or descriptions. Use a trigger that displays the chosen
option and opens a shared picker sheet.

**Trigger:** a button with the current choice and a chevron
(`aria-haspopup="listbox"`, `aria-expanded`).

**Sheet content**
- Title, then (for lists longer than ~10 options) a search field as a
  toolbar **under the title, outside the scrolling area**, so it stays put.
- The list: `role="listbox"`, each option `role="option"` with
  `aria-selected`; the selected one in the accent color with a checkmark.
- On open, scroll the selected option into the middle of the list
  (`scrollIntoView({ block: 'center' })`).
- Arrow keys move through options, Enter picks, typing filters.

**Placement**
- On open, measure the bottom of the top bar and the top of the bottom tab
  bar (and re-measure on resize/orientation change); place the sheet in
  the space between them with a small gap on each side.
- Give the sheet a lower `z-index` than the top bar and tab bar, so they
  stay visible and usable.

**Closing**
- Any tap outside the sheet closes it **and still does what was tapped** —
  tapping a tab closes the picker and goes to that tab.
- Also closes with Done and with Escape; picking an option closes it (for
  single choice).

**Accessibility**
- `role="dialog"`, `aria-modal="true"`, labelled by its title; focus moves
  into the sheet on open (the search field or the selected option) and
  back to the trigger on close; the page behind doesn't scroll while it's
  open (`overflow: hidden` on the scroll container / `overscroll-behavior:
  contain` on the sheet).

**Motion:** backdrop fades, sheet slides up; both off under
`prefers-reduced-motion`.

**Check on every screen that uses it:** opens in the free space with the
top bar and tab bar visible; search stays fixed while the list scrolls;
tapping a tab closes it and navigates; no console errors.

## 17. Showing an error at the field that caused it

When something can't be saved, people must see **which field**, **why**,
and **land on it** — never a generic "Something went wrong" somewhere else.

**The message**
- Specific and in the person's language: what's wrong and how to fix it
  ("Pick at least one day", "Use a date after the start date") — not
  "Invalid input" or an error code.
- Shown directly under the field (`role="alert"`, linked with
  `aria-describedby`); the field gets `aria-invalid="true"`.

**The highlight** — the field (or the group: day picker, toggles, card)
turns red until it's fixed:

```css
[aria-invalid="true"] {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 22%, transparent);
}
.field-error { color: var(--color-danger); font-size: 0.8125rem; margin-top: 6px; }
```

Not color alone: the message text (and optionally an error icon) is always
there too.

**Going there** — on submit, for the first invalid field:
1. If it's inside something hidden — a collapsed "More options", another
   tab or step, a closed accordion — open that first.
2. Scroll it into view, centered, with room for fixed bars:
   `el.scrollIntoView({ behavior: 'smooth', block: 'center' })` plus
   `scroll-margin-top` (≥ the top bar's height) on fields. Inside a sheet
   or modal, scroll that container, not the page.
3. Focus it (`el.focus({ preventScroll: true })` after scrolling), so
   keyboard and screen-reader users land there too.
4. With several errors, show a short summary at the top of the form
   ("2 fields need attention") whose items jump to each field.

**Errors from the server** — map them to fields too: the API returns which
field failed (e.g. `{ field: "email", message: "…" }`), the form shows it
under that field and jumps there. Only errors that belong to no field go
in a banner/toast — still specific, never just "Error".

**Clearing** — the red state and message disappear as soon as the field is
valid again (validate that field on change once it has been flagged).

## 18. Not-found page (404), made for this product

A wrong or old link is a moment to keep people, not lose them. Design the
404 page for this specific product — never the framework's default, a blank
page, or a bare "404".

**Content**
- Inside the normal layout: the same top bar, navigation and footer, so
  people can go on from there.
- A short, friendly title in the product's voice that says what happened
  without blame ("This page doesn't exist — maybe it moved"), and one
  sentence on what to do next.
- A small illustration or the product's mascot/hero object in a "lost"
  state, drawn in the brand colours (own artwork, light and dark).
- The most useful ways on: a primary button to the main place (Home / Shop
  / Dashboard), a few links to top sections or popular items, and a search
  field if the product has search.
- A Back button (history back with a fallback).
- Translated, RTL-aware, one `h1`, works at 320px.

**Behaviour**
- Every unknown route renders it: a catch-all route (`path="*"`, a
  `not-found` page, an `errorElement`) — and links to things that no longer
  exist (a deleted product, an expired order link) show the same page with
  a specific message ("This product isn't available any more") instead of a
  crash or an empty template.
- Correct status where the server decides: a real `404` from the server or
  static host for unknown URLs where possible; for single-page apps that
  always return `200`, add `<meta name="robots" content="noindex">` on the
  404 view so search engines don't index it.
- Log 404s (path and referrer, no personal data) to find broken links.

**Don't:** redirect every unknown URL to the home page silently, show a
technical stack trace, or use a joke that blames the person.
