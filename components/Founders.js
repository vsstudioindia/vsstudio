'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

/* ── Shared scroll-reveal hook ───────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Founder card ────────────────────────────────────────────────────────── */
function FounderCard({ src, role, name, title, bio, badge, isLast,
                        imgObjectPosition = 'top center',
                        baseScale = 1,
                        hoverScale = 1.04 }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useReveal(0.1);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:   'relative',
        height:     'clamp(420px, 70vw, 700px)',
        overflow:   'hidden',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 1s ease, transform 1s ease',
      }}
    >
      {/* Photo */}
      <img
        src={src}
        alt={name}
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: imgObjectPosition,
          filter:         hovered
            ? 'brightness(0.72) saturate(0.9) contrast(1.1)'
            : 'brightness(0.55) saturate(0.75) contrast(1.1)',
          transform:      hovered ? `scale(${hoverScale})` : `scale(${baseScale})`,
          transition:     'filter 0.8s ease, transform 0.8s ease',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(180deg, rgba(6,6,6,0.1) 0%, rgba(6,6,6,0.2) 40%, rgba(6,6,6,0.95) 100%)',
          zIndex:     1,
        }}
      />

      {/* Gold vertical divider — right edge of first card only */}
      {!isLast && (
        <div
          style={{
            position:   'absolute',
            top:        '15%',
            bottom:     '15%',
            right:      0,
            width:      '1px',
            background: 'linear-gradient(180deg, transparent 0%, #c9a84c 30%, #c9a84c 70%, transparent 100%)',
            opacity:    0.4,
            zIndex:     3,
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position:      'absolute',
          bottom:        0,
          left:          0,
          right:         0,
          padding:       '48px',
          zIndex:        2,
          display:       'flex',
          flexDirection: 'column',
          gap:           '10px',
        }}
      >
        {/* Role label */}
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '0.58rem',
            fontWeight:    300,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
          }}
        >
          {role}
        </p>

        {/* Name */}
        <h3
          style={{
            fontFamily:  "'Cormorant Garamond', serif",
            fontSize:    'clamp(28px, 3vw, 44px)',
            fontWeight:  300,
            lineHeight:  1.1,
            color:       'var(--ivory)',
            margin:      0,
          }}
        >
          {name}
        </h3>

        {/* Title */}
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '10px',
            fontWeight:    200,
            letterSpacing: '0.12em',
            color:         'var(--ivory)',
            opacity:       0.42,
          }}
        >
          {title}
        </p>

        {/* Bio — expands on hover */}
        <div
          style={{
            maxHeight:  hovered ? '160px' : '0',
            overflow:   'hidden',
            transition: 'max-height 0.6s ease',
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize:   '11px',
              fontWeight: 200,
              lineHeight: 1.85,
              color:      'var(--ivory)',
              opacity:    0.7,
              paddingTop: '12px',
            }}
          >
            {bio}
          </p>
        </div>

        {/* Badge — appears on hover */}
        <div
          style={{
            overflow:   'hidden',
            maxHeight:  hovered ? '48px' : '0',
            transition: 'max-height 0.5s ease 0.1s',
          }}
        >
          <div
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '8px',
              border:        '1px solid var(--gold)',
              borderRadius:  '999px',
              padding:       '5px 14px',
              marginTop:     '10px',
            }}
          >
            <span
              style={{
                width:        '5px',
                height:       '5px',
                borderRadius: '50%',
                background:   'var(--gold)',
                flexShrink:   0,
              }}
            />
            <span
              style={{
                fontFamily:    "'Montserrat', sans-serif",
                fontSize:      '8px',
                fontWeight:    300,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:         'var(--gold)',
              }}
            >
              {badge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export default function Founders() {
  const isMobile = useMobile();
  /* Banner image zoom: scale(1.04) → scale(1) over 8s on mount */
  const [zoomed, setZoomed] = useState(false);
  const [bannerRef, bannerVisible] = useReveal(0.05);
  const [quoteRef,  quoteVisible]  = useReveal(0.3);
  const [cardsRef,  cardsVisible]  = useReveal(0.05);

  useEffect(() => {
    const id = setTimeout(() => setZoomed(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <div id="founders">

      {/* ══ PART 1 — Full-height banner ══════════════════════════════════ */}
      <section
        ref={bannerRef}
        style={{
          position:   'relative',
          height:     '100vh',
          overflow:   'hidden',
          display:    'flex',
          alignItems: 'flex-end',
          opacity:    bannerVisible ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        {/* Banner photo with slow zoom */}
        <img
          src="https://res.cloudinary.com/drn6x6hbd/image/upload/founders-banner"
          alt="VS Studio Founders"
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            filter:     'brightness(0.45) saturate(0.7)',
            transform:  zoomed ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 8s ease',
            zIndex:     0,
          }}
        />

        {/* Gradient 1 — bottom darkening */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(180deg, transparent 15%, rgba(6,6,6,0.82) 100%)',
            zIndex:     1,
          }}
        />

        {/* Gradient 2 — left edge vignette */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(90deg, rgba(6,6,6,0.35) 0%, transparent 55%)',
            zIndex:     1,
          }}
        />

        {/* Bottom-left content */}
        <div
          style={{
            position: 'relative',
            zIndex:   2,
            padding:  isMobile ? '0 24px 56px' : '0 56px 80px',
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontSize:      '0.6rem',
              fontWeight:    300,
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
              marginBottom:  '20px',
            }}
          >
            04 — The Visionaries
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily:  "'Cormorant Garamond', serif",
              fontSize:    'clamp(36px, 8vw, 112px)',
              fontWeight:  200,
              lineHeight:  0.98,
              color:       'var(--ivory)',
              margin:      0,
            }}
          >
            Behind the Lens.
            <br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>
              Behind the Brand.
            </em>
          </h2>

          {/* Gold rule */}
          <div
            style={{
              width:      '80px',
              height:     '1px',
              background: 'var(--gold)',
              opacity:    0.6,
              margin:     '36px 0',
            }}
          />

          {/* Descriptor */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize:   '11px',
              fontWeight: 200,
              lineHeight: 1.9,
              color:      'var(--ivory)',
              opacity:    0.42,
              maxWidth:   '480px',
              margin:     0,
            }}
          >
            VS Studio was founded by two women who refused to let wedding
            photography be ordinary. They brought fashion sensibility, cinematic
            ambition, and relentless craft to every frame — and built one of
            India's most distinctive media houses in the process.
          </p>
        </div>
      </section>

      {/* ══ PART 2 — Quote strip ════════════════════════════════════════ */}
      <div
        ref={quoteRef}
        style={{
          background:     'var(--emerald2)',
          padding:        isMobile ? '28px 24px' : '36px 56px',
          display:        'flex',
          alignItems:     'center',
          gap:            isMobile ? '16px' : '40px',
          flexWrap:       'wrap',
          opacity:        quoteVisible ? 1 : 0,
          transform:      quoteVisible ? 'translateY(0)' : 'translateY(16px)',
          transition:     'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        {/* Left line */}
        <div style={{ width: '48px', height: '1px', background: 'var(--gold)', opacity: 0.5, flexShrink: 0 }} />

        {/* Quote */}
        <p
          style={{
            fontFamily:  "'Cormorant Garamond', serif",
            fontStyle:   'italic',
            fontSize:    'clamp(1.1rem, 1.8vw, 1.5rem)',
            fontWeight:  300,
            color:       'var(--ivory)',
            margin:      0,
            whiteSpace:  isMobile ? 'normal' : 'nowrap',
          }}
        >
          Two women. One vision.{' '}
          <em style={{ color: 'var(--gold)', fontStyle: 'inherit' }}>
            Eleven years of extraordinary.
          </em>
        </p>

        {/* Right line */}
        <div style={{ width: '48px', height: '1px', background: 'var(--gold)', opacity: 0.5, flexShrink: 0 }} />
      </div>

      {/* ══ PART 3 — Founder cards ══════════════════════════════════════ */}
      <div
        ref={cardsRef}
        style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          opacity:             cardsVisible ? 1 : 0,
          transition:          'opacity 0.6s ease',
        }}
      >
        <FounderCard
          src="https://res.cloudinary.com/drn6x6hbd/image/upload/vrinda"
          role="Co-Founder & Story-teller"
          name="Vrinda Ganeriwala"
          title="Photographer. Story-teller. Canon Wizard."
          bio="Vrinda doesn't just photograph weddings — she narrates them. With an eye trained across 11 years and 500+ love stories, she finds the frame that holds the entire emotion of a day. A Canon Wizard and instinctive storyteller, she has redefined what wedding photography looks like in India."
          badge="Canon Wizard"
          isLast={false}
        />
        <FounderCard
          src="https://res.cloudinary.com/drn6x6hbd/image/upload/shristi"
          role="Co-Founder & Creative Director"
          name="Shristi Dhandharia"
          title="Photographer. Story-teller. Canon Wizard."
          bio="Shristi builds worlds out of moving images. As the cinematic force behind VS Studio, she crafts wedding films that feel less like documentation and more like memory. Her work has appeared in international bridal publications — because great cinema knows no borders."
          badge="Award-Winning Filmmaker"
          isLast={true}
          imgObjectPosition="center 20%"
          baseScale={1.15}
          hoverScale={1.19}
        />
      </div>
    </div>
  );
}
