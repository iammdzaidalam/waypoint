import { permanentRedirect } from 'next/navigation';
import { buildTracePath } from '../lib/utils';
import { faqJsonLd } from '../content/home';

import Hero from '../components/home/Hero';
import Problem from '../components/home/Problem';
import { VisibilitySplit, WhatItDoes } from '../components/home/Splits';
import { ChipStrip, Features, SmallThings } from '../components/home/Features';
import { Faq, ClosingCta } from '../components/home/Faq';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const legacyQuery = params?.repo || params?.user || params?.org || params?.q;
  if (legacyQuery) {
    permanentRedirect(buildTracePath(legacyQuery));
  }

  return (
    <>
      <Hero />
      <Problem />
      <VisibilitySplit />
      <ChipStrip />
      <WhatItDoes />
      <Features />
      <SmallThings />
      <Faq />
      <ClosingCta />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
