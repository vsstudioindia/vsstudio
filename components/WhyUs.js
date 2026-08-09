'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ── Data ────────────────────────────────────────────────────────────────── */

const VALUE_CARDS = [
  {
    num: '01',
    title: 'Seamless On-Site Collaboration',
    body: "11 years working with India's top event planners means we understand timeline, logistics, and decorum. We integrate invisibly and deliver visibly.",
    tag: 'Trusted by top planners',
  },
  {
    num: '02',
    title: 'Consistent Premium Output',
    body: "Whether it's a 50-person intimate gathering or a 1000-guest destination wedding, the VS Studio standard never wavers. Your clients always receive cinematic luxury.",
    tag: 'Guaranteed quality',
  },
  {
    num: '03',
    title: 'Social-Ready Deliverables',
    body: 'Highlight reels, Instagram-ready cuts, and editorial selects built for sharing. Our work markets your events — and your business — for months after the wedding.',
    tag: 'Content that converts',
  },
  {
    num: '04',
    title: 'Extensive Instagram Reach',
    body: "Our reels reach hundreds of thousands of engaged couples. When we feature your event, it doesn't just get documented — it gets seen. By exactly the kind of couples you want walking through your door.",
    tag: 'Massive organic reach',
  },
  {
    num: '05',
    title: 'We Make You Look Good',
    body: 'When clients see their photographs and films, they remember who recommended their photographer. Our work reflects directly on your curation. We make that reflection exceptional.',
    tag: 'Your reputation, elevated',
  },
  {
    num: '06',
    title: 'Dedicated Planner Partnership',
    body: "Priority booking, co-branded collateral, and a direct line to our team. You're never just a referral to us — you're a partner with a standing relationship.",
    tag: 'Partnership programme',
  },
];

const STATS = [
  {
    value: '98%',
    label: 'Planner recommendation rate',
  },
  {
    value: '4.9★',
    label: 'Average client rating',
  },
  {
    value: '500+',
    label: 'Weddings Delivered',
  },
  {
    value: '11yr',
    label: 'Industry track record',
  },
];

/* ── Value card ──────────────────────────────────────────────────────────── */

function ValueCard({
  num,
  title,
  body,
  tag,
  revealDelay,
}) {
  const [hovered, setHovered] =
    useState(false);

  const [ref, visible] =
    useReveal(0.05);

  return (
    <div
      ref={ref}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      style={{
        position: 'relative',
        background: hovered
          ? '#111'
          : 'var(--black2)',
        padding: '44px 40px',
        overflow: 'hidden',
        transition:
          'background 0.3s ease',
        opacity: visible
          ? 1
          : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(24px)',
        transitionProperty:
          'background, opacity, transform',
        transitionDuration:
          '0.3s, 0.8s, 0.8s',
        transitionTimingFunction:
          'ease, ease, ease',
        transitionDelay:
          `0s, ${revealDelay}ms, ${revealDelay}ms`,
      }}
    >
      {/* Left gold activation line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background:
            'var(--gold)',
          transform: hovered
            ? 'scaleY(1)'
            : 'scaleY(0)',
          transformOrigin:
            'bottom',
          transition:
            'transform 0.45s ease',
        }}
      />

      {/* Faded number */}
      <p
        style={{
          fontFamily:
            "'Cormorant Garamond', serif",
          fontSize: '56px',
          fontWeight: 300,
          color:
            'rgba(201,168,76,0.1)',
          lineHeight: 1,
          marginBottom:
            '20px',
          userSelect: 'none',
        }}
      >
        {num}
      </p>

      {/* Title */}
      <h3
        style={{
          fontFamily:
            "'Cormorant Garamond', serif",
          fontSize: '21px',
          fontWeight: 400,
          color:
            'var(--ivory)',
          marginBottom:
            '14px',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontFamily:
            "'Montserrat', sans-serif",
          fontSize: '11px',
          fontWeight: 200,
          lineHeight: 1.85,
          color:
            'var(--ivory)',
          opacity: 0.42,
          marginBottom:
            '20px',
        }}
      >
        {body}
      </p>

      {/* Tag */}
      <div
        style={{
          opacity: hovered
            ? 0.8
            : 0,
          transform: hovered
            ? 'translateY(0)'
            : 'translateY(6px)',
          transition:
            'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <span
          style={{
            fontFamily:
              "'Montserrat', sans-serif",
            fontSize: '8px',
            fontWeight: 300,
            letterSpacing:
              '0.22em',
            textTransform:
              'uppercase',
            color:
              'var(--gold)',
          }}
        >
          ↗ {tag}
        </span>
      </div>
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */

function StatCard({
  value,
  label,
  revealDelay,
}) {
  const [ref, visible] =
    useReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        background:
          'var(--emerald)',
        padding: '40px 36px',
        position: 'relative',
        opacity: visible
          ? 1
          : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(20px)',
        transition:
          `opacity 0.8s ease ${revealDelay}ms, transform 0.8s ease ${revealDelay}ms`,
      }}
    >
      {/* Top gold gradient accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, var(--gold) 40%, var(--gold) 60%, transparent)',
          opacity: 0.45,
        }}
      />

      <p
        style={{
          fontFamily:
            "'Cormorant Garamond', serif",
          fontSize:
            'clamp(2.4rem, 4vw, 3.6rem)',
          fontWeight: 300,
          color:
            'var(--gold)',
          lineHeight: 1,
          marginBottom:
            '10px',
        }}
      >
        {value}
      </p>

      <p
        style={{
          fontFamily:
            "'Montserrat', sans-serif",
          fontSize: '9px',
          fontWeight: 200,
          letterSpacing:
            '0.12em',
          color:
            'var(--ivory)',
          opacity: 0.42,
          lineHeight: 1.6,
        }}
      >
        {label}
      </p>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */

export default function WhyUs() {
  const isMobile = useMobile();

  const [
    headerRef,
    headerVisible,
  ] = useReveal(0.1);

  const [
    closingRef,
    closingVisible,
  ] = useReveal(0.2);

  return (
    <section
      id="planners"
      style={{
        background:
          'var(--black)',
      }}
    >

      {/* ── Header strip ─────────────────────────────────────────────── */}

      <div
        ref={headerRef}
        style={{
          background:
            'var(--emerald2)',

          padding: isMobile
            ? '56px 24px 48px'
            : '72px 56px 64px',

          borderBottom:
            '1px solid rgba(201,168,76,0.12)',

          opacity:
            headerVisible
              ? 1
              : 0,

          transform:
            headerVisible
              ? 'translateY(0)'
              : 'translateY(24px)',

          transition:
            'opacity 0.9s ease, transform 0.9s ease',
        }}
      >

        {/* Label with line */}

        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: '16px',
            marginBottom:
              '40px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '1px',
              background:
                'var(--gold)',
              opacity: 0.5,
              flexShrink: 0,
            }}
          />

          <p
            style={{
              fontFamily:
                "'Montserrat', sans-serif",
              fontSize:
                '0.58rem',
              fontWeight: 300,
              letterSpacing:
                '0.38em',
              textTransform:
                'uppercase',
              color:
                'var(--gold)',
            }}
          >
            05 — For Partners
          </p>
        </div>

        {/* Two-column: headline | premise */}

        <div
          style={{
            display: 'grid',

            gridTemplateColumns:
              isMobile
                ? '1fr'
                : '1fr 1fr',

            gap: isMobile
              ? '28px'
              : '64px',

            alignItems:
              'end',

            width: '100%',
            maxWidth: '100%',
          }}
        >

          {/* Left — headline */}

          <h2
            style={{
              fontFamily:
                "'Cormorant Garamond', serif",

              fontSize:
                isMobile
                  ? '40px'
                  : 'clamp(38px, 4.5vw, 68px)',

              fontWeight: 200,

              lineHeight: 1.05,

              color:
                'var(--ivory)',

              margin: 0,

              whiteSpace:
                isMobile
                  ? 'normal'
                  : 'nowrap',

              maxWidth: '100%',

              overflowWrap:
                'break-word',

              wordBreak:
                'normal',
            }}
          >
            Why{' '}

            <em
              style={{
                color:
                  '#c9a84c',
                fontStyle:
                  'italic',
              }}
            >
              You
            </em>{' '}

            Should Choose{' '}

            <em
              style={{
                color:
                  '#c9a84c',
                fontStyle:
                  'italic',
              }}
            >
              Us
            </em>
            .
          </h2>

          {/* Right — premise */}

          <div>
            <p
              style={{
                fontFamily:
                  "'Montserrat', sans-serif",

                fontSize:
                  '12px',

                fontWeight: 200,

                lineHeight:
                  1.9,

                color:
                  'var(--ivory)',

                opacity: 0.42,

                marginBottom:
                  '28px',

                maxWidth:
                  '440px',
              }}
            >
              You don't just get a
              photographer. You get
              a creative partner who
              makes your events look
              extraordinary and makes
              you look brilliant for
              recommending us. Every
              time.
            </p>
          </div>
        </div>
      </div>

      {/* ── Value cards ──────────────────────────────────────────────── */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            isMobile
              ? '1fr'
              : 'repeat(3, 1fr)',

          gap: '1px',

          background:
            'rgba(201,168,76,0.06)',
        }}
      >
        {VALUE_CARDS.map(
          (card, i) => (
            <ValueCard
              key={card.num}
              {...card}
              revealDelay={
                i * 80
              }
            />
          )
        )}
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────── */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            isMobile
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',

          gap: '1px',

          background:
            'rgba(201,168,76,0.06)',
        }}
      >
        {STATS.map(
          (stat, i) => (
            <StatCard
              key={stat.value}
              {...stat}
              revealDelay={
                i * 80
              }
            />
          )
        )}
      </div>

      {/* ── Closing pitch ────────────────────────────────────────────── */}

      <div
        ref={closingRef}
        style={{
          padding: isMobile
            ? '48px 24px'
            : '72px 56px',

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center',

          gap: '48px',

          opacity:
            closingVisible
              ? 1
              : 0,

          transform:
            closingVisible
              ? 'translateY(0)'
              : 'translateY(20px)',

          transition:
            'opacity 0.9s ease, transform 0.9s ease',
        }}
      >

        {/* Quote */}

        <blockquote
          style={{
            margin: 0,
            padding: 0,

            fontFamily:
              "'Cormorant Garamond', serif",

            fontStyle:
              'italic',

            fontSize:
              'clamp(1.1rem, 1.8vw, 1.55rem)',

            fontWeight: 300,

            lineHeight: 1.45,

            color:
              'var(--ivory)',

            maxWidth:
              '640px',
          }}
        >
          "When you hire VS Studio,
          your clients don't just
          remember their wedding.
          They{' '}

          <em
            style={{
              color:
                'var(--gold)',
              fontStyle:
                'inherit',
            }}
          >
            relive
          </em>

          {' '}it. And they tell
          everyone who made it
          possible."
        </blockquote>
      </div>
    </section>
  );
}
