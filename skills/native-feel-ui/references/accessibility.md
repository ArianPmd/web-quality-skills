# Accessibility

**Must**
- Every interactive element is a real `<button>`, `<a href>` or form control
  — no clickable `<div>`s.
- Icon-only buttons have `aria-label`; decorative SVGs have `aria-hidden="true"`.
- Visible focus ring on keyboard focus (`:focus-visible`), never removed.
- Dialogs: `role="dialog"`/`"alertdialog"`, `aria-modal="true"`, labelled by
  their title, focus trapped, Escape closes, focus returns to the trigger.
- Contrast ≥ 4.5:1 for text, 3:1 for large text and essential icons — check
  both themes, and text on glass over the busiest background it can sit on.
- Text can grow to 200% without clipping (use `rem`, avoid fixed heights on
  text containers).
- Status changes that aren't focused (toasts, saved, errors) are announced:
  `role="status"` or `role="alert"`.

**Should**
- Composite controls (segmented, tabs, swatch pickers) are one tab stop with
  arrow-key navigation.
- `@media (prefers-reduced-motion: reduce)` turns off non-essential animation
  (keep opacity fades short).
- Sounds are optional, off-able in settings, and never the only signal.
- Drag interactions have a tap alternative.
- Each screen has one `<h1>` (visually hidden if the design shows the title
  elsewhere) for screen-reader navigation.

## Beyond screens and keyboards

- **Hearing:** captions or subtitles for video, transcripts for long audio,
  and audio descriptions when important information is only visual. Every
  sound cue has a visual equivalent (and vibration where available).
- **Mobility:** large targets *and* space between them; simple gestures
  with button alternatives; everything operable by keyboard, switch
  devices and voice control (visible labels = accessible names).
- **Cognition:** keep actions simple and flows short (one decision per
  screen in complex tasks); avoid time limits, or let people extend them;
  people control media playback; confirm twice before actions that are
  hard to recover from.
- **Seizures and motion sensitivity:** no flashing more than three times a
  second; let people turn off flashing effects in media; prefer fades to
  movement, no animated blur or depth when reduced motion is on.
- **Personalization:** respect browser text size, zoom, contrast and
  reduced-transparency settings; don't lock orientation.

## Principles to check against

- **Intuitive:** familiar, consistent interactions.
- **Perceivable:** no information that depends on a single sense (sight,
  hearing, color, touch).
- **Adaptable:** works with the person's own settings and assistive tools.
