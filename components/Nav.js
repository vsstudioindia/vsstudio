'use client';

import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = ['Films', 'Founders', 'Planners', 'Team'];

export default function Nav() {
  const [scrollPct, setScrollPct] = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollPct(isNaN(pct) ? 0 : pct * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        right:          0,
        zIndex:         100,
        padding:        '24px 56px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        background:     'linear-gradient(to bottom, rgba(6,6,6,0.96) 0%, transparent 100%)',
      }}
    >
      {/* Gold scroll progress bar — 1px line at the very top of the page */}
      <div
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          height:     '1px',
          width:      `${scrollPct}%`,
          background: 'var(--gold)',
          transition: 'width 0.1s linear',
        }}
      />

      {/* Left — logo wordmark */}
      <a
        href="#"
        className="hov"
        style={{
          fontFamily:     "'Cormorant Garamond', serif",
          fontSize:       '13px',
          fontWeight:     400,
          letterSpacing:  '0.42em',
          textTransform:  'uppercase',
          color:          'var(--gold)',
          textDecoration: 'none',
        }}
      >
        VS Studio
      </a>

      {/* Center — navigation links */}
      <ul
        style={{
          listStyle:      'none',
          display:        'flex',
          gap:            '40px',
          position:       'absolute',
          left:           '50%',
          transform:      'translateX(-50%)',
        }}
      >
        {NAV_LINKS.map((label) => (
          <li key={label}>
            <a
              href={`#${label.toLowerCase()}`}
              className="hov"
              onMouseEnter={() => setHoveredLink(label)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                fontFamily:     "'Montserrat', sans-serif",
                fontSize:       '9px',
                fontWeight:     300,
                letterSpacing:  '0.22em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                color:          'var(--gold)',
                opacity:        hoveredLink === label ? 1 : 0.42,
                transition:     'opacity 0.25s ease',
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right — CTA button */}
      <a
        href="#cta"
        className="hov"
        style={{
          fontFamily:     "'Montserrat', sans-serif",
          fontSize:       '9px',
          fontWeight:     500,
          letterSpacing:  '0.22em',
          textTransform:  'uppercase',
          textDecoration: 'none',
          color:          'var(--black)',
          background:     'var(--gold)',
          padding:        '9px 20px',
          transition:     'background 0.25s ease, color 0.25s ease',
          whiteSpace:     'nowrap',
        }}
      >
        Begin →
      </a>
    </nav>
  );
}
