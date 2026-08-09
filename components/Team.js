'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

function getVisibility(el) {
  if (!el) return 0;

  const rect = el.getBoundingClientRect();
  const wh = window.innerHeight;

  const visibleTop =
    Math.max(0, Math.min(rect.bottom, wh));

  const visibleBottom =
    Math.max(0, Math.min(wh - rect.top, wh));

  const visibleHeight =
    Math.max(0, Math.min(visibleTop, visibleBottom));

  return visibleHeight / wh;
}

export default function Team() {
  const isMobile = useMobile();

  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const volRef = useRef(0);

  const [hasInteracted, setHasInteracted] =
    useState(false);

  const [isMuted, setIsMuted] =
    useState(false);

  /* ── Build player once on mount ────────────────────────────────────────── */
  useEffect(() => {
    function createPlayer() {
      const div =
        document.createElement('div');

      div.id =
        'yt-team-player';

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(div);
      }

      playerRef.current =
        new window.YT.Player(
          'yt-team-player',
          {
            videoId: 'VCdjRpDou4c',

            playerVars: {
              autoplay: 1,
              mute: 1,
              loop: 1,
              playlist: 'VCdjRpDou4c',
              controls: 0,
              showinfo: 0,
              rel: 0,
              modestbranding: 1,
              enablejsapi: 1,
              playsinline: 1,
            },

            width: '100%',
            height: '100%',

            events: {
              onReady(e) {
                e.target.setVolume(0);
                volRef.current = 0;
              },
            },
          }
        );
    }

    function loadAPI() {
      if (
        window.YT &&
        window.YT.Player
      ) {
        createPlayer();
        return;
      }

      const prev =
        window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady =
        () => {
          if (
            typeof prev === 'function'
          ) {
            prev();
          }

          createPlayer();
        };

      if (!window.ytApiLoading) {
        window.ytApiLoading = true;

        const script =
          document.createElement('script');

        script.src =
          'https://www.youtube.com/iframe_api';

        document.head.appendChild(script);
      }
    }

    loadAPI();

    return () => {
      if (
        playerRef.current &&
        typeof playerRef.current.destroy ===
          'function'
      ) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  /* ── Scroll-based volume ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!hasInteracted) return;

    function onScroll() {
      if (isMuted) return;

      const p =
        playerRef.current;

      if (
        !p ||
        typeof p.setVolume !==
          'function'
      ) {
        return;
      }

      const visibility =
        getVisibility(
          sectionRef.current
        );

      const target =
        Math.round(
          visibility * 100
        );

      volRef.current =
        volRef.current +
        (target -
          volRef.current) *
          0.15;

      p.setVolume(
        Math.round(
          volRef.current
        )
      );
    }

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    onScroll();

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      );
  }, [
    hasInteracted,
    isMuted,
  ]);

  /* ── First interaction — unmute ───────────────────────────────────────── */
  function handleTapForSound() {
    const p =
      playerRef.current;

    if (
      !p ||
      typeof p.unMute !==
        'function'
    ) {
      return;
    }

    p.unMute();

    const vol =
      Math.round(
        getVisibility(
          sectionRef.current
        ) * 100
      );

    volRef.current = vol;

    p.setVolume(vol);

    setHasInteracted(true);
    setIsMuted(false);
  }

  /* ── Mute toggle ──────────────────────────────────────────────────────── */
  function handleMuteToggle(e) {
    e.stopPropagation();

    const p =
      playerRef.current;

    if (!p) return;

    if (isMuted) {
      p.unMute();

      const vol =
        Math.round(
          getVisibility(
            sectionRef.current
          ) * 100
        );

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
        position: 'relative',

        height: isMobile
          ? 'auto'
          : '100vh',

        minHeight: isMobile
          ? 'auto'
          : '100vh',

        overflow: isMobile
          ? 'visible'
          : 'hidden',

        display: 'flex',

        flexDirection: isMobile
          ? 'column'
          : 'row',

        alignItems: 'center',
        justifyContent: 'center',

        background:
          'var(--black)',
      }}
    >

      {/* ── Video container ─────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: isMobile
            ? 'relative'
            : 'absolute',

          inset: isMobile
            ? 'auto'
            : 0,

          width: '100%',

          aspectRatio: isMobile
            ? '16 / 9'
            : 'auto',

          height: isMobile
            ? 'auto'
            : '100%',

          transform: isMobile
            ? 'none'
            : 'scale(1.18)',

          pointerEvents:
            'none',

          zIndex: 0,

          overflow:
            'hidden',

          flexShrink: 0,
        }}
      />

      {/* ── Solid dark overlay ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,

          display: isMobile
            ? 'none'
            : 'block',

          background:
            'rgba(6,6,6,0.4)',

          zIndex: 1,

          pointerEvents:
            'none',
        }}
      />

      {/* ── Gradient overlay ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,

          display: isMobile
            ? 'none'
            : 'block',

          background:
            'linear-gradient(180deg, rgba(6,6,6,0.75) 0%, rgba(9,28,18,0.92) 100%)',

          zIndex: 1,

          pointerEvents:
            'none',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: isMobile
            ? 'relative'
            : 'absolute',

          zIndex: 2,

          textAlign: 'center',

          width: '100%',

          padding: isMobile
            ? '48px 24px 64px'
            : '0 56px',

          background: isMobile
            ? 'var(--black)'
            : 'transparent',
        }}
      >

        {/* Eyebrow — desktop only */}
        <p
          style={{
            fontFamily:
              "'Montserrat', sans-serif",

            fontSize: '9px',

            fontWeight: 300,

            letterSpacing: '0.5em',

            textTransform:
              'uppercase',

            color:
              'var(--gold)',

            opacity: 0.65,

            marginBottom: '48px',

            display: isMobile
              ? 'none'
              : 'block',
          }}
        >
          VS Studio — Est. 2015
        </p>

        <h2
          style={{
            fontFamily:
              "'Cormorant Garamond', serif",

            fontSize: isMobile
              ? '34px'
              : 'clamp(36px, 5vw, 72px)',

            fontWeight: 200,

            fontStyle: 'italic',

            lineHeight: 1.3,

            color:
              'var(--ivory)',

            margin: 0,
          }}
        >
          <>
            <span
              style={{
                color: '#c9a84c',
                fontWeight: 600,
              }}
            >
              11
            </span>{' '}
            years of showing up.
          </>

          <br />

          For the light.
          For the moment.

          <br />

          For the story.
        </h2>

        <div
          style={{
            width: '60px',

            height: '1px',

            background:
              'var(--gold)',

            margin: isMobile
              ? '28px auto'
              : '40px auto',

            opacity: 0.5,
          }}
        />

        {/* Stats — desktop only */}
        <p
          style={{
            fontFamily:
              "'Montserrat', sans-serif",

            fontSize: '11px',

            fontWeight: 200,

            letterSpacing:
              '0.15em',

            color:
              'var(--ivory)',

            opacity: 0.45,

            display: isMobile
              ? 'none'
              : 'block',
          }}
        >
          500+ Weddings · 11 Countries · 55+ Awards
        </p>

        {/* ── Tap for sound ─────────────────────────────────────────────── */}
        {!hasInteracted && (
          <button
            className="hov"
            onClick={
              handleTapForSound
            }
            style={{
              marginTop: isMobile
                ? '28px'
                : '52px',

              display:
                'inline-block',

              background:
                'transparent',

              border:
                '1px solid var(--gold)',

              padding: isMobile
                ? '13px 28px'
                : '16px 40px',

              fontFamily:
                "'Montserrat', sans-serif",

              fontSize: '11px',

              fontWeight: 300,

              letterSpacing:
                '0.4em',

              textTransform:
                'uppercase',

              color:
                'var(--gold)',

              cursor:
                'pointer',

              transition:
                'background 0.3s ease, color 0.3s ease',
            }}

            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'var(--gold)';

              e.currentTarget.style.color =
                'var(--black)';
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'transparent';

              e.currentTarget.style.color =
                'var(--gold)';
            }}
          >
            ♪ TAP FOR SOUND
          </button>
        )}
      </div>

      {/* ── Mute toggle ─────────────────────────────────────────────────── */}
      {hasInteracted && (
        <button
          className="hov"
          onClick={
            handleMuteToggle
          }
          style={{
            position: 'absolute',

            bottom: isMobile
              ? '20px'
              : '40px',

            right: isMobile
              ? '20px'
              : '56px',

            zIndex: 3,

            background:
              'transparent',

            border:
              '1px solid var(--gold)',

            padding: isMobile
              ? '8px 14px'
              : '10px 20px',

            fontFamily:
              "'Montserrat', sans-serif",

            fontSize: '9px',

            fontWeight: 300,

            letterSpacing:
              '0.35em',

            textTransform:
              'uppercase',

            color:
              'var(--gold)',

            cursor:
              'pointer',

            opacity: 0.8,

            transition:
              'opacity 0.3s ease',
          }}

          onMouseEnter={(e) =>
            (e.currentTarget.style.opacity =
              '1')
          }

          onMouseLeave={(e) =>
            (e.currentTarget.style.opacity =
              '0.8')
          }
        >
          {isMuted
            ? '♪ UNMUTE'
            : '♪ MUTE'}
        </button>
      )}
    </section>
  );
}
