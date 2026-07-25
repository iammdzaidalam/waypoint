import Link from 'next/link';

export const metadata = {
  title: 'Not found',
  robots: { index: false, follow: true },
};

// Uses the site's frame/column system so the page reads like the rest of
// Waypoint - bordered rules, nav clearance, centred content - instead of
// falling back to bare, unstyled markup.
export default function NotFound() {
  return (
    <div className="wrap">
      <div className="frame">
        <div className="col">
          <div className="notfound">
            <div className="sec-eyebrow"><span className="ic">404</span> <span className="lbl">not found</span></div>
            <h1>That trail goes nowhere.</h1>
            <p>
              Couldn’t find that as a GitHub user, org, or repo. Check the spelling, use{' '}
              <code className="inline-code">owner/repo</code> for a repository, or head back and
              trace something else.
            </p>
            <div className="notfound-actions">
              <Link className="btn btn-primary" href="/#top">Back to Waypoint</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
