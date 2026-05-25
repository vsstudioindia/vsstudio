'use client';

import { useEffect, useRef, useState } from 'react';

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* threshold 0 fires as soon as one pixel enters the viewport */
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        position:   'relative',
        zIndex:     2,
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Statement() {
  useEffect(() => {
    console.log('[Statement] mounted');
  }, []);

  return (
    <section
      id="founders"
      style={{
        position:       'relative',
        width:          '100%',
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
      }}
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center',
          filter:         'brightness(0.35)',
          zIndex:         0,
        }}
      >
        <source src="https://res.cloudinary.com/drn6x6hbd/video/upload/story" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          bottom:     0,
          width:      '100%',
          height:     '100%',
          background: 'rgba(6,6,6,0.45)',
          zIndex:     1,
        }}
      />

      {/* Text content */}
      <div
        style={{
          position:       'relative',
          zIndex:         2,
          textAlign:      'center',
          padding:        '0 clamp(1.5rem, 8vw, 8rem)',
          maxWidth:       '860px',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
        }}
      >
        <Reveal delay={0}>
          <p
            style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontSize:      '0.6rem',
              fontWeight:    300,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
              marginBottom:  '2.8rem',
            }}
          >
            Our Philosophy
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p
            style={{
              fontFamily:   "'Cormorant Garamond', serif",
              fontStyle:    'italic',
              fontSize:     'clamp(2.4rem, 5.5vw, 5rem)',
              fontWeight:   300,
              lineHeight:   1.15,
              color:        'var(--ivory)',
              marginBottom: '0.15em',
            }}
          >
            We don't take photographs.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <p
            style={{
              fontFamily:   "'Cormorant Garamond', serif",
              fontStyle:    'italic',
              fontSize:     'clamp(2.4rem, 5.5vw, 5rem)',
              fontWeight:   300,
              lineHeight:   1.15,
              color:        'var(--gold)',
              marginBottom: '0',
            }}
          >
            We craft cinema.
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div
            style={{
              width:      '1px',
              height:     '72px',
              background: 'var(--gold)',
              margin:     '44px auto',
              opacity:    0.55,
            }}
          />
        </Reveal>

        <Reveal delay={420}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize:   'clamp(0.78rem, 1.1vw, 0.9rem)',
              fontWeight: 200,
              lineHeight: 2,
              color:      'var(--ivory)',
              opacity:    0.72,
              maxWidth:   '540px',
            }}
          >
            Every frame composed with the precision of a fashion director and the
            soul of a storyteller. Your love story is the most important film we
            will ever make.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
