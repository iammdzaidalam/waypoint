import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import AppChrome from '../components/AppChrome';
import AsciiField from '../components/AsciiField';

// Geist Pixel by Vercel, vendored from the `geist` npm package (SIL OFL).
// The Circle variant reads as LED dot lettering.
const geistPixel = localFont({
  src: './fonts/GeistPixel-Circle.woff2',
  weight: '500',
  style: 'normal',
  variable: '--font-geist-pixel',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const siteUrl = 'https://github-waypoint.vercel.app';
const title = 'Waypoint · Find where they actually spend their time on GitHub';
const description = 'Trace a GitHub user, org, or repo to see real contribution activity: merge rates, review speed, top contributors, and recent pull requests and issues.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s · Waypoint',
  },
  description,
  keywords: [
    'github activity tracker',
    'github contribution analytics',
    'pull request analytics',
    'open source contributor tracker',
    'github pr merge rate',
    'github repo analytics',
  ],
  authors: [{ name: 'iammdzaidalam', url: 'https://github.com/iammdzaidalam' }],
  creator: 'iammdzaidalam',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Waypoint',
    title,
    description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Waypoint' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efede7' },
    { media: '(prefers-color-scheme: dark)', color: '#09090c' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Waypoint',
  url: siteUrl,
  description,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} ${geistPixel.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var savedTheme = localStorage.getItem('waypoint_theme') || 'light';
                document.documentElement.setAttribute('data-theme', savedTheme);
              } catch (e) {}
            })();
          `}
        </Script>
        <AsciiField />
        <AppChrome />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
