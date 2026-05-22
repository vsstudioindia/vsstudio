'use client';

import { useState } from 'react';

const RIGHT_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/vs.studio' },
  { label: 'Privacy',   href: '#'                                },
  { label: 'Contact',   href: 'mailto:hello@vsstudio.in'         },
];

export default function Footer() {
  const [hovered, setHovered] = useState(null);

  return (
    <footer
      style={{
        padding:        '44px 56px',
        borderTop:      '1px solid rgba(201,168,76,0.07)',
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        background:     'var(--black)',
      }}
    >
      {/* Left — wordmark */}
      <p
        style={{
          fontFamily:    "'Cormorant Garamond', serif",
          fontSize:      '12px',
          fontWeight:    400,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color:         'var(--gold)',
          opacity:       0.55,
        }}
      >
        VS Studio
      </p>

      {/* Center — copyright */}
      <p
        style={{
          fontFamily:    "'Montserrat', sans-serif",
          fontSize:      '8px',
          fontWeight:    200,
          letterSpacing: '0.12em',
          color:         'var(--ivory)',
          opacity:       0.18,
        }}
      >
        © 2025 VS Studio. All rights reserved.
      </p>

      {/* Right — nav links */}
      <nav style={{ display: 'flex', gap: '28px' }}>
        {RIGHT_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="hov"
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontFamily:     "'Montserrat', sans-serif",
              fontSize:       '8px',
              fontWeight:     200,
              letterSpacing:  '0.2em',
              textTransform:  'uppercase',
              textDecoration: 'none',
              color:          'var(--gold)',
              opacity:        hovered === label ? 1 : 0.26,
              transition:     'opacity 0.25s ease',
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
