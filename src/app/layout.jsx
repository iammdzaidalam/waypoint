import './globals.css';

export const metadata = {
  title: 'Waypoint — find where they actually spend their time on GitHub',
  description: 'Point it at a person, an org, or a repo like jaegertracing/jaeger.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
