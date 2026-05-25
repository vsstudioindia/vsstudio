'use client';

import { useState } from 'react';
import Cursor    from '@/components/Cursor';
import Intro     from '@/components/Intro';
import Nav       from '@/components/Nav';
import Hero      from '@/components/Hero';
import Statement from '@/components/Statement';
import Sphere       from '@/components/Sphere';
import RecordPlayer from '@/components/RecordPlayer';
import Story        from '@/components/Story';
import Founders  from '@/components/Founders';
import Canon     from '@/components/Canon';
import Team      from '@/components/Team';
import WhyUs     from '@/components/WhyUs';
import CTA       from '@/components/CTA';
import Footer    from '@/components/Footer';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <Cursor />

      {!introComplete && <Intro onComplete={() => setIntroComplete(true)} />}

      {introComplete && (
        <>
          <Nav />
          <main>
            <Hero />
            <Statement />
            <Sphere />
            <RecordPlayer />
            <Story />
            <Founders />
            <Canon />
            <Team />
            <WhyUs />
            <CTA />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
