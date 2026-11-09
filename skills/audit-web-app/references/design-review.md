# Design review

Checks the interface against the guidance in `../../native-feel-ui/`. Look at
the running app when possible (phone width and desktop, light and dark,
second language); otherwise read the components and styles.

Pick the 3–6 screens that matter most (first screen, the core task, a form,
settings, an empty state, an error) and go through them with this list.

Every finding: screen or `file:line`, the rule it breaks (file + section in
native-feel-ui), what people experience, the fix. Taste is not a finding.

## Must (people are blocked, misled or excluded)

- Text or icons below contrast minimums in either theme
  (`accessibility.md`, `foundations.md` › Color).
- Information carried by color alone (errors, status, chart series).
- Tap targets under 44×44px or packed without spacing on touch screens.
- Controls without accessible names; focus not visible; dialogs that don't
  trap focus or close with Escape.
- No way out: a modal, sheet or flow without Cancel/Close/Back
  (`components.md` › Presentation).
- Destructive action as the default/primary button, or without confirm or
  Undo (`components.md` › Buttons, Alerts).
- Layout broken at 375px, at 200% text, or in the RTL language.
- Unreadable glass: body text on translucent surfaces over busy content
  (`foundations.md` › Materials).
- A form that does nothing on Save without saying why (see
  `web-ui-pitfalls` › Forms › silent validation failure), or whose error is
  generic and doesn't take people to the field at fault, outlined in red
  (`patterns.md` › 17).

## Should (friction, inconsistency, polish)

**Principles** (`principles.md`)
- More than one primary action competing on a screen; features or settings
  that don't earn their place.
- Inconsistent patterns: the same thing looks or behaves differently in
  two places.
- Actions without visible feedback.

**Foundations** (`foundations.md`)
- Colors with more than one meaning; raw colors instead of tokens; dark
  mode that is an inverted light mode.
- Weak hierarchy: everything the same size/weight; too many typefaces;
  light font weights for body text.
- Icons in mixed styles or weights; ambiguous icons without labels.
- Motion that is decorative, slow (>300ms), on very frequent actions, or
  not reduced under `prefers-reduced-motion`.
- Splash screens used for branding; the app doesn't restore where people
  left off.
- Permissions asked at launch or without an explanation.

**Components** (`components.md`) — for each component the app uses, check
its rules. Common misses:
- Alerts for things that don't need a decision ("Saved!"), OK/Yes/No button
  labels, alerts at startup.
- Switches outside list rows; segmented controls used as navigation or
  with mixed text and icons.
- Tab bars with actions, hidden/disabled tabs, or no labels.
- Menus with too many items, deep submenus, items only reachable by
  right-click.
- Sheets for long flows; stacked modals or popovers.
- Progress spinners where real progress is known; no Cancel on long work.
- Search without a hint, scope or a useful empty result.

**Writing** (`principles.md` › Writing)
- Buttons that aren't verbs; the same thing named differently; jargon;
  error messages without a way forward; empty states without a next step.

**UX patterns** (`ux-patterns.md`)
- Sign-in required before people see any value.
- Confirmations where Undo would be better; no Undo at all.
- Blank screens while loading; settings that duplicate device settings or
  need a Save button.

**Inputs** (`inputs.md`)
- Gestures without a visible alternative; overridden standard shortcuts;
  wrong mobile keyboards on fields.

## Report section

In the audit report, add a **Design** group under Must and Should, after
UI/UX, with the same item format, and a one-line overall impression (e.g.
"Clean and consistent; main issues: contrast in dark mode and alert
overuse").
