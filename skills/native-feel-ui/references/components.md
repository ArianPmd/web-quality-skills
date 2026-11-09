# Components catalog

When to use each component, the rules that make it feel right, and the web
element to build it on. Layouts and code sketches for the most common ones
are in `patterns.md`.

## Actions

**Buttons** (`<button>`)
- One prominent (filled) button for the most likely action per view; the
  rest secondary/plain. Distinguish by style, not size.
- Clear purpose: a verb label, a familiar icon, or both; text when an icon
  would be ambiguous.
- Roles: primary, cancel, destructive. Never make a destructive action the
  primary/default button, even if it's the likely choice.
- Every custom button has hover, pressed (`:active`), focus-visible and
  disabled states; actions that take time show a spinner inside the
  button and `aria-busy`.
- A trailing "…" in the label when it opens something that asks for more
  input before acting.

**Menus** (`<button aria-haspopup="menu">` + `role="menu"`)
- Short labels, verbs or nouns, no articles; consistent capitalization.
- Most used items first; group related items with separators; keep it
  short; submenus rarely and only one level deep.
- Unavailable items: dimmed in app menus; *hidden* in context menus.
- Icons only when they help, the same icon for the same action everywhere.
- A toggled item shows its state (checkmark) or a label that changes
  ("Show Grid" / "Hide Grid").
- Destructive items in red, confirmed before acting.

**Context menus** (right-click / long-press)
- Only actions relevant to the item, few of them, most frequent first.
- Everything in a context menu must also be reachable elsewhere in the UI
  (keyboard and assistive-tech users may never open it).
- Offer them consistently across similar items.

**Pull-down buttons** (a button that opens a menu of related commands: Add,
Sort, More)
- Commands directly related to the button; don't hide all the view's
  actions in one "More".

**Pop-up / select buttons** (a listbox button — see the option picker
pattern in `patterns.md`; a native `<select>` only where its look is fine)
- One level of choices where only one can be picked, with a sensible
  default; the button shows the current choice so the options are
  predictable.

**Toolbars / navigation bars**
- Few items, chosen deliberately; extras go in a More menu.
- Leading: back, sidebar toggle, title. Trailing: key actions, search,
  More. Group navigation and critical actions (Done, Save) separately.
- A useful, concise title per screen — not the app name.
- Standard Back and Close; one prominent style for Done/Submit.
- Prefer plain icon buttons over bordered ones; little background color.

**Share** — use the Web Share API (`navigator.share`) where available,
with a copy-link fallback; one Share button in a predictable place.

## Navigation

**Tab bar** — top-level sections only (not actions); always visible within
those sections; 3–5 tabs; never hide or disable a tab (show an empty state
inside); always labelled; a badge only for something that needs attention.

**Sidebar** — on wide screens instead of the tab bar; leading side; at most
two levels with clear group titles; optionally collapsible; icons with a
purpose (not rainbow colors); no critical actions at its bottom.

**Split view** (list | detail on wide screens) — persistently highlight the
selected item that leads to the detail; collapse to push navigation on
narrow screens.

**Tab views / in-page tabs** (`role="tablist"`) — closely related panes of
the same area; controls in a pane affect only that pane; ≤ 6 tabs; never a
select box to switch tabs.

**Page controls** (carousel dots) — only for an ordered series of pages;
centered at the bottom; few pages; plain dots, no colors; arrow-key and
swipe support.

**Search fields** (`<input type="search">`)
- Placeholder that says what can be searched ("Search recipes").
- Search as people type when results are fast; suggestions and recent
  searches (mind privacy: let people clear history).
- Simple results; optional filters (scope chips) — default to the broadest
  scope, show the current scope clearly.
- Placement: in the toolbar or top of a list it searches; a dedicated tab
  when search is a main activity; focus the field when that tab opens.

## Presentation

**Alerts** (`role="alertdialog"`)
- Rare: only for critical information or a decision with consequences —
  not for "Saved!", not at startup, not for undoable actions (offer Undo
  instead).
- Title that states the situation; a message only if it adds something;
  never explain the buttons.
- Specific button labels ("Delete", "Keep Editing"), not OK/Yes/No, unless
  purely informational. Cancel for anything destructive; Escape cancels.

**Action sheets** — a set of choices *about an action the person started*
("Delete this photo?" → Delete / Cancel). Short title, message only if
needed, destructive option prominent (red), Cancel always present, no
scrolling. Use a menu or popover on wide screens.

**Sheets** — a scoped task related to the current context (create, edit,
pick). Cancel/Close (discard) + Done (save); Back only for multi-step flows
inside the sheet. One sheet at a time; long or complex flows get a page
instead. On phones: grabber, swipe down to dismiss, optional half height
for progressive disclosure. Confirm before discarding changes.

**Popovers** — small amounts of information or controls next to their
trigger on wide screens; one at a time, nothing stacked on top; close on
outside click and save any changes when they close; not for warnings; on
narrow screens use a sheet instead.

**Modality in general** — only when there's a clear benefit; short and
focused; an obvious way out; a clear title saying what the task is; never a
modal that feels like an app inside the app; close one before opening
another.

**Scroll areas** — standard scrolling (wheel, touch, keyboard, Page Up/Down,
Space); make it obvious there's more (cut-off item, fade); never nest two
scroll areas in the same direction; scroll a hidden focused field or search
result into view; a subtle top/bottom edge effect only where content passes
under floating bars.

**Windows / full screen** — layouts adapt fluidly to any window size; offer
the Fullscreen API only for media, games or focused reading, always let
people exit (Esc), keep essential controls reachable, restore the previous
state on exit.

## Content

**Lists and tables** (`<ul>`, `<table>`)
- Lists for text; short row text that wraps or truncates gracefully (with
  the full text available).
- Clear feedback on selection; in-place editing when it makes sense
  (reorder, delete).
- Data tables: descriptive column headers, click-to-sort where useful
  (`aria-sort`), resizable columns on desktop, zebra striping for wide
  multi-column tables.

**Collections / grids** — visual content (photos, products); standard grid
layouts; easy selection; animate insert/delete/reorder subtly; avoid
dynamic layout jumps.

**Cards / boxes** — group related information; keep them modest in size;
an optional short title; padding and alignment for sub-grouping; equal sizes
within a row.

**Labels and text** — non-editable text uses `--color-text` /
`--color-text-muted` for importance; make useful text selectable (IDs,
addresses, codes); long text: comfortable line length (45–75 characters).

**Disclosure** (`<details>`/`<summary>` or a button with `aria-expanded`)
— hide details until relevant; place it next to what it reveals; a
descriptive label; one per view.

**Images** — use real images only for content; interface symbols are icons;
take care with text over images; consistent sizes in sequences.

**Charts**
- Use one when it reveals something about the data; keep it simple; details
  on demand (tooltip, tap), never only on interaction.
- Common chart types first; explain novel ones.
- Axis ranges that fit the meaning (bars start at zero); familiar tick
  values; subtle grid lines.
- A text summary of the main message near the chart; consistent styling
  across charts; the same data looks the same everywhere.
- Never color alone between series — add labels, patterns or markers, and
  separation between adjacent color areas.
- Accessible: a descriptive label with real values and units ("June 6:
  42 minutes", not "6/6: 42m"), describe meaning not appearance, keyboard
  navigation of data points, decorative axis labels hidden from screen
  readers if the data is described.

**Embedded web content** (`<iframe>`) — only for content you can't render
natively; never build a browser in a browser; sandbox it.

## Selection and input

**Text fields** — for short input; a visible label; a hint/placeholder with
an example; field width that matches the expected length; the right
`type`/`inputmode`/`autocomplete`/`enterkeyhint`; masked password fields
(with a show toggle); never prefill passwords; a clear button; logical tab
order; validate at the right moment; number formatting for numbers.

**Multi-line text** (`<textarea>`) — for long or formatted text; legible
size; grows with content or scrolls.

**Combo box** (`<input list>` / autocomplete) — text plus suggestions; a
meaningful default, an introductory label, relevant choices.

**Token / chip input** — turn entries into removable chips (emails, tags);
convert on comma/Enter/paste; a menu on each chip for actions.

**Code / PIN entry** — `autocomplete="one-time-code"`, `inputmode="numeric"`,
secure display when sensitive, a clear statement of what the code is for,
paste support.

**Pickers** — medium-to-long lists or dates/times; predictable ordering;
show them in place (inline or in a sheet), not on a separate page; minute
steps (5/15) when exact minutes don't matter; use the platform date/time
inputs or a picker that also accepts typing.

**Segmented controls** — 2–5 closely related, mutually exclusive choices
that change a view or state; all text or all icons, not mixed; noun labels;
similar segment sizes. For switching whole pages use tabs.

**Toggles**
- A switch (`role="switch"`) for on/off settings that apply immediately —
  in list rows.
- Outside lists, a toggle button (`aria-pressed`) or a checkbox.
- Checkboxes for independent options or hierarchies of settings; radio
  buttons for a small set of exclusive options; obvious visual difference
  between states; the label names the setting, not the control.

**Sliders** (`<input type="range">`) — approximate values on a familiar
direction (min left, mirrored in RTL); pair with a number field/stepper for
precision; live feedback; tick marks and labels for meaningful points.

**Steppers** — small increments; the value they change is visible next to
them; pair with a text field for big jumps.

**Color selection** — the platform color input or curated swatches.

## Status

**Progress** — determinate (bar or ring with real progress) whenever you can
measure it; switch from indeterminate to determinate once you can; keep it
moving; consistent location; a short description of what's happening; a
Cancel when it's safe, with a warning if cancelling loses something. Don't
switch between bar and circular styles for the same task.

**Gauges / meters** (`<meter>`) — a value within a range, with labels for
the value and both ends; a gradient or color zones only if they carry
meaning.

**Rating** — easy to change; clear symbol; accessible as a radio group.

**Badges** — only for counts of unread/new items; always up to date; never
the only way essential information is shown; don't imitate system badges
for other purposes.
