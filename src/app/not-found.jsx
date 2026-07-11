import Link from 'next/link';

export const metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="hero-section">
        <div className="eyebrow">404</div>
        <h1 className="title">Not found</h1>
        <p className="tagline">
          Couldn&apos;t find that as a GitHub user, org, or repo. Double-check the spelling, or head back and try another search.
        </p>
      </div>
      <Link href="/" className="traceBtn" style={{ display: 'inline-block', textDecoration: 'none' }}>
        Back to Waypoint
      </Link>
    </div>
  );
}
