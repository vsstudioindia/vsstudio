'use client';

import { useEffect, useRef, useState } from 'react';

function getVisibility(el) {
  if (!el) return 0;
  const rect          = el.getBoundingClientRect();
  const wh            = window.innerHeight;
  const visibleTop    = Math.max(0, Math.min(rect.bottom, wh));
  const visibleBottom = Math.max(0, Math.min(wh - rect.top, wh));
  const visibleHeight = Math.max(0, Math.min(visibleTop, visibleBottom));
  return visibleHeight / wh;
}

export default function Team() {
  const sectionRef     = useRef(null);
  const containerRef   = useRef(null);
  const playerRef      = useRef(null);
  const volRef         = useRef(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMuted,       setIsMuted]       = useState(false);

  /* ── Build player once on mount ────────────────────────────────────────── */
  useEffect(() => {
    function createPlayer() {
      /* Create the iframe div target */
      const div = document.createElement('div');
      div.id = 'yt-team-player';
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(div);
      }

      playerRef.current = new window.YT.Player('yt-team-player', {
        videoId: 'VCdjRpDou4c',
        playerVars: {
          autoplay:       1,
          mute:           1,
          loop:           1,
          playlist:       'VCdjRpDou4c',
          controls:       0,
          showinfo:       0,
          rel:            0,
          modestbranding: 1,
          enablejsapi:    1,
          playsinline:    1,
        },
        width:  '100%',
        height: '100%',
        events: {
          onReady(e) {
            e.target.setVolume(0);
            volRef.current = 0;
          },
        },
      });
    }

    function loadAPI() {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }
      /* Chain onto any existing ready callback */
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        createPlayer();
      };
      if (!window.ytApiLoading) {
        window.ytApiLoading = true;
        const script = document.createElement('script');
        script.src   = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }

    loadAPI();

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  /* ── Scroll-based volume (only after interaction, only when unmuted) ────── */
  useEffect(() => {
    if (!hasInteracted) return;

    function onScroll() {
      if (isMuted) return;
      const p = playerRef.current;
      if (!p || typeof p.setVolume !== 'function') return;
      const visibility = getVisibility(sectionRef.current);
      const target     = Math.round(visibility * 100);
      volRef.current   = volRef.current + (target - volRef.current) * 0.15;
      p.setVolume(Math.round(volRef.current));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* seed immediately */
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasInteracted, isMuted]);

  /* ── First interaction — unmute and hand off to scroll logic ────────────── */
  function handleTapForSound() {
    const p = playerRef.current;
    if (!p || typeof p.unMute !== 'function') return;
    p.unMute();
    const vol = Math.round(getVisibility(sectionRef.current) * 100);
    volRef.current = vol;
    p.setVolume(vol);
    setHasInteracted(true);
    setIsMuted(false);
  }

  /* ── Mute toggle ─────────────────────────────────────────────────────────── */
  function handleMuteToggle(e) {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    if (isMuted) {
      p.unMute();
      const vol = Math.round(getVisibility(sectionRef.current) * 100);
      volRef.current = vol;
      p.setVolume(vol);
      setIsMuted(false);
    } else {
      p.mute();
      p.setVolume(0);
      setIsMuted(true);
    }
  }

  return (
    <section
      id="team"
      ref={sectionRef}
      style={{
        position:       'relative',
        height:         '100vh',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Video container ───────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position:      'absolute',
          inset:         0,
          transform:     'scale(1.18)',
          pointerEvents: 'none',
          zIndex:        0,
        }}
      />

      {/* ── Solid dark overlay ────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'rgba(6,6,6,0.4)',
          zIndex:     1,
        }}
      />

      {/* ── Gradient overlay ──────────────────────────────────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(180deg, rgba(6,6,6,0.75) 0%, rgba(9,28,18,0.92) 100%)',
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

        {/* ── Tap for sound prompt ────────────────────────────────────── */}
        {!hasInteracted && (
          <button
            className="hov"
            onClick={handleTapForSound}
            style={{
              marginTop:     '52px',
              display:       'inline-block',
              background:    'transparent',
              border:        '1px solid var(--gold)',
              padding:       '16px 40px',
              fontFamily:    "'Montserrat', sans-serif",
              fontSize:      '11px',
              fontWeight:    300,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
              cursor:        'none',
              transition:    'background 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--gold)';
              e.currentTarget.style.color      = 'var(--black)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color      = 'var(--gold)';
            }}
          >
            ♪ TAP FOR SOUND
          </button>
        )}
      </div>

      {/* ── Mute toggle (visible only after interaction) ──────────────── */}
      {hasInteracted && (
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
            opacity:       0.8,
            transition:    'opacity 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          {isMuted ? '♪ UNMUTE' : '♪ MUTE'}
        </button>
      )}
    </section>
  );
}
