import { HATCH, DOTS, MARKS, CROSSES } from '../../content/hero-grid';

// Position helpers. The grid is centred on the page, so a column index is
// an offset from the centre line in whole cells — which is what keeps the
// backdrop locked to the 1240px frame rather than drifting with viewport
// width.
const x = col => `calc(50% + ${col} * var(--hero-cell))`;
const y = row => `calc(${row} * var(--hero-cell))`;
const size = n => `calc(${n} * var(--hero-cell))`;

export default function HeroGrid() {
  return (
    <div className="hero-grid" aria-hidden="true">
      {HATCH.map(({ col, row, w, h }, i) => (
        <span
          key={`p${i}`}
          className="hg-hatch"
          style={{ left: x(col), top: y(row), width: size(w), height: size(h) }}
        />
      ))}
      {DOTS.map(({ col, row }, i) => (
        <span key={`d${i}`} className="hg-dots" style={{ left: x(col), top: y(row) }} />
      ))}
      {MARKS.map(({ col, row }, i) => (
        <span key={`m${i}`} className="hg-mark" style={{ left: x(col), top: y(row) }} />
      ))}
      {CROSSES.map(({ col, row }, i) => (
        <span key={`c${i}`} className="hg-cross" style={{ left: x(col), top: y(row) }} />
      ))}
    </div>
  );
}
