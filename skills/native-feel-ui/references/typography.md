# Typography & spacing

## Type scale

A proven mobile type scale (sizes at the default text size). Use `rem`
so the scale follows the person's text-size setting.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `--text-large-title` | 34px / 41px | 700 | Screen title at the top of a scrolling page |
| `--text-title-1` | 28px / 34px | 700 | Section heroes |
| `--text-title-2` | 22px / 28px | 700 | Card titles |
| `--text-title-3` | 20px / 25px | 600 | Sheet titles |
| `--text-headline` | 17px / 22px | 600 | Row titles, emphasized body |
| `--text-body` | 17px / 22px | 400 | Default text, list rows |
| `--text-callout` | 16px / 21px | 400 | Secondary blocks |
| `--text-subhead` | 15px / 20px | 400 | Values on the trailing side |
| `--text-footnote` | 13px / 18px | 400 | Group footers, helper text |
| `--text-caption` | 12px / 16px | 400 | Labels under icons, timestamps |

```css
:root {
  --text-body: 1.0625rem;      /* 17px */
  --text-footnote: 0.8125rem;  /* 13px */
  /* …the rest of the table */
}
h1.large-title { font-size: 2.125rem; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
```

- Tighten letter-spacing slightly on large bold titles (`-0.01em` to
  `-0.02em`); never on body text.
- Muted color for secondary text instead of a smaller size where possible.
- **Inputs are at least 16px** — iOS Safari zooms the page into smaller
  inputs.
- Numbers that change in place (timers, counters, prices) use
  `font-variant-numeric: tabular-nums`.
- Scripts with tall glyphs (Arabic, Persian, Thai, Devanagari) need more
  line-height; test truncation with them.

## Spacing

A 4px grid. Common values: 4, 8, 12, 16 (gutter), 20, 24, 32.

- Screen side gutter 16px on phones, 20px on larger screens.
- Between grouped sections: 32–35px; header to first row: 6–8px.
- Inside a row: 11–12px vertical padding, 16px horizontal, 12px between an
  icon tile and its label.
- Cards: 16px padding, 12px gap between cards.
