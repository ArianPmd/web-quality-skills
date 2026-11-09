# Right-to-left and translation

## Layout

- Set `<html lang="…" dir="rtl|ltr">` from the chosen language.
- Use logical properties everywhere: `margin-inline-start`, `padding-inline`,
  `inset-inline-end`, `text-align: start`. Physical `left/right` only when
  something must not mirror.
- Mirror directional icons (chevrons, back arrows) in RTL —
  `transform: scaleX(-1)` under `[dir="rtl"]`. Don't mirror clocks, media
  play buttons, checkmarks or logos.
- Decide deliberately where Back sits in RTL and keep it consistent across
  every screen.
- Wrap user-written text in `dir="auto"` so a Latin title in an RTL UI (or
  the reverse) renders correctly.
- Dates and weekday pickers: the first day of the week differs by locale
  (Saturday in Persian, Monday in much of Europe). Use `Intl` for formatting.

## Translation quality

- **Keep a glossary per language** for the product's core terms (the names
  of your main objects, currencies, levels…). Pick one word per concept and
  use it everywhere; mixed synonyms make two features look the same.
- When two features differ by one property (repeating vs one-off), the words
  must show that difference, not be near-synonyms.
- No untranslated English words left inside translated sentences unless they
  are product names.
- Follow the language's own orthography conventions consistently (agree on
  optional marks, spacing characters like the zero-width non-joiner in
  Persian).
- Units, placeholders and examples are translated too (a time field's
  `HH:MM` placeholder becomes a localized example).
- Strings built from pieces break in other languages — translate whole
  sentences with placeholders (`"{n} items"`).
- Check the longest translation in every fixed-width spot (buttons, tabs,
  segmented controls, title fields with a max length).
- Add `translate="no"` / `<meta name="google" content="notranslate">` if the
  app is already translated; browser auto-translate garbles dynamic UI.

## Things only the device can say

Push notifications are rendered by the service worker, not the page. If the
server doesn't know the user's language, send a message *kind* (plus
variables) in the payload and let the worker word it from a small built-in
table; have the page save the chosen language somewhere the worker can read
(Cache API / IndexedDB). Set `lang` and `dir` on the notification.
