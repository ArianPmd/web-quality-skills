// White glyphs on colored tiles: correct in both themes.
export const TILES = { color: '#ff3b30', tint: '#007aff', bg: '#34c759' };
export function BellGlyph() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M1 1" fill="#fff" />
      <path d="M2 2" stroke="#fff" />
      <circle cx="3" cy="3" r="1" fill="#ffffff" />
    </svg>
  );
}
