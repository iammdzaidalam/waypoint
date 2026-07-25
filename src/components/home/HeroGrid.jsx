import {
  HATCH, DOTS, MARKS, CROSSES,
  HATCH_CLI, DOTS_CLI, MARKS_CLI, CROSSES_CLI,
} from '../../content/hero-grid';

// Position helpers. The grid is centred on the page, so a column index is
// an offset from the centre line in whole cells - which is what keeps the
// backdrop locked to the 1240px frame rather than drifting with viewport
// width.
const x = col => `calc(50% + ${col} * var(--hero-cell))`;
const y = row => `calc(${row} * var(--hero-cell))`;
const size = n => `calc(${n} * var(--hero-cell))`;

// variant 'cli' swaps in the CLI composition; default is the home hero.
export default function HeroGrid({ variant }) {
  const cli = variant === 'cli';
  const hatch = cli ? HATCH_CLI : HATCH;
  const dots = cli ? DOTS_CLI : DOTS;
  const marks = cli ? MARKS_CLI : MARKS;
  const crosses = cli ? CROSSES_CLI : CROSSES;

  return (
    <div className="hero-grid" aria-hidden="true">
      {hatch.map(({ col, row, w, h }, i) => (
        <span
          key={`p${i}`}
          className="hg-hatch"
          style={{ left: x(col), top: y(row), width: size(w), height: size(h) }}
        />
      ))}
      {dots.map(({ col, row }, i) => (
        <span key={`d${i}`} className="hg-dots" style={{ left: x(col), top: y(row) }} />
      ))}
      {marks.map(({ col, row }, i) => (
        <span key={`m${i}`} className="hg-mark" style={{ left: x(col), top: y(row) }} />
      ))}
      {crosses.map(({ col, row }, i) => (
        <span key={`c${i}`} className="hg-cross" style={{ left: x(col), top: y(row) }} />
      ))}
    </div>
  );
}
