'use client';

import { useEffect, useRef, useState } from 'react';

const lerp = (a, b, t) => a + (b - a) * t;

const PAR_X = 16;
const PAR_Y = 9;

const IMAGES = [
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/hero1',
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/v1779465741/gallery5.jpg',
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/hero2',
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/v1779465741/gallery1.jpg',
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/hero3',
  'https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_1920,c_limit/v1780638816/hero4.jpg',
];

export default function Hero() {
  const [open,        setOpen]        = useState(false);
  const [textVis,     setTextVis]     = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* One ref per image div so parallax can target only the active one */
  const imgRefs = useRef([null, null, null, null, null, null]);

  const parX    = useRef(0);
  const parY    = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafId   = useRef(null);

  /* Curtain reveal — runs once on mount */
  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true),    80);
    const t2 = setTimeout(() => setTextVis(true), 1450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Slideshow — advance active index every 6 seconds */
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  /* Mouse parallax — disabled on mobile (touch devices have no mousemove) */
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const onMove = (e) => {
      targetX.current = ((e.clientX / window.innerWidth)  * 2 - 1) * PAR_X;
      targetY.current = ((e.clientY / window.innerHeight) * 2 - 1) * PAR_Y;
    };

    const tick = () => {
      parX.current = lerp(parX.current, targetX.current, 0.06);
      parY.current = lerp(parY.current, targetY.current, 0.06);
      const el = imgRefs.current[activeIndex];
      if (el) {
        el.style.transform =
          `scale(1.1) translate(${parX.current}px, ${parY.current}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, [activeIndex]); /* re-bind when active image changes so ref target updates */

  const curtainStyle = (side) => ({
    position:        'absolute',
    top:             0,
    [side]:          0,
    width:           '50%',
    height:          '100%',
    background:      'var(--black)',
    transformOrigin: side === 'left' ? 'left center' : 'right center',
    transform:       open ? 'scaleX(0)' : 'scaleX(1)',
    transition:      'transform 1.3s cubic-bezier(.76, 0, .24, 1)',
    zIndex:          3,
  });

  return (
    <section
      className="h-dvh"
      style={{
        position:   'relative',
        width:      '100%',
        overflow:   'hidden',
        background: 'var(--black)',
      }}
    >
      {/* ── Three image layers — always rendered, active one has opacity 1 ── */}
      {IMAGES.map((src, i) => (
        <div
          key={src}
          ref={(el) => { imgRefs.current[i] = el; }}
          style={{
            position:           'absolute',
            inset:              '-5%',
            backgroundImage:    `url(${src})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            transform:          'scale(1.1)',
            opacity:            i === activeIndex ? 1 : 0,
            transition:         'opacity 2s ease',
            zIndex:             1,
          }}
        />
      ))}

      {/* Dark gradient overlay for text legibility */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to right, rgba(6,6,6,0.72) 0%, rgba(6,6,6,0.2) 100%)',
          zIndex:     2,
        }}
      />

      {/* Left curtain */}
      <div style={curtainStyle('left')}  />
      {/* Right curtain */}
      <div style={curtainStyle('right')} />

      {/* Hero content */}
      <div
        className={`hero-con${textVis ? ' vis' : ''}`}
        style={{
          position:     'absolute',
          inset:        0,
          display:      'flex',
          alignItems:   'center',
          paddingLeft:  'clamp(1.5rem, 8vw, 9rem)',
          paddingRight: 'clamp(1.5rem, 8vw, 9rem)',
          zIndex:       4,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', maxWidth: '620px' }}>
          <p className="hero-eyb">Vrinda &amp; Shristi — Canon Wizards — 11 yrs+</p>

          <h1 className="hero-h">
            Love as{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Cinema.</em>
            <br />
            Your Story, Eternal.
          </h1>

          <p className="hero-sub">
            We craft intimate cinematic portraits of the love and emotions that will
            outlast every season. Bespoke. Unforgettable. Larger than life.
          </p>

          <a href="#films" className="btn-primary hov" style={{ alignSelf: 'flex-start' }}>
            View Our Films
          </a>
        </div>
      </div>
    </section>
  );
}
