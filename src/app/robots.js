export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://github-waypoint.vercel.app/sitemap.xml',
  };
}
