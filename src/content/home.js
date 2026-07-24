// Copy and data for the landing page. Kept out of the components so the
// wording can be edited without reading any JSX.

export const faqs = [
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

export const problems = [
  { icon: '✦', t: 'Stars are not signal', d: 'Star counts and follower numbers say nothing about who actually keeps a project alive day to day.' },
  { icon: '⑃', t: 'Work is scattered', d: 'A developer’s real effort is spread across dozens of repos, issues, and pull requests you never see in one place.' },
  { icon: '◔', t: 'Merge rates are buried', d: 'Whether a repo truly ships community PRs stays invisible until you dig through every pull request by hand.' },
];

export const features = [
  { icon: '◷', bg: 'var(--accent-soft)', color: 'var(--accent)', t: 'Lifetime PR analytics', d: 'Every pull request a developer has opened, how many merged, and their true merge rate across their whole public history.', code: 'waypoint trace torvalds --prs' },
  { icon: '⚡', bg: 'rgba(22,163,74,0.14)', color: '#16a34a', t: 'Merge rate & review speed', d: 'For any repo: merge rate on decided PRs, average days to merge, and how fast the community actually ships.', code: 'waypoint trace vercel/next.js' },
  { icon: '⌖', bg: 'rgba(220,38,38,0.12)', color: '#dc2626', t: 'Find the real maintainers', d: 'Search an org and Waypoint surfaces its most active repos and the people who genuinely keep them moving.', code: 'waypoint trace vercel --org' },
  { icon: '⇲', bg: 'rgba(147,51,234,0.14)', color: '#9333ea', t: 'Contribution trails', d: 'Follow a developer across repositories, issues, and PRs, ranked by where they put in real, sustained effort.', code: 'waypoint trace sindresorhus' },
];

export const minis = [
  { icon: '⏻', t: 'No login required', d: 'Open the site and trace. Nothing to sign up for.' },
  { icon: '⚿', t: 'Bring your own token', d: 'Optional PAT lifts the rate limit to 5,000 requests an hour.' },
  { icon: '◉', t: 'Live GitHub data', d: 'Every trace reads straight from the official GitHub API.' },
  { icon: '⧉', t: 'Users, orgs & repos', d: 'One search box handles all three kinds of target.' },
  { icon: '↧', t: 'Export CSV / JSON', d: 'Pull any repo’s pull request data out for your own analysis.' },
  { icon: '◐', t: 'Light & dark', d: 'A calm light theme and a full dark theme, your choice.' },
  { icon: '⌘', t: 'Open source', d: 'MIT licensed and self-hostable from the GitHub repo.' },
  { icon: '↗', t: 'Shareable URLs', d: 'Every trace is a plain, linkable, indexable route.' },
];

export const traceTargets = [
  'torvalds', 'vercel', 'facebook/react', 'rust-lang', 'sindresorhus',
  'kubernetes', 'django', 'sveltejs', 'tailwindlabs',
];

export const REPO_URL = 'https://github.com/iammdzaidalam/waypoint';

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};
