'use client';

import { useEffect, useRef, useState } from 'react';

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function Story() {
  const [leftRef,  leftVisible]  = useReveal(0.15);
  const [rightRef, rightVisible] = useReveal(0.15);

  return (
    <section
      id="story"
      style={{
        display:       'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight:     '100vh',
      }}
    >
      {/* ── Left — image panel ─────────────────────────────────────────── */}
      <div
        ref={leftRef}
        style={{
          position:   'relative',
          overflow:   'hidden',
          opacity:    leftVisible ? 1 : 0,
          transform:  leftVisible ? 'translateX(0)' : 'translateX(-40px)',
          transition: 'opacity 1.1s ease, transform 1.1s ease',
        }}
      >
        {/* Photo */}
        <img
          src="https://res.cloudinary.com/drn6x6hbd/image/upload/story"
          alt="VS Studio — The Philosophy"
          style={{
            display:    'block',
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: 'center',
            filter:     'brightness(0.72) saturate(0.82)',
          }}
        />

        {/* Right-edge gradient blending into the right column background */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg, transparent 62%, var(--black2) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Thin vertical gold separator line */}
        <div
          style={{
            position:   'absolute',
            top:        '15%',
            bottom:     '15%',
            right:      0,
            width:      '1px',
            background: 'linear-gradient(180deg, transparent 0%, #c9a84c 30%, #c9a84c 70%, transparent 100%)',
            opacity:    0.22,
            pointerEvents: 'none',
          }}
        />

        {/* Vertical text label — bottom left */}
        <p
          style={{
            position:      'absolute',
            bottom:        '2.5rem',
            left:          '1.5rem',
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '7px',
            fontWeight:    300,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
            opacity:       0.4,
            writingMode:   'vertical-rl',
            transform:     'rotate(180deg)',
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        >
          VS Studio — The Philosophy
        </p>
      </div>

      {/* ── Right — text panel ─────────────────────────────────────────── */}
      <div
        ref={rightRef}
        style={{
          background:     'var(--emerald)',
          padding:        '110px 64px',
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          gap:            '2.4rem',
          opacity:        rightVisible ? 1 : 0,
          transform:      rightVisible ? 'translateX(0)' : 'translateX(40px)',
          transition:     'opacity 1.1s ease 0.15s, transform 1.1s ease 0.15s',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '0.6rem',
            fontWeight:    300,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
          }}
        >
          05 — Our Story
        </p>

        {/* Blockquote headline */}
        <blockquote
          style={{
            margin:      0,
            padding:     0,
            fontFamily:  "'Cormorant Garamond', serif",
            fontStyle:   'italic',
            fontSize:    'clamp(1.7rem, 2.6vw, 2.6rem)',
            fontWeight:  300,
            lineHeight:  1.3,
            color:       'var(--ivory)',
          }}
        >
          "We believe that{' '}
          <em style={{ color: 'var(--gold)', fontStyle: 'inherit' }}>love</em>
          {' '}is the most cinematic subject in the world."
        </blockquote>

        {/* Body */}
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize:   'clamp(0.78rem, 1vw, 0.88rem)',
            fontWeight: 200,
            lineHeight: 2,
            color:      'var(--ivory)',
            opacity:    0.72,
            maxWidth:   '480px',
          }}
        >
          VS Studio was built on a single conviction: wedding photography should
          feel like a fashion campaign and a film in equal measure. We work with
          couples who understand that the way their story is told is as important
          as the story itself. We travel. We compose. We wait for the light. We
          capture what is real and render it extraordinary.
        </p>

        {/* Signature */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle:  'italic',
            fontSize:   '20px',
            fontWeight: 300,
            color:      'var(--gold)',
          }}
        >
          — VS Studio
        </p>
      </div>
    </section>
  );
}
