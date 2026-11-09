# Licensing & copyright checklist

Goal: everything shipped is yours, open-licensed compatibly, or properly
licensed/paid for — and attributions required by licenses are present.

## Code dependencies
- `[M]` List production dependencies' licenses (scanner). Permissive (MIT,
  ISC, BSD, Apache-2.0) are fine with attribution kept in the bundle/notice.
- `[M]` Copyleft: GPL/AGPL in a closed-source or network service needs a
  decision (AGPL triggers on network use). LGPL usually fine when linked
  dynamically. Flag "UNLICENSED", "SEE LICENSE IN …", missing or custom
  licenses for manual review.
- `[S]` Third-party notices file / "Open-source licenses" screen.

## Fonts
- `[M]` Each font file's license allows web embedding (OFL, Apache are fine).
- `[M]` Platform fonts (e.g. Apple's SF Pro/SF Symbols, Segoe UI) may not be
  bundled or served from your site — use the system font stack instead.

## Icons, images, illustrations, sprites
- `[M]` Each icon set / image has a known source and license (CC0, MIT, CC BY
  with attribution, purchased with a license covering this use).
- `[M]` No logos or trademarks of other companies except to refer to them
  (e.g. "Sign in with X" following their brand guidelines).
- `[M]` No screenshots, stock photos or artwork taken from the web without a
  license. AI-generated assets: check the generator's terms.
- `[S]` Keep a `CREDITS.md` with source + license per asset.

## Sounds & music
- `[M]` Same as images; prefer sounds generated in code or CC0 libraries.

## Text & content
- `[M]` Legal texts written for this app (templates are fine if their license
  allows reuse).
- `[S]` No copied documentation/blog text in the UI.

## Names & trademarks
- `[M]` The app name isn't already a registered trademark in your market
  (search the EU/national trademark databases).
- `[S]` Don't describe the product as "Apple-style", "Material" etc. in a
  way that suggests affiliation.

## Paid services
- `[S]` Note each paid or free-tier service and its limits (hosting sleep,
  e-mail quotas, database size) so the launch doesn't break on day two.
