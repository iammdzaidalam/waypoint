const siteUrl = 'https://github-waypoint.vercel.app';

// Curated high-traffic traces: each page emits unique metadata via
// generateMetadata, giving crawlers long-tail entry points like
// "next.js pull request analytics". Keep this list small and real.
const popularTraces = [
  'vercel/next.js',
  'facebook/react',
  'microsoft/vscode',
  'kubernetes/kubernetes',
  'rust-lang/rust',
  'nodejs/node',
  'tailwindlabs/tailwindcss',
  'jaegertracing/jaeger',
  'torvalds',
  'sindresorhus',
  'vercel',
  'microsoft',
];

// Stable date (bumped on meaningful releases). A per-request `new Date()`
// tells crawlers the page changed on every fetch, which erodes trust.
const lastModified = new Date('2026-07-12');

export default function sitemap() {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...popularTraces.map(path => ({
      url: `${siteUrl}/${path}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  ];
}
