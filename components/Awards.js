'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

const LOGOS = [
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1780633150/Canon.png',
    alt: 'Canon',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747104/weddingsutra.png',
    alt: 'WeddingSutra',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747270/wow-logo.png',
    alt: 'WOW Awards',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747399/iwpoty.png',
    alt: 'IWPOTY',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747485/wpe-awards.png',
    alt: 'WPE Awards',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747559/This-is-reportage.png',
    alt: 'This is Reportage',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747660/wedisson_award.png',
    alt: 'Wedisson Award',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747659/wedwar-awards.png',
    alt: 'Wedwar Awards',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779747902/spotlight.png',
    alt: 'Spotlight',
  },
  {
    src: 'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_250,c_limit/v1779748016/fearless.png',
    alt: 'Fearless Photographers',
  },
];

/* Duplicate for seamless desktop loop */
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS];

function LogoItem({ src, alt }) {
  const [hov, setHov] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: '48px',
        width: 'auto',
        flexShrink: 0,
        filter: hov
          ? 'invert(1) grayscale(0%) opacity(1)'
          : 'invert(1) grayscale(100%) opacity(0.4)',
        transition: 'filter 0.4s ease',
        cursor: 'default',
        userSelect: 'none',
      }}
    />
  );
}

export default function Awards() {
  const isMobile = useMobile();

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    /* Don't initialise the desktop ticker on mobile */
    if (isMobile) return;

    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sec);

    return () => observer.disconnect();
  }, [isMobile]);

  /* Completely remove Awards from mobile */
  if (isMobile) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes awardsScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <section
        id="awards"
        ref={sectionRef}
        style={{
          display: 'block',
          background: '#060606',
          padding: '100px 0 110px',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0)'
            : 'translateY(20px)',
          transition:
            'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 56px 56px' }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '25px',
              fontWeight: 200,
              margin: 0,
            }}
          >
            <span style={{ color: '#f0ead8' }}>
              As{' '}
            </span>

            <span style={{ color: '#c9a84c' }}>
              Recognised
            </span>

            <span style={{ color: '#f0ead8' }}>
              {' '}By.
            </span>
          </h2>
        </div>

        {/* Scroll track */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '64px',
              width: 'max-content',
              animation:
                'awardsScroll 30s linear infinite',
              animationPlayState: paused
                ? 'paused'
                : 'running',
            }}
          >
            {LOGOS_DOUBLED.map((logo, i) => (
              <LogoItem
                key={i}
                src={logo.src}
                alt={logo.alt}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
