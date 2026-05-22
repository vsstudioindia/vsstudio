'use client';

import { useEffect, useRef, useState } from 'react';

function getVisibility(el) {
  if (!el) return 0;
  const rect         = el.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const visibleTop    = Math.max(0, Math.min(rect.bottom, windowHeight));
  const visibleBottom = Math.max(0, Math.min(windowHeight - rect.top, windowHeight));
  const visibleHeight = Math.max(0, Math.min(visibleTop, visibleBottom));
  return visibleHeight / windowHeight;
}

export default function Team() {
  const sectionRef     = useRef(null);
  const playerRef      = useRef(null);
  const volRef         = useRef(0);
  const iframeId       = 'yt-team-bg';
  const [isMuted,       setIsMuted]       = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  /* ── YouTube IFrame API ─────────────────────────────────────────────────── */
  useEffect(() => {
    function initPlayer() {
      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady(e) {
            /* video starts muted via URL param; keep vol at 0 until interaction */
            e.target.setVolume(0);
            volRef.current = 0;
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
      if (!document.getElementById('yt-api-script')) {
        const script = document.createElement('script');
        script.id    = 'yt-api-script';
        script.src   = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }
  }, []);

  /* ── Scroll-based volume (only after first interaction) ─────────────────── */
  useEffect(() => {
    function onScroll() {
      if (!hasInteracted || isMuted) return;
      const visibility = getVisibility(sectionRef.current);
      const target     = Math.round(visibility * 100);
      volRef.current   = volRef.current + (target - volRef.current) * 0.1;
      const rounded    = Math.round(volRef.current);
      const p          = playerRef.current;
      if (p && typeof p.setVolume === 'function') p.setVolume(rounded);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasInteracted, isMuted]);

  /* ── First-click to enable sound ────────────────────────────────────────── */
  function handleSectionClick() {
    if (hasInteracted) return;
    const p = playerRef.current;
    if (p && typeof p.unMute === 'function') {
      p.unMute();
      const vol = Math.round(getVisibility(sectionRef.current) * 100);
      volRef.current = vol;
      p.setVolume(vol);
    }
    setHasInteracted(true);
    setIsMuted(false);
  }

  /* ── Mute toggle (after interaction) ────────────────────────────────────── */
  function handleMuteToggle(e) {
    e.stopPropagation();
    if (!hasInteracted) {
      handleSectionClick();
      return;
    }
    const p = playerRef.current;
    if (!p || typeof p.setVolume !== 'function') return;
    if (isMuted) {
      p.unMute();
      const vol = Math.round(getVisibility(sectionRef.current) * 100);
      volRef.current = vol;
      p.setVolume(vol);
    } else {
      p.mute();
      p.setVolume(0);
    }
    setIsMuted((m) => !m);
  }

  /* ── Button label ────────────────────────────────────────────────────────── */
  function btnLabel() {
    if (!hasInteracted) return '♪ CLICK FOR SOUND';
    return isMuted ? '♪ MUTED' : '♪ SOUND ON';
  }

  return (
    <section
      id="team"
      ref={sectionRef}
      onClick={handleSectionClick}
      style={{
        position:       'relative',
        height:         '100vh',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         hasInteracted ? 'none' : 'pointer',
      }}
    >
      {/* ── Video background ──────────────────────────────────────────── */}
      <div
        style={{
          position:      'absolute',
          inset:         0,
          transform:     'scale(1.15)',
          pointerEvents: 'none',
        }}
      >
        <iframe
          id={iframeId}
          src="https://www.youtube.com/embed/VCdjRpDou4c?autoplay=1&mute=1&loop=1&playlist=VCdjRpDou4c&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            position:      'absolute',
            inset:         0,
            width:         '100%',
            height:        '100%',
            border:        'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(180deg, rgba(6,6,6,0.3) 0%, rgba(9,28,18,0.75) 100%)',
          zIndex:     1,
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div
        style={{
          position:  'relative',
          zIndex:    2,
          textAlign: 'center',
          padding:   '0 56px',
        }}
      >
        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '9px',
            fontWeight:    300,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
            opacity:       0.65,
            marginBottom:  '48px',
          }}
        >
          VS Studio — Est. 2014
        </p>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize:   'clamp(36px, 5vw, 72px)',
            fontWeight: 200,
            fontStyle:  'italic',
            lineHeight: 1.3,
            color:      'var(--ivory)',
            margin:     0,
          }}
        >
          Eleven years of showing up.
          <br />
          For the light. For the moment.
          <br />
          For the story.
        </h2>

        <div
          style={{
            width:      '60px',
            height:     '1px',
            background: 'var(--gold)',
            margin:     '40px auto',
            opacity:    0.5,
          }}
        />

        <p
          style={{
            fontFamily:    "'Montserrat', sans-serif",
            fontSize:      '11px',
            fontWeight:    200,
            letterSpacing: '0.15em',
            color:         'var(--ivory)',
            opacity:       0.45,
          }}
        >
          500+ Weddings · 11 Countries · 55+ Awards
        </p>
      </div>

      {/* ── Sound button ──────────────────────────────────────────────── */}
      <button
        className="hov"
        onClick={handleMuteToggle}
        style={{
          position:      'absolute',
          bottom:        '40px',
          right:         '56px',
          zIndex:        3,
          background:    'transparent',
          border:        '1px solid var(--gold)',
          padding:       '10px 20px',
          fontFamily:    "'Montserrat', sans-serif",
          fontSize:      '9px',
          fontWeight:    300,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color:         'var(--gold)',
          cursor:        'none',
          transition:    'opacity 0.3s ease',
          opacity:       hasInteracted ? 0.8 : 1,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = hasInteracted ? '0.8' : '1')}
      >
        {btnLabel()}
      </button>
    </section>
  );
}
