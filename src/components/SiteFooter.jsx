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

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="/torvalds">Trace a user</a>
            <a href="/vercel/next.js">Trace a repo</a>
            <a href="/#features">Features</a>
            <a href="/#faq">FAQ</a>
          </div>
          <div className="footer-col">
            <h4>Project</h4>
            <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={REPO} target="_blank" rel="noopener noreferrer">Self-host</a>
            <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Report an issue</a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="https://github.com/iammdzaidalam" target="_blank" rel="noopener noreferrer">Author</a>
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">MIT License</a>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <span>© {new Date().getFullYear()} Waypoint · Reads public GitHub data via the official API.</span>
        <span>Not affiliated with GitHub.</span>
      </div>

      {/* Sits last and is clipped by the footer's overflow, so only the
          top of the letterforms shows — same as the reference. */}
      <div className="footer-wordmark" aria-hidden="true">
        <Wordmark height={260} />
      </div>
    </footer>
  );
}
