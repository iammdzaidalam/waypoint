import { permanentRedirect } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import TokenBox from '../components/TokenBox';
import RecentSearches from '../components/RecentSearches';
import Reveal from '../components/Reveal';
import TerminalWindow from '../components/TerminalWindow';
import { buildTracePath } from '../lib/utils';

const faqs = [
  {
    q: 'What is GitHub Waypoint?',
    a: 'GitHub Waypoint (github-waypoint.vercel.app) is a free GitHub activity tracer. Enter any username, organization, or owner/repo and it maps where that developer or project actually spends time: pull requests opened, merge rates, review speed, and the repositories they contribute to most.',
  },
  {
    q: 'Is Waypoint free to use?',
    a: 'Yes. Waypoint is free and open source. It reads public GitHub data through the official GitHub API, and you can self-host it from the GitHub repository if you prefer.',
  },
  {
    q: 'Do I need a GitHub token or account?',
    a: 'No login is required. Adding an optional personal access token raises the GitHub API rate limit from 60 to 5,000 requests per hour. The token is stored only in your browser and never leaves it.',
  },
  {
    q: 'What is a good pull request merge rate?',
    a: 'It varies by project, but for active open source repositories a merge rate above 70 percent of decided pull requests usually signals healthy maintenance. Waypoint computes merge rate from merged versus closed PRs so you can compare projects at a glance.',
  },
  {
    q: 'Can I trace organizations and repositories too?',
    a: 'Yes. Searching an organization shows its most active repositories and likely maintainers. Searching owner/repo shows pull request analytics: merge rate, average days to merge, label distribution, and top contributors.',
  },
];

const problems = [
  { icon: '✦', t: 'Stars are not signal', d: 'Star counts and follower numbers say nothing about who actually keeps a project alive day to day.' },
  { icon: '⑃', t: 'Work is scattered', d: 'A developer’s real effort is spread across dozens of repos, issues, and pull requests you never see in one place.' },
  { icon: '◔', t: 'Merge rates are buried', d: 'Whether a repo truly ships community PRs stays invisible until you dig through every pull request by hand.' },
];

const features = [
  { icon: '◷', bg: 'rgba(21,93,252,0.12)', color: '#155dfc', t: 'Lifetime PR analytics', d: 'Every pull request a developer has opened, how many merged, and their true merge rate across their whole public history.', code: 'waypoint trace torvalds --prs' },
  { icon: '⚡', bg: 'rgba(22,163,74,0.14)', color: '#16a34a', t: 'Merge rate & review speed', d: 'For any repo: merge rate on decided PRs, average days to merge, and how fast the community actually ships.', code: 'waypoint trace vercel/next.js' },
  { icon: '⌖', bg: 'rgba(220,38,38,0.12)', color: '#dc2626', t: 'Find the real maintainers', d: 'Search an org and Waypoint surfaces its most active repos and the people who genuinely keep them moving.', code: 'waypoint trace vercel --org' },
  { icon: '⇲', bg: 'rgba(147,51,234,0.14)', color: '#9333ea', t: 'Contribution trails', d: 'Follow a developer across repositories, issues, and PRs, ranked by where they put in real, sustained effort.', code: 'waypoint trace sindresorhus' },
];

const minis = [
  { icon: '⏻', t: 'No login required', d: 'Open the site and trace. Nothing to sign up for.' },
  { icon: '⚿', t: 'Bring your own token', d: 'Optional PAT lifts the rate limit to 5,000 requests an hour.' },
  { icon: '◉', t: 'Live GitHub data', d: 'Every trace reads straight from the official GitHub API.' },
  { icon: '⧉', t: 'Users, orgs & repos', d: 'One search box handles all three kinds of target.' },
  { icon: '↧', t: 'Export CSV / JSON', d: 'Pull any repo’s pull request data out for your own analysis.' },
  { icon: '◐', t: 'Light & dark', d: 'A calm light theme and a full dark theme, your choice.' },
  { icon: '⌘', t: 'Open source', d: 'MIT licensed and self-hostable from the GitHub repo.' },
  { icon: '↗', t: 'Shareable URLs', d: 'Every trace is a plain, linkable, indexable route.' },
];

const traceTargets = ['torvalds', 'vercel', 'facebook/react', 'rust-lang', 'sindresorhus', 'kubernetes', 'django', 'sveltejs', 'tailwindlabs'];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const legacyQuery = params?.repo || params?.user || params?.org || params?.q;
  if (legacyQuery) {
    permanentRedirect(buildTracePath(legacyQuery));
  }

  return (
    <>
      {/* ---------------- blue hero ---------------- */}
      <section className="hero-band" id="top">
        <div className="container-narrow">
          <span className="hero-badge">// github activity tracer</span>
          <h1>See where developers <span className="hl">actually</span> spend their time.</h1>
          <p className="hero-sub">
            Trace any GitHub user, org, or repo and map real contribution activity: pull requests, merge rates, review speed, and the trails developers leave behind.
          </p>
          <SearchBar />
          <p className="hero-note">
            No login needed. Try <a href="/torvalds">torvalds</a> or <a href="/vercel/next.js">vercel/next.js</a>.
          </p>
          <TokenBox />
          <div className="hero-recent"><RecentSearches /></div>
        </div>

        <Reveal className="hero-window-wrap" y={26} delay={0.1}>
          <TerminalWindow title="waypoint — trace">
            <div className="demo-line"><span className="prompt">❯</span> waypoint trace torvalds</div>
            <div className="demo-line t-dim">  resolving user · reading public events · aggregating pull requests</div>
            <div className="demo-line"> </div>
            <div className="demo-line"><span className="t-dim">  PRs opened   </span><span className="t-white">1,204</span></div>
            <div className="demo-line"><span className="t-dim">  merge rate   </span><span className="t-green">92%</span></div>
            <div className="demo-line"><span className="t-dim">  avg to merge </span><span className="t-yellow">2.4d</span></div>
            <div className="demo-line"> </div>
            <div className="demo-line"><span className="t-dim">  →</span> most active in torvalds/linux <span className="t-dim">· 838 PRs</span></div>
            <div className="demo-line t-green">✓ trace complete</div>
          </TerminalWindow>
        </Reveal>
      </section>

      <div className="hatch" />

      {/* ---------------- the problem ---------------- */}
      <section className="sec pad-top-lg" id="how">
        <div className="frame">
          <div className="col">
            <Reveal className="sec-head">
              <div className="sec-eyebrow"><span className="ic">◆</span> <span className="lbl">the problem</span></div>
              <h2>A GitHub profile hides more than it shows.</h2>
              <p>Waypoint reads the same public data you can, then does the aggregation GitHub never surfaces.</p>
            </Reveal>
          </div>
          <div className="cell-grid cols-3">
            {problems.map((p, i) => (
              <Reveal className="tri-card" key={p.t} delay={i * 0.08}>
                <div className="tri-illus">{p.icon}</div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hatch" />

      {/* ---------------- visibility split ---------------- */}
      <section className="sec gray">
        <div className="frame">
          <div className="col">
            <div className="split">
              <Reveal className="split-text">
                <h2>One search. Every contribution. Full visibility.</h2>
                <p>Waypoint separates a developer’s pull requests by outcome, so the real merge rate is right there instead of buried in a list.</p>
                <ul className="checklist">
                  <li><span className="check-dot green" /> Merged pull requests, counted and rated</li>
                  <li><span className="check-dot blue" /> Open work in flight right now</li>
                  <li><span className="check-dot red" /> Closed without merge, so the rate is honest</li>
                </ul>
              </Reveal>
              <Reveal className="split-window" delay={0.1} y={22}>
                <TerminalWindow title="vercel/next.js — pull requests">
                  <div className="demo-line"><span className="t-green">● merged</span>  fix: hydration mismatch on stream</div>
                  <div className="demo-line"><span className="t-yellow">● open</span>    feat: partial prerendering flag</div>
                  <div className="demo-line"><span className="t-green">● merged</span>  docs: clarify cache semantics</div>
                  <div className="demo-line"><span className="t-red">● closed</span>  chore: bump internal dep</div>
                  <div className="demo-line"> </div>
                  <div className="demo-line t-dim">merge rate <span className="t-white">81%</span> · avg <span className="t-white">1.9d</span> to merge</div>
                </TerminalWindow>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- trace-anything chip strip ---------------- */}
      <section className="sec" style={{ paddingBlock: '0' }}>
        <div className="frame">
          <Reveal>
            <div className="chip-strip">
              <span className="strip-label">// trace anyone on GitHub</span>
              <div className="logos-strip">
                {traceTargets.map(x => (
                  <span className="logo-chip" key={x}>{x}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="hatch" />

      {/* ---------------- what waypoint does ---------------- */}
      <section className="sec gray">
        <div className="frame">
          <div className="col">
            <div className="split">
              <Reveal className="split-window" y={22}>
                <TerminalWindow title="torvalds — repository trail">
                  <div className="demo-line"><span className="prompt">❯</span> waypoint trace torvalds --repos</div>
                  <div className="demo-line"> </div>
                  <div className="demo-line"><span className="t-dim">  →</span> torvalds/linux       <span className="t-dim">838 PRs · </span><span className="t-green">96% merged</span></div>
                  <div className="demo-line"><span className="t-dim">  →</span> torvalds/subsurface  <span className="t-dim">142 PRs · </span><span className="t-green">88% merged</span></div>
                  <div className="demo-line"><span className="t-dim">  →</span> torvalds/test-tlb    <span className="t-dim">  9 PRs · </span><span className="t-green">100% merged</span></div>
                  <div className="demo-line"> </div>
                  <div className="demo-line t-dim">ranked by where real effort lands</div>
                </TerminalWindow>
              </Reveal>
              <Reveal className="split-text" delay={0.1}>
                <h2>What Waypoint actually does.</h2>
                <p>Point it at a name and it does the reading, the counting, and the ranking for you in one pass.</p>
                <ul className="checklist">
                  <li><span className="check-dot blue" /> Aggregate lifetime PRs across every public repo</li>
                  <li><span className="check-dot blue" /> Compute merge rate and average days to merge</li>
                  <li><span className="check-dot blue" /> Rank the repositories where effort truly lands</li>
                  <li><span className="check-dot blue" /> Surface an org’s active repos and likely maintainers</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <div className="hatch" />

      {/* ---------------- feature grid ---------------- */}
      <section className="sec" id="features">
        <div className="frame">
          <div className="col">
            <Reveal className="sec-head">
              <div className="sec-eyebrow"><span className="ic">✦</span> <span className="lbl">why waypoint</span></div>
              <h2>Signal, not just a profile page.</h2>
              <p>Four views over the same public data, each one answering a question GitHub leaves open.</p>
            </Reveal>
          </div>
          <div className="cell-grid cols-2">
            {features.map((f, i) => (
              <Reveal className="feat2" key={f.t} delay={i * 0.07}>
                <span className="ic" style={{ background: f.bg, color: f.color }} aria-hidden="true">{f.icon}</span>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
                <code className="code-chip"><span className="tok">❯</span> {f.code}</code>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hatch" />

      {/* ---------------- small things ---------------- */}
      <section className="sec gray">
        <div className="frame">
          <div className="col">
            <Reveal className="sec-head">
              <div className="sec-eyebrow"><span className="ic">◇</span> <span className="lbl">quality of life</span></div>
              <h2>Small things that add up.</h2>
              <p>Details you will appreciate every trace.</p>
            </Reveal>
          </div>
          <div className="cell-grid cols-4">
            {minis.map((m, i) => (
              <Reveal className="mini" key={m.t} delay={(i % 4) * 0.06}>
                <span className="ic" aria-hidden="true">{m.icon}</span>
                <h4>{m.t}</h4>
                <p>{m.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="hatch" />

      {/* ---------------- faq ---------------- */}
      <section className="sec" id="faq">
        <div className="frame gutter-hatch">
          <div className="col">
            <Reveal className="sec-head">
              <div className="sec-eyebrow"><span className="ic">?</span> <span className="lbl">questions</span></div>
              <h2>Frequently asked.</h2>
            </Reveal>
            <div className="cell-grid cols-2">
              {faqs.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 0.05}>
                  <details className="faq-cell">
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- closing CTA ---------------- */}
      <section className="cta-band">
        <h2>See where they <span className="dim">actually</span> spend their time.</h2>
        <p>No login. No setup. Point Waypoint at any GitHub user, org, or repo and read the real story.</p>
        <div className="cta-actions">
          <a className="btn btn-primary" href="/#top">Start tracing</a>
          <a className="btn btn-ghost" href="https://github.com/iammdzaidalam/waypoint" target="_blank" rel="noopener noreferrer">View source</a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
