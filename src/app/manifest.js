export default function manifest() {
  return {
    name: 'Waypoint — GitHub Activity Tracer',
    short_name: 'Waypoint',
    description: 'Trace a GitHub user, org, or repo to see real contribution activity.',
    start_url: '/',
    display: 'standalone',
    background_color: '#efede7',
    theme_color: '#efede7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
