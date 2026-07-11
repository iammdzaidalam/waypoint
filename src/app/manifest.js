export default function manifest() {
  return {
    name: 'Waypoint — GitHub Activity Tracer',
    short_name: 'Waypoint',
    description: 'Trace a GitHub user, org, or repo to see real contribution activity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f5',
    theme_color: '#faf9f5',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
