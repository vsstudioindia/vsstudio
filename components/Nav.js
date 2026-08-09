'use client';

import { useEffect, useState } from 'react';
import { useMobile } from '../lib/useMobile';

const NAV_LINKS = [
  { label: 'Frames',   href: '#showcase' },
  { label: 'Films',    href: '#films'    },
  { label: 'Founders', href: '#founders' },
  { label: 'Planners', href: '#planners' },
  { label: 'Team',     href: '#team'     },
];

export default function Nav() {
  const [scrollPct,   setScrollPct]   = useState(0);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScrollPct(isNaN(pct) ? 0 : pct * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close menu when resizing to desktop */
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  /* Lock body scroll while overlay is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         100,
          padding:        isMobile ? '18px 24px' : '24px 56px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          background:     'linear-gradient(to bottom, rgba(6,6,6,0.96) 0%, transparent 100%)',
        }}
      >
        {/* Gold scroll progress bar */}
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

        {/* Left — logo */}
        <a href="#" className="hov" style={{ textDecoration: 'none', display: 'block' }}>
          <img
            src="https://res.cloudinary.com/drn6x6hbd/image/upload/v1779744741/logo_reverse.png"
            alt="VS Studio"
            style={{ height: isMobile ? '36px' : '48px', width: 'auto', display: 'block' }}
          />
        </a>

        {/* Center — navigation links (desktop only) */}
        {!isMobile && (
          <ul
            style={{
              listStyle:  'none',
              display:    'flex',
              gap:        '40px',
              position:   'absolute',
              left:       '50%',
              transform:  'translateX(-50%)',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
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
        )}

        {/* Right — CTA (desktop) or hamburger (mobile) */}
        {isMobile ? (
          /* Hamburger — 3 gold lines that animate to X */
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
            style={{
              background:    'none',
              border:        'none',
              cursor:        'pointer',
              padding:       '6px',
              display:       'flex',
              flexDirection: 'column',
              gap:           '5px',
              zIndex:        101,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display:         'block',
                  width:           '22px',
                  height:          '1.5px',
                  background:      'var(--gold)',
                  transformOrigin: 'center',
                  transition:      'transform 0.3s ease, opacity 0.3s ease',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                    : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)'
                    : 'scaleX(0)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        ) : (
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
        )}
      </nav>

      {/* Fullscreen mobile overlay — slides down from top */}
      {isMobile && (
        <div
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         99,
            background:     'rgba(6,6,6,0.98)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '36px',
            transform:      menuOpen ? 'translateY(0)' : 'translateY(-100%)',
            transition:     'transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)',
            pointerEvents:  menuOpen ? 'auto' : 'none',
          }}
        >
          {NAV_LINKS.map(({ label, href }, i) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(1.35rem, 6vw, 2rem)',
                fontWeight: 300,
                fontStyle: 'normal',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color:          'var(--ivory)',
                textDecoration: 'none',
                opacity:        menuOpen ? 1 : 0,
                transform:      menuOpen ? 'translateY(0)' : 'translateY(24px)',
                transition:     `opacity 0.4s ease ${i * 80 + 200}ms, transform 0.4s ease ${i * 80 + 200}ms`,
              }}
            >
              {label}
            </a>
          ))}

          <a
            href="#cta"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily:     "'Montserrat', sans-serif",
              fontSize:       '9px',
              fontWeight:     500,
              letterSpacing:  '0.22em',
              textTransform:  'uppercase',
              textDecoration: 'none',
              color:          'var(--black)',
              background:     'var(--gold)',
              padding:        '12px 32px',
              marginTop:      '8px',
              opacity:        menuOpen ? 1 : 0,
              transform:      menuOpen ? 'translateY(0)' : 'translateY(24px)',
              transition:     'opacity 0.4s ease 520ms, transform 0.4s ease 520ms',
            }}
          >
            Begin →
          </a>
        </div>
      )}
    </>
  );
}
