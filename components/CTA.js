'use client';

import { useEffect, useRef, useState } from 'react';

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* SVG fractal noise — gives the subtle grain texture at 0.025 opacity */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function CTA() {
  const [ref, visible] = useReveal(0.15);
  const [btnHov, setBtnHov] = useState(false);

  return (
    <section
      id="cta"
      style={{
        position:       'relative',
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--emerald)',
        overflow:       'hidden',
      }}
    >
      {/* Radial gradient spotlight */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'radial-gradient(ellipse at 50% 40%, rgba(13,60,30,0.55) 0%, transparent 60%)',
          zIndex:     0,
          pointerEvents: 'none',
        }}
      />

      {/* Grain texture overlay */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          backgroundImage: GRAIN_URL,
          backgroundRepeat:'repeat',
          backgroundSize:  '256px 256px',
          opacity:         0.025,
          zIndex:          0,
          pointerEvents:   'none',
          mixBlendMode:    'overlay',
        }}
      />

      {/* Content */}
      <div
        ref={ref}
        style={{
          position:       'relative',
          zIndex:         1,
          maxWidth:       '660px',
          padding:        '80px 56px',
          textAlign:      'center',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '0',
          opacity:        visible ? 1 : 0,
          transform:      visible ? 'translateY(0)' : 'translateY(28px)',
          transition:     'opacity 1s ease, transform 1s ease',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '0.58rem',
            fontWeight:    300,
            letterSpacing: '0.52em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
            marginBottom:  '2.2rem',
          }}
        >
          The Invitation
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily:   "'Cormorant Garamond', serif",
            fontStyle:    'italic',
            fontSize:     'clamp(44px, 7vw, 92px)',
            fontWeight:   300,
            lineHeight:   1.05,
            color:        'var(--ivory)',
            margin:       0,
            marginBottom: '1.6rem',
          }}
        >
          Your story deserves this.
        </h2>

        {/* Body */}
        <p
          style={{
            fontFamily:   "'Montserrat', sans-serif",
            fontSize:     '11px',
            fontWeight:   200,
            lineHeight:   1.95,
            color:        'var(--ivory)',
            opacity:      0.36,
            maxWidth:     '400px',
            marginBottom: '0',
          }}
        >
          We accept a limited number of commissions each year. Each one receives
          our complete creative devotion.
        </p>

        {/* Gold divider line */}
        <div
          style={{
            width:      '52px',
            height:     '1px',
            background: 'var(--gold)',
            opacity:    0.42,
            margin:     '34px auto',
          }}
        />

        {/* CTA button */}
        <a
          href="mailto:hello@vsstudio.in"
          className="hov"
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            display:        'inline-block',
            background:     btnHov ? 'var(--ivory)' : 'var(--gold)',
            color:          'var(--black)',
            fontFamily:     "'Montserrat', sans-serif",
            fontSize:       '9px',
            fontWeight:     500,
            letterSpacing:  btnHov ? '0.62em' : '0.52em',
            textTransform:  'uppercase',
            textDecoration: 'none',
            padding:        '18px 52px',
            transition:     'background 0.4s ease, letter-spacing 0.4s ease',
            marginBottom:   '24px',
          }}
        >
          Begin Your Experience
        </a>

        {/* Availability note */}
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '8px',
            fontWeight:    200,
            letterSpacing: '0.18em',
            color:         'var(--ivory)',
            opacity:       0.2,
          }}
        >
          Limited availability — 2025 &amp; 2026
        </p>
      </div>
    </section>
  );
}
