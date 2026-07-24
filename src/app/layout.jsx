import './globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import NavBar from '../components/NavBar';
import SiteFooter from '../components/SiteFooter';

// Matter — the sans for all UI + headings. Variable upright cuts (wght 100–1000).
// To swap in a different Matter file later, replace the path below; nothing else changes.
const matter = localFont({
  src: [{ path: '../../public/fonts/MatterUprights-VF.woff2', weight: '100 1000', style: 'normal' }],
  variable: '--font-matter',
  display: 'swap',
});

// Matter SemiMono — the mono for labels, code chips, and data (static Regular).
const matterMono = localFont({
  src: [{ path: '../../public/fonts/MatterSemiMonoRegular.woff2', weight: '400', style: 'normal' }],
  variable: '--font-matter-mono',
  display: 'swap',
});

const siteUrl = 'https://github-waypoint.vercel.app';
const title = 'GitHub Waypoint · Find where they actually spend their time on GitHub';
const description = 'Trace a GitHub user, org, or repo to see real contribution activity: merge rates, review speed, top contributors, and recent pull requests and issues.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s · Waypoint',
  },
  description,
  keywords: [
    'github-waypoint.vercel.app',
    'waypoint github',
    'github waypoint',
    'github activity tracker',
    'github contribution analytics',
    'pull request analytics',
    'open source contributor tracker',
    'github pr merge rate',
    'github repo analytics',
  ],
  authors: [{ name: 'iammdzaidalam', url: 'https://github.com/iammdzaidalam' }],
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'GitHub Waypoint',
  alternateName: ['waypoint github', 'github-waypoint.vercel.app'],
  url: siteUrl,
  description,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

// WebSite schema: tells Google the canonical site name for "waypoint" queries
// and makes trace URLs eligible for the sitelinks search box.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GitHub Waypoint',
  alternateName: ['Waypoint', 'waypoint github'],
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/{search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${matter.variable} ${matterMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
        <NavBar />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
