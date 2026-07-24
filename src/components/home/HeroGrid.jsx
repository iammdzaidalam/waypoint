import { V, H, M } from '../../content/hero-grid';

// The hero plan drawing, drawn as real elements rather than loaded as an
// image — same approach as the frame rules, just more of them. Positions
// are percentages so the drawing stretches with the hero at any height;
// markers keep a fixed pixel size so they stay square.
export default function HeroGrid() {
  return (
    <div className="hero-grid" aria-hidden="true">
      {V.map(([x, y, h], i) => (
        <i key={`v${i}`} className="hg-v" style={{ left: `${x}%`, top: `${y}%`, height: `${h}%` }} />
      ))}
      {H.map(([x, y, w], i) => (
        <i key={`h${i}`} className="hg-h" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%` }} />
      ))}
      {M.map(([x, y], i) => (
        <i key={`m${i}`} className="hg-m" style={{ left: `${x}%`, top: `${y}%` }} />
      ))}
    </div>
  );
}
