'use client';

import { useEffect, useRef, useState } from 'react';

const FILMS = [
  {
    src:     '/images/film1.jpg',
    caption: 'Pre-Wedding Film — Vietnam',
    title:   'Golden Bridge',
    href:    'https://youtu.be/SauwDq7GAuI',
    ratio:   '3/4.2',
    marginTop: 0,
  },
  {
    src:     '/images/film2.jpg',
    caption: 'Pre-Wedding Film — Bangkok',
    title:   'Bangkok After Dark',
    href:    'https://youtu.be/rSeB8wjhEF8',
    ratio:   '3/4.8',
    marginTop: 72,
  },
  {
    src:     '/images/film3.jpg',
    caption: 'Wedding Film — 2024',
    title:   'Golden Hour',
    href:    'https://youtu.be/Q0KLAqOCQKU',
    ratio:   '3/4.4',
    marginTop: 36,
  },
];

/* Scroll-reveal hook — fires once when element enters viewport */
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

/* Individual film card */
function FilmCard({ film, revealDelay }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal();

  return (
    <a
      ref={ref}
      href={film.href}
      target="_blank"
      rel="noopener noreferrer"
      className="hov"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'block',
        position:        'relative',
        aspectRatio:     film.ratio,
        marginTop:       `${film.marginTop}px`,
        overflow:        'hidden',
        textDecoration:  'none',
        cursor:          'none',
        /* scroll reveal */
        opacity:         visible ? 1 : 0,
        transform:       visible ? 'translateY(0)' : 'translateY(40px)',
        transition:      `opacity 0.9s ease ${revealDelay}ms, transform 0.9s ease ${revealDelay}ms`,
      }}
    >
      {/* Background image */}
      <div
        style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    `url(${film.src})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          transform:          hovered ? 'scale(1.04)' : 'scale(1)',
          transition:         'transform 0.7s ease',
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(6,6,6,0.82) 0%, rgba(6,6,6,0.15) 55%, rgba(6,6,6,0.45) 100%)',
          zIndex:     1,
        }}
      />

      {/* Letterbox bar — top */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     hovered ? 0 : '28px',
          background: 'var(--black)',
          transition: 'height 0.55s ease',
          zIndex:     2,
        }}
      />

      {/* Letterbox bar — bottom */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     hovered ? 0 : '28px',
          background: 'var(--black)',
          transition: 'height 0.55s ease',
          zIndex:     2,
        }}
      />

      {/* Play button — centered */}
      <div
        style={{
          position:       'absolute',
          top:            '50%',
          left:           '50%',
          transform:      'translate(-50%, -50%)',
          width:          '44px',
          height:         '44px',
          border:         '1px solid var(--gold)',
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          zIndex:         3,
          opacity:        hovered ? 1 : 0.65,
          transition:     'opacity 0.3s ease, transform 0.3s ease',
          /* slight scale-up on hover */
          ...(hovered ? { transform: 'translate(-50%, -50%) scale(1.12)' } : {}),
        }}
      >
        {/* Triangle */}
        <div
          style={{
            width:       0,
            height:      0,
            borderTop:   '7px solid transparent',
            borderBottom:'7px solid transparent',
            borderLeft:  '11px solid var(--gold)',
            marginLeft:  '3px', /* optical centering */
          }}
        />
      </div>

      {/* Text content — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom:   '22px',
          left:     '20px',
          right:    '20px',
          zIndex:   3,
        }}
      >
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '0.58rem',
            fontWeight:    300,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
            marginBottom:  '6px',
          }}
        >
          {film.caption}
        </p>
        <p
          style={{
            fontFamily:  "'Cormorant Garamond', serif",
            fontStyle:   'italic',
            fontSize:    'clamp(1.2rem, 2vw, 1.6rem)',
            fontWeight:  300,
            color:       'var(--ivory)',
            lineHeight:  1.2,
          }}
        >
          {film.title}
        </p>

        {/* Progress line */}
        <div style={{ marginTop: '12px', height: '1px', background: 'rgba(201,168,76,0.2)' }}>
          <div
            style={{
              height:     '1px',
              background: 'var(--gold)',
              width:      hovered ? '65%' : '0%',
              transition: hovered ? 'width 3s ease' : 'width 0.4s ease',
            }}
          />
        </div>
      </div>
    </a>
  );
}

export default function Films() {
  const [headerRef, headerVisible] = useReveal(0.3);

  return (
    <section
      id="films"
      style={{
        background: 'var(--black2)',
        padding:    'clamp(5rem, 10vw, 9rem) clamp(1.5rem, 6vw, 6rem)',
        paddingBottom: 'clamp(7rem, 12vw, 11rem)',
      }}
    >
      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'flex-end',
          marginBottom:   'clamp(3rem, 6vw, 5rem)',
          opacity:        headerVisible ? 1 : 0,
          transform:      headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition:     'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <h2
          style={{
            fontFamily:  "'Cormorant Garamond', serif",
            fontSize:    'clamp(1.8rem, 3.5vw, 3rem)',
            fontWeight:  400,
            color:       'var(--ivory)',
            lineHeight:  1.1,
          }}
        >
          Cinematic Wedding Films
        </h2>
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '0.6rem',
            fontWeight:    300,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
            opacity:       0.6,
          }}
        >
          03 — Moving Image
        </p>
      </div>

      {/* Film cards grid */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1.4fr 0.85fr 1.05fr',
          gap:                 'clamp(1rem, 2.5vw, 2rem)',
          alignItems:          'start',
        }}
      >
        {FILMS.map((film, i) => (
          <FilmCard key={film.title} film={film} revealDelay={i * 120} />
        ))}
      </div>
    </section>
  );
}
