# Inputs: keyboard, pointer, touch, focus

People reach the same features with touch, mouse/trackpad, keyboard,
voice and assistive technology. Each must work on its own.

## Keyboard

- Everything works with the keyboard alone: logical tab order, visible
  focus, Escape closes, Enter submits, arrow keys inside composite
  controls (menus, tabs, lists, grids).
- Respect standard shortcuts (copy, paste, undo, find, select all, browser
  navigation); never repurpose them.
- Custom shortcuts only for the most frequent app actions; conventional
  modifiers (`Ctrl`, or the command key on platforms where that is the
  convention — detect it at runtime);
  list them in a help panel (`?`) and in menus/tooltips; ignore them while
  the person types in a field.
- Keep related commands on related keys: Shift + an existing shortcut
  should do a variant of the same command, not something unrelated. Test
  shortcuts on non-English keyboard layouts.

## Pointer (mouse, trackpad)

- Hover states on interactive elements; the pointer cursor only on links
  and link-like controls (buttons keep the default in native-feeling UIs —
  pick one convention and keep it).
- Controls that fade out (video controls, toolbars) reappear on pointer
  movement and on focus.
- Right-click opens your context menu only where you offer one; otherwise
  leave the browser's menu.
- Modifier clicks behave as people expect (Shift-click range select,
  Ctrl/Cmd-click toggle or open in new tab).

## Touch and gestures

- Standard gestures mean what people expect (tap, swipe to scroll,
  pull to refresh, pinch to zoom where content zooms).
- Every gesture has a visible alternative (button or menu) — custom
  gestures are shortcuts, never the only way.
- Custom gestures only when necessary: discoverable, easy to perform,
  distinct from others, taught in context.
- Respond instantly and follow the finger; show when a gesture isn't
  available.
- Don't fight browser/system gestures (edge swipe back, pull-to-refresh on
  the page, pinch zoom): use `overscroll-behavior` and `touch-action`
  narrowly, never disable zoom globally.
- Touch targets ≥ 44×44px with spacing between them; make targets larger,
  not the visible control.

## Focus and selection

- Use the browser's focus model; style it with `:focus-visible`, never
  remove it.
- Don't move focus unless the person caused it (opening a dialog moves
  focus into it; closing returns it).
- A ring around fields and buttons; a highlight for the selected row in
  lists and grids.
- After deleting or moving an item, put focus on a sensible neighbor.

## Text input on touch devices

- The right virtual keyboard via `inputmode` and `type` (email, numeric,
  decimal, tel, url, search) and a matching `enterkeyhint` (next, done,
  search, send).
- Keep the focused field visible above the keyboard; controls attached to
  the keyboard (e.g. a "Done" bar) only when they add value.

## Voice and assistive technology

- Visible labels match accessible names (so "click Save" works with voice
  control).
- Screen readers: meaningful labels for controls and images, headings for
  structure, grouping and order that match the visual layout, live
  announcements for changes (`aria-live`), decorative images hidden.
