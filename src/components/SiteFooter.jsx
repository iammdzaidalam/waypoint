import Wordmark from './Wordmark';

const REPO = 'https://github.com/iammdzaidalam/waypoint';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <a href="/#top" className="brand" aria-label="Waypoint home">
            <Wordmark height={22} />
          </a>
          <p className="footer-blurb">
            A free, open source GitHub activity tracer. See where developers and projects actually spend their time.
          </p>
        </div>

        {/* Only destinations that go somewhere distinct. The example
            traces are already offered in the hero, "Self-host" pointed at
            the same URL as the repo link, and author and licence are both
            one click inside the repo. */}
        <nav className="footer-links">
          <a href="/#faq">FAQ</a>
          <a href={REPO} target="_blank" rel="noopener noreferrer">Source</a>
          <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Report an issue</a>
        </nav>
      </div>

      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Waypoint · Reads public GitHub data via the official API.</span>
        <span>Not affiliated with GitHub.</span>
      </div>

      {/* Sits last and is clipped by the footer's overflow, so only the
          top of the letterforms shows - same as the reference. */}
      <div className="footer-wordmark" aria-hidden="true">
        <Wordmark height={260} />
      </div>
    </footer>
  );
}
