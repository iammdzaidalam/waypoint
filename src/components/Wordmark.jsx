import Image from 'next/image';
import black from '../../public/brand/waypoint-black.png';
import white from '../../public/brand/waypoint-white.png';

// Both files ship and CSS picks one via [data-theme]. Doing the swap in
// CSS rather than from React state means the right mark is painted on the
// first frame - a state-driven swap would flash the wrong one on load.
const RATIO = 1400 / 313;

export default function Wordmark({ height = 20, className = '', priority = false }) {
  // No `sizes`: it opts into the width-descriptor srcset, and Next then
  // picks the smallest candidate (a 32px-wide file) and upscales it to a
  // blur. Plain width/height gives a fixed 1x/2x srcset instead.
  const common = {
    alt: 'Waypoint',
    height,
    width: Math.round(height * RATIO),
    priority,
    draggable: false,
  };
  return (
    <span className={`wordmark ${className}`} style={{ height }}>
      <Image {...common} src={black} className="wordmark-black" />
      <Image {...common} src={white} className="wordmark-white" />
    </span>
  );
}
