import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Waypoint — find where they actually spend their time on GitHub',
  description: 'Point it at a person, an org, or a repo like jaegertracing/jaeger.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var savedTheme = localStorage.getItem('waypoint_theme') || 'dark';
                document.documentElement.setAttribute('data-theme', savedTheme);
              } catch (e) {}
            })();
          `}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
