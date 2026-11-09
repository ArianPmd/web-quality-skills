# Motion, sound & haptics

## Motion

| What | Duration | Easing |
|---|---|---|
| Press feedback (scale 0.96–0.98) | 100–150ms | ease-out |
| Toggle, segmented selection, color change | 150–200ms | ease-out |
| Sheet / dialog in | 250–300ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` (decelerate) |
| Sheet / dialog out | 200ms | ease-in |
| Page push (navigation forward) | 300–350ms | decelerate; slide from the trailing edge |
| List item insert / remove | 200–250ms | ease-out height + opacity |

Rules:
- Motion explains a change (where something came from, where it went) —
  never decoration on every element.
- Animate `transform` and `opacity` only; animating `height`/`top` janks.
- Interruptible: a second tap during an animation must not queue or break.
- Forward and back are mirrored; in RTL the direction flips.
- `@media (prefers-reduced-motion: reduce)`: replace movement with a short
  opacity fade or nothing.
- Celebrations (level up, streak) are short (<1s), skippable, and rare.

```css
.sheet { animation: sheet-in 280ms cubic-bezier(0.2, 0.8, 0.2, 1); }
@keyframes sheet-in { from { transform: translateY(100%); } }
@media (prefers-reduced-motion: reduce) {
  .sheet { animation: fade-in 120ms ease-out; }
}
@keyframes fade-in { from { opacity: 0; } }
```

## Sound

- Optional and off-able in Settings (one switch for all app sounds is fine).
- Short (under ~400ms), quiet, and tied to the person's own action (done,
  level up). Never on page load or notifications the app shows itself.
- Generate sounds in code (Web Audio) or use CC0 files — see licensing.
- Browsers block audio until the first user gesture; create/resume the
  `AudioContext` inside a tap handler.
- Never the only signal: pair it with a visual change.

## Haptics

`navigator.vibrate(10)` works on Android Chrome only (not iOS Safari). Use
it as a light extra on important confirmations; feature-detect, and follow
the same off switch as sounds.
