# Design tokens

Define every color once, as a custom property, with a dark value. Components
only ever use `var(--…)`.

```css
:root {
  color-scheme: light dark;
  --color-bg: light-dark(#f2f2f7, #000000);        /* grouped background */
  --color-surface: light-dark(#ffffff, #1c1c1e);   /* cells, cards */
  --color-surface-2: light-dark(#f2f2f7, #2c2c2e); /* nested / pressed */
  --color-text: light-dark(#000000, #ffffff);
  --color-text-muted: light-dark(#6c6c70, #98989d);
  --color-separator: light-dark(rgb(60 60 67 / 0.29), rgb(84 84 88 / 0.6));
  --color-accent: light-dark(#007aff, #0a84ff);
  --color-danger: light-dark(#ff3b30, #ff453a);
  --color-success: light-dark(#34c759, #30d158);

  --radius-cell: 10px;     /* inset grouped list */
  --radius-card: 16px;
  --radius-sheet: 14px;
  --radius-pill: 999px;
  --space-gutter: 16px;
  --tap: 44px;             /* minimum tap target */

  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur: 220ms;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font: 17px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

`light-dark()` needs a modern browser. If you must support older ones, define
the light values on `:root` and override them in
`@media (prefers-color-scheme: dark)` (and again under `[data-theme="dark"]`
if the app has its own theme switch).

## Theme switch with "Automatic"

Offer Light, Dark **and Automatic** (follow the device), default Automatic.
Listen to `matchMedia('(prefers-color-scheme: dark)')` changes so Automatic
updates live. Store only an explicit choice.

## Glass (materials)

```css
.bar, .sheet {
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border: 0.5px solid color-mix(in srgb, var(--color-text) 12%, transparent);
}
```

- Always write the `-webkit-` line too (Safari), and **check the built CSS**:
  some minifiers drop or rewrite `backdrop-filter`. See web-ui-pitfalls.
- An element with `backdrop-filter` (or `transform`, `filter`) becomes the
  containing block for `position: fixed` children — portal dialogs to `body`.

## Scrollbars

Style them once, globally, so every scroll area matches the theme:

```css
* { scrollbar-width: thin; scrollbar-color: var(--color-text-muted) transparent; }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner { background: transparent; }
::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--color-text) 30%, transparent); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: color-mix(in srgb, var(--color-text) 45%, transparent); }
```

Thin, rounded, no track or arrows, colored from theme tokens so light and
dark switch automatically.

## Icon tiles (settings rows)

Colored rounded square, white glyph — in both themes:

```css
.icon-tile { width: 29px; height: 29px; border-radius: 7px; display: inline-grid; place-items: center; color: #fff; }
.icon-tile > svg { width: 18px; height: 18px; }
```

Draw glyphs with `currentColor` so the tile decides the color.

## Accent swatches (color pickers)

Round 30px swatches that wrap (no sideways scrolling); the chosen one gets a
ring in its own color with a gap:
`box-shadow: 0 0 0 2.5px var(--color-surface), 0 0 0 4.5px currentColor;`
