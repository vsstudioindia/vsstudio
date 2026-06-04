'use client';

import { useEffect, useRef, useState } from 'react';

/* Sequence:
   40 ms   → show VS Studio logo mark
   175 ms  → show "Love."
   1250 ms → show "Documented."
   2300 ms → show "Forever."
   3600 ms → fade out entire intro, call onComplete
*/
const WORDS = [
  { text: 'Love.',        delay: 175  },
  { text: 'Documented.',  delay: 1250 },
  { text: 'Forever.',     delay: 2300 },
];
const LOGO_DELAY    = 40;
const EXIT_DELAY    = 3600;
const WORD_DURATION = 900; /* ms each word is visible before it fades */

export default function Intro({ onComplete }) {
  const [revealedWords, setRevealedWords] = useState(new Set());
  const [showLogo,   setShowLogo]   = useState(false);
  const [exiting,    setExiting]    = useState(false);
  const timers = useRef([]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    setExiting(true);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    const t = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };

    /* Reveal each word in sequence — words stay visible once shown */
    WORDS.forEach((w, i) => {
      t(() => setRevealedWords((prev) => new Set([...prev, i])), w.delay);
    });

    t(() => setShowLogo(true),  LOGO_DELAY);
    t(() => {
      setExiting(true);
      t(onComplete, 300); /* wait for CSS fade-out */
    }, EXIT_DELAY);

    return () => timers.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Shared word style ── */
  const wordStyle = (visible) => ({
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle:  'italic',
    fontWeight: 300,
    fontSize:   '30px',
    color:      'var(--ivory)',
    letterSpacing: '-0.02em',
    opacity:    visible ? 1 : 0,
    filter:     visible ? 'blur(0px)' : 'blur(12px)',
    transform:  visible ? 'translateY(0)' : 'translateY(24px)',
    transition: 'opacity 0.35s ease, filter 0.35s ease, transform 0.35s ease',
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
        transition:     'opacity 0.3s ease',
      }}
    >
      {/* Word stage */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>

        {/* VS Studio logotype */}
        <div
          style={{
            opacity:    showLogo ? 1 : 0,
            transform:  showLogo ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          <img
            src="https://res.cloudinary.com/drn6x6hbd/image/upload/v1779744741/logo_reverse.png"
            alt="VS Studio"
            style={{ height: '64px', width: 'auto', display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Words row */}
        <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'center', alignItems: 'baseline', flexWrap: 'wrap' }}>
          {WORDS.map((w, i) => (
            <span key={w.text} style={wordStyle(revealedWords.has(i))}>
              {w.text}
            </span>
          ))}
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
