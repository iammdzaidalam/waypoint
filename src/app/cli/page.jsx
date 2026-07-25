import CliHero from '../../components/cli/CliHero';
import { Interactive, Commands, Perks, Flags } from '../../components/cli/CliSections';
import { CliFaq, CliClosingCta } from '../../components/cli/CliFaq';
import { faqJsonLd, INSTALL, REPO_URL } from '../../content/cli';

const siteUrl = 'https://github-waypoint.vercel.app';
const title = 'Waypoint CLI · Trace GitHub activity from your terminal';
const description =
  'The Waypoint GitHub activity tracer as a command-line tool. Trace a user, org, or repo for pull requests, merge rates, and contribution trails, with one command. Node, zero dependencies.';

export const metadata = {
  title,
  description,
  keywords: [
    'github cli',
    'github activity cli',
    'pull request analytics cli',
    'waypoint cli',
    'github contributions terminal',
    'gh merge rate command line',
  ],
  alternates: { canonical: `${siteUrl}/cli` },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/cli`,
    siteName: 'Waypoint',
    title,
    description,
  },
  twitter: { card: 'summary_large_image', title, description },
};

// SoftwareApplication schema so the CLI is eligible for its own rich result
// rather than inheriting the web app's.
const appJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Waypoint CLI',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows',
  description,
  url: `${siteUrl}/cli`,
  softwareHelp: REPO_URL,
  installUrl: REPO_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function CliPage() {
  return (
    <>
      <CliHero />
      <Interactive />
      <Commands />
      <Perks />
      <Flags />
      <CliFaq />
      <CliClosingCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([appJsonLd, faqJsonLd]) }}
      />
    </>
  );
}
