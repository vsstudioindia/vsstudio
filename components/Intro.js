'use client';

import { useEffect, useRef, useState } from 'react';

/* Sequence:
   350 ms  → show "Love."
   2500 ms → show "Documented."
   4600 ms → show "Forever."
   6400 ms → show VS Studio logo mark
   7200 ms → fade out entire intro, call onComplete
*/
const WORDS = [
  { text: 'Love.',        delay: 350  },
  { text: 'Documented.',  delay: 2500 },
  { text: 'Forever.',     delay: 4600 },
];
const LOGO_DELAY    = 6400;
const EXIT_DELAY    = 7200;
const WORD_DURATION = 1800; /* ms each word is visible before it fades */

export default function Intro({ onComplete }) {
  const [activeWord, setActiveWord] = useState(null); /* index or null */
  const [showLogo,   setShowLogo]   = useState(false);
  const [exiting,    setExiting]    = useState(false);
  const timers = useRef([]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setExiting(true);
    setTimeout(onComplete, 600);
  };

  useEffect(() => {
    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };

    /* Show each word, then fade it after WORD_DURATION */
    WORDS.forEach((w, i) => {
      t(() => setActiveWord(i), w.delay);
      t(() => setActiveWord(null), w.delay + WORD_DURATION);
    });

    t(() => setShowLogo(true),  LOGO_DELAY);
    t(() => {
      setExiting(true);
      t(onComplete, 600); /* wait for CSS fade-out */
    }, EXIT_DELAY);

    return () => timers.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Shared word style ── */
  const wordStyle = (visible) => ({
    position:   'absolute',
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle:  'italic',
    fontWeight: 300,
    fontSize:   'clamp(3rem, 8vw, 7.5rem)',
    color:      'var(--ivory)',
    letterSpacing: '-0.02em',
    opacity:    visible ? 1 : 0,
    filter:     visible ? 'blur(0px)' : 'blur(12px)',
    transform:  visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.7s ease, filter 0.7s ease, transform 0.7s ease',
    userSelect: 'none',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     'var(--black)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        zIndex:         1000,
        opacity:        exiting ? 0 : 1,
        transition:     'opacity 0.6s ease',
      }}
    >
      {/* Word stage */}
      <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
        {WORDS.map((w, i) => (
          <span key={w.text} style={wordStyle(activeWord === i)}>
            {w.text}
          </span>
        ))}

        {/* VS Studio logotype */}
        <div
          style={{
            opacity:    showLogo ? 1 : 0,
            transform:  showLogo ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <img
            src="https://res.cloudinary.com/drn6x6hbd/image/upload/v1779744741/logo_reverse.png"
            alt="VS Studio"
            style={{ height: '64px', width: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>
      </div>

      {/* Skip button — bottom right */}
      <button
        onClick={skip}
        style={{
          position:      'fixed',
          bottom:        '2.5rem',
          right:         '2.5rem',
          background:    'transparent',
          border:        '1px solid var(--gold)',
          color:         'var(--gold)',
          fontFamily:    "'Montserrat', sans-serif",
          fontSize:      '0.6rem',
          fontWeight:    300,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          padding:       '0.55rem 1.4rem',
          cursor:        'none',
          zIndex:        1001,
          transition:    'background 0.25s, color 0.25s',
        }}
        className="hov"
      >
        Skip
      </button>
    </div>
  );
}
