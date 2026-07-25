// Copy and data for the CLI page. Mirrors content/home.js so the two pages
// read as one product. Everything here describes the real CLI in
// github.com/iammdzaidalam/waypoint-cli - keep it truthful to the binary.

export const INSTALL = 'npm install -g github:iammdzaidalam/waypoint-cli';

export const REPO_URL = 'https://github.com/iammdzaidalam/waypoint-cli';

// The three trace targets, shown as real invocations.
export const commands = [
  { icon: '◷', bg: 'var(--accent-soft)', color: 'var(--accent)', t: 'Trace a person', d: 'Lifetime pull requests, merge rate, the repositories they land in, and a recent activity trail.', code: 'waypoint torvalds' },
  { icon: '⚡', bg: 'rgba(22,163,74,0.14)', color: '#16a34a', t: 'Trace a repository', d: 'Merge rate on decided PRs, average days to merge, label distribution, and top contributors.', code: 'waypoint vercel/next.js' },
  { icon: '⌖', bg: 'rgba(220,38,38,0.12)', color: '#dc2626', t: 'Trace an organisation', d: 'Most recently active repos and the people who genuinely keep them moving.', code: 'waypoint vercel' },
  { icon: '⇲', bg: 'rgba(147,51,234,0.14)', color: '#9333ea', t: 'Pipe it anywhere', d: 'Machine-readable output for scripts, CI, and spreadsheets, with no prompt in the way.', code: 'waypoint vercel/next.js --json | jq' },
];

// Quality-of-life grid, one line each.
export const perks = [
  { icon: '⏻', t: 'Zero dependencies', d: 'Argument parsing, colour, and HTTP all from the Node standard library.' },
  { icon: '⚡', t: 'Cached traces are instant', d: 'A repeat trace makes no network calls and returns in under a tenth of a second.' },
  { icon: '◉', t: 'ETag revalidation', d: 'A 304 costs no rate limit, so repeated lookups are close to free.' },
  { icon: '⚿', t: 'Bring your own token', d: 'waypoint auth raises the limit from 60 to 5,000 requests an hour.' },
  { icon: '⧉', t: 'Users, orgs & repos', d: 'The target type is detected automatically. A slash means a repository.' },
  { icon: '↧', t: 'JSON & CSV', d: 'Pipe a summary straight into jq or a spreadsheet with --json or --csv.' },
  { icon: '◐', t: 'Clean when piped', d: 'Colour and progress go to a TTY only. NO_COLOR is honoured.' },
  { icon: '⌘', t: 'Interactive or one-shot', d: 'A terminal opens a session with a slash palette. Pipe it or add --json to print once and exit.' },
];

export const flags = [
  { flag: '--range 14|30|90|180|all', d: 'time window in days (default 90)' },
  { flag: '--branch <name>', d: 'repository traces only' },
  { flag: '--json / --csv', d: 'machine-readable output' },
  { flag: '--out <file>', d: 'write the export to a file' },
  { flag: '--no-cache', d: 'ignore the local cache' },
  { flag: '--no-color', d: 'disable colour' },
];

export const faqs = [
  {
    q: 'How do I install it?',
    a: 'Run npm install -g github:iammdzaidalam/waypoint-cli. It needs Node 20.12 or newer and pulls in no runtime dependencies. Then run waypoint from anywhere.',
  },
  {
    q: 'Do I need a token?',
    a: 'No. Unauthenticated GitHub allows 60 requests an hour and a trace spends around five, so you can use it straight away. Running waypoint auth stores a token and raises the limit to 5,000. No scopes are needed for public data, and the token is stored locally with 0600 permissions and never printed.',
  },
  {
    q: 'What is the interactive mode?',
    a: 'Running waypoint in a terminal opens a session, whether you run it bare or with a target. Bare shows a prompt; a target runs that trace first and leaves you in the session to run more. Press / for a command palette with auth, history, range, cache, and more. Output stays one-shot and scriptable when you pipe it or pass --json, --csv, or --out.',
  },
  {
    q: 'Does it show the same numbers as the website?',
    a: 'Yes. The CLI and the web app share the same analysis logic, including how merge rate is computed over decided pull requests rather than all of them, so the two agree.',
  },
  {
    q: 'Can I use it in CI or a script?',
    a: 'Yes. Pass --json or --csv for machine output, set GITHUB_TOKEN in the environment to authenticate without storing anything on disk, and rely on the exit codes: 0 success, 1 runtime failure, 2 usage error. Colour is suppressed automatically when the output is not a terminal.',
  },
];

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};
