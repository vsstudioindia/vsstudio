'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

/* ─────────────────────────────── data ────────────────────────────────────── */
const MOODS = {
  cinematic: {
    label: 'Cinematic', word: 'beat.',
    ac: '#7a9acc', rgb: '122,154,204',
    lO: '#0a0f1e', lI: '#3a5080', lF: '#c8d8f8', lT: 'CINEMATIC',
    audio: 'https://res.cloudinary.com/drn6x6hbd/video/upload/v1779518316/ambient-cinematic.wav',
    couples: [
      { name: 'Mansi & Pankaj',   video: 'SauwDq7GAuI', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/cinematic1.jpg' },
      { name: 'Anika & Lokesh',   video: '9BaKgjS0Ojo', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/cinematic2.jpg' },
      { name: 'Tanvi & Pratik',   video: 'K9liiclj-nQ', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/cinematic3.jpg' },
    ],
  },
  crazy: {
    label: 'Fun & Crazy', word: 'energy.',
    ac: '#c45a20', rgb: '196,90,32',
    lO: '#1a0a02', lI: '#7a3010', lF: '#ffd4b8', lT: 'FUN & CRAZY',
    audio: 'https://res.cloudinary.com/drn6x6hbd/video/upload/v1779518580/ambient-crazy.wav',
    couples: [
      { name: 'Yashna & Khusshraj', video: 'rSeB8wjhEF8', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/crazy1.jpg' },
      { name: 'Sakshi & Shubham',   video: 'lwnDJSNwsbg', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/crazy2.jpg' },
      { name: 'Varsha & Vaibhav',   video: '8Ntyks6lwLA', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/crazy3.jpg' },
    ],
  },
  dreamy: {
    label: 'Dreamy', word: 'dream.',
    ac: '#3a9088', rgb: '58,144,136',
    lO: '#041412', lI: '#175850', lF: '#b8f0ec', lT: 'DREAMY',
    audio: 'https://res.cloudinary.com/drn6x6hbd/video/upload/v1779518675/ambient-dreamy.wav',
    couples: [
      { name: 'Shristi & Umang', video: 'CUndAidphCE', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/dreamy1.jpg' },
      { name: 'Rashi & Hrithik', video: 'nR64RseSB6U', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/dreamy2.jpg' },
      { name: 'Kritika & Karan',  video: 'Xz-x7G-vy54', img: 'https://res.cloudinary.com/drn6x6hbd/image/upload/dreamy3.jpg' },
    ],
  },
};

const GROOVE_RINGS = Array.from({ length: 17 }, (_, i) => ({
  r:  509 - i * 14,
  op: (0.072 - i * 0.00388).toFixed(4),
  sw: (1.2   - i * 0.0375 ).toFixed(2),
}));

const CARD_CONFIG = [
  { top: 0,   left: 0,   anim: 'fa 5.5s ease-in-out infinite'       },
  { top: 76,  left: 148, anim: 'fb 4.8s ease-in-out -0.8s infinite' },
  { top: 168, left: 24,  anim: 'fc 6s   ease-in-out -2s   infinite' },
];

/* ─────────────────────────────── AlbumCard ───────────────────────────────── */
function AlbumCard({ couple, cfg, acColor, moodLabel, onClick, isMobile }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="hov"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:     isMobile ? 'relative' : 'absolute',
        top:          isMobile ? 'auto' : cfg.top,
        left:         isMobile ? 'auto' : cfg.left,
        width:        isMobile ? '100%' : '168px',
        height:       isMobile ? '200px' : '168px',
        borderRadius: '3px',
        overflow:     'hidden',
        cursor:       isMobile ? 'pointer' : 'none',
        animation:    isMobile ? 'none' : cfg.anim,
        outline:      hov ? `1px solid ${acColor}` : '1px solid transparent',
        transition:   'outline 0.3s ease',
        willChange:   isMobile ? 'auto' : 'transform',
      }}
    >
      <img
        src={couple.img}
        alt={couple.name}
        style={{
          display:    'block',
          width:      '100%',
          height:     '100%',
          objectFit:  'cover',
          filter:     hov ? 'brightness(0.9) saturate(1.05)' : 'brightness(0.68) saturate(0.78)',
          transition: 'filter 0.35s ease',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,4,6,0.85) 0%, rgba(4,4,6,0.08) 60%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 100%)' }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -62%)',
        width: '48px', height: '48px',
        border: `1px solid ${acColor}`, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hov ? 1 : 0, transition: 'opacity 0.3s ease',
      }}>
        <div style={{ width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `13px solid ${acColor}`, marginLeft: '3px' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '12px', left: '10px', right: '10px' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '13px', fontWeight: 300, color: '#f0ead8', lineHeight: 1.2, marginBottom: '4px' }}>
          {couple.name}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: acColor, opacity: 0.8 }}>
          {moodLabel}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────── Lightbox ────────────────────────────────── */
function Lightbox({ video, name, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 16); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: visible ? 'rgba(4,4,6,0.95)' : 'transparent', opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease, background 0.4s ease' }}
    >
      <button
        className="hov"
        onClick={onClose}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.28')}
        style={{ position: 'absolute', top: '32px', right: '40px', background: 'none', border: 'none', cursor: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#f0ead8', opacity: 0.28, fontFamily: "'Montserrat', sans-serif", fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', transition: 'opacity 0.25s ease' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="2" x2="2"  y2="14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Close
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '92vw', maxWidth: '1400px' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c9a84c', opacity: 0.65, marginBottom: '12px' }}>
          VS Studio — Wedding Film
        </p>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 200, fontSize: 'clamp(28px,4vw,52px)', color: '#f0ead8', marginBottom: '24px' }}>
          {name}
        </h3>
        <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────── RecordPlayer ────────────────────────────── */
export default function RecordPlayer() {
  const [activeMood,    setActiveMood]    = useState('cinematic');
  const [isMuted,       setIsMuted]       = useState(false);
  const [lightboxVideo, setLightboxVideo] = useState(null);
  const [lightboxName,  setLightboxName]  = useState('');
  const isMobile = useMobile();

  const sectionRef    = useRef(null);
  const audioRef      = useRef(null);
  const activeMoodRef = useRef('cinematic');
  const isMutedRef    = useRef(false);
  const fadeRef       = useRef(null);

  useEffect(() => { activeMoodRef.current = activeMood; }, [activeMood]);

  /* ── Visibility helper ──────────────────────────────────────────────────── */
  function getVisibility() {
    const sec = sectionRef.current;
    if (!sec) return 0;
    const rect    = sec.getBoundingClientRect();
    const wh      = window.innerHeight;
    const visible = Math.max(0, Math.min(rect.bottom, wh) - Math.max(rect.top, 0));
    return Math.min(1, visible / wh);
  }

  /* ── Audio: start / stop ────────────────────────────────────────────────── */
  function startAmbient(mood) {
    if (isMutedRef.current) return;
    const el = audioRef.current;
    if (!el) return;
    el.src    = MOODS[mood].audio;
    el.volume = 0;
    el.load();
    el.play().catch(console.log);
    el.volume = getVisibility() * 0.28;
  }

  function stopAmbient() {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }

  /* ── Preload on mount — do NOT call play() ──────────────────────────────── */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src    = MOODS['cinematic'].audio;
    el.volume = 0;
    el.load();
    return () => clearInterval(fadeRef.current);
  }, []);

  /* ── IntersectionObserver — auto-play on section entry ──────────────────── */
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAmbient(activeMoodRef.current);
          } else {
            stopAmbient();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  /* ── Scroll-based volume ────────────────────────────────────────────────── */
  useEffect(() => {
    function onScroll() {
      const el = audioRef.current;
      if (!el || el.paused || isMutedRef.current) return;
      el.volume = getVisibility() * 0.28;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Mood change — fade out → swap src → fade in ────────────────────────── */
  function handleMoodChange(key) {
    if (key === activeMood) return;
    setActiveMood(key);
    activeMoodRef.current = key;

    const el = audioRef.current;
    if (!el || el.paused) return;

    clearInterval(fadeRef.current);
    const startVol  = el.volume;
    const fadeStart = Date.now();

    fadeRef.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - fadeStart) / 300);
      el.volume = startVol * (1 - t);
      if (t >= 1) {
        clearInterval(fadeRef.current);
        el.src    = MOODS[key].audio;
        el.volume = 0;
        el.load();
        el.play().catch(console.log);
        const targetVol = getVisibility() * 0.28;
        const inStart   = Date.now();
        fadeRef.current = setInterval(() => {
          const t2 = Math.min(1, (Date.now() - inStart) / 500);
          el.volume = t2 * targetVol;
          if (t2 >= 1) clearInterval(fadeRef.current);
        }, 16);
      }
    }, 16);
  }

  /* ── Mute toggle ────────────────────────────────────────────────────────── */
  function handleMuteToggle() {
    const el = audioRef.current;
    if (!el) return;
    if (isMuted) {
      isMutedRef.current = false;
      setIsMuted(false);
      el.volume = getVisibility() * 0.28;
    } else {
      isMutedRef.current = true;
      setIsMuted(true);
      el.volume = 0;
    }
  }

  /* ── Lightbox ───────────────────────────────────────────────────────────── */
  function openLightbox(video, name) {
    setLightboxVideo(video);
    setLightboxName(name);
    const el = audioRef.current;
    if (!el || el.paused) return;
    clearInterval(fadeRef.current);
    const startVol  = el.volume;
    const fadeStart = Date.now();
    fadeRef.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - fadeStart) / 600);
      el.volume = startVol * (1 - t);
      if (t >= 1) { el.volume = 0; clearInterval(fadeRef.current); }
    }, 16);
  }

  function closeLightbox() {
    setLightboxVideo(null);
    setLightboxName('');
    const el = audioRef.current;
    if (!el || el.paused || isMutedRef.current) return;
    clearInterval(fadeRef.current);
    const targetVol = getVisibility() * 0.28;
    const fadeStart = Date.now();
    fadeRef.current = setInterval(() => {
      const t = Math.min(1, (Date.now() - fadeStart) / 600);
      el.volume = t * targetVol;
      if (t >= 1) { el.volume = targetVol; clearInterval(fadeRef.current); }
    }, 16);
  }

  const mood = MOODS[activeMood];

  return (
    <>
      <audio ref={audioRef} loop />
      <style>{`
        @keyframes bigSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes haloBreath {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1;   }
        }
        @keyframes fa {
          0%, 100% { transform: translateY(0px)  rotate(-1.5deg); }
          50%      { transform: translateY(-15px) rotate(1deg);    }
        }
        @keyframes fb {
          0%, 100% { transform: translateY(0px)  rotate(1deg);    }
          50%      { transform: translateY(-15px) rotate(-1.2deg); }
        }
        @keyframes fc {
          0%, 100% { transform: translateY(0px)  rotate(-0.8deg); }
          50%      { transform: translateY(-15px) rotate(1.5deg);  }
        }

      `}</style>

      <section
        id="films"
        ref={sectionRef}
        style={{
          position:  'relative',
          width:     '100%',
          minHeight: isMobile ? 'auto' : '100vh',
          overflow:  isMobile ? 'visible' : 'hidden',
          background:'#060808',
          '--ac':    mood.ac,
        }}
      >
        {/* ══ LEFT — VINYL STAGE (hidden on mobile) ═══════════════════════ */}
        <div style={{ display: isMobile ? 'none' : 'block', position: 'absolute', inset: 0, overflow: 'hidden' }}>

          {/* Ambient depth glow */}
          <div style={{
            position: 'absolute', width: '1100px', height: '1100px',
            borderRadius: '50%', top: '50%', left: '-395px', marginTop: '-550px',
            zIndex: 0, pointerEvents: 'none',
            background: `radial-gradient(circle at center, rgba(${mood.rgb},0.07) 0%, rgba(${mood.rgb},0.04) 38%, rgba(${mood.rgb},0.015) 58%, transparent 70%)`,
          }} />

          {/* Halo ring glow */}
          <div style={{
            position: 'absolute', width: '1100px', height: '1100px',
            borderRadius: '50%', top: '50%', left: '-395px', marginTop: '-550px',
            zIndex: 1, pointerEvents: 'none',
            animation: 'haloBreath 4s ease-in-out infinite',
            background: `radial-gradient(circle at center, transparent 0%, transparent 35%, rgba(${mood.rgb},0.04) 39%, rgba(${mood.rgb},0.16) 43%, rgba(${mood.rgb},0.22) 46%, rgba(${mood.rgb},0.16) 49%, rgba(${mood.rgb},0.07) 54%, rgba(${mood.rgb},0.02) 61%, transparent 68%)`,
          }} />

          {/* Grain texture */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 6, opacity: 0.028, pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px',
          }} />

          {/* ── Vinyl disc ─────────────────────────────────────────────── */}
          <svg
            viewBox="0 0 1040 1040"
            style={{
              position: 'absolute', width: '1040px', height: '1040px',
              top: '50%', left: '-380px', marginTop: '-520px',
              borderRadius: '50%', zIndex: 4, pointerEvents: 'none',
              animation: 'bigSpin 9s linear infinite',
            }}
          >
            <defs>
              <radialGradient id="vg" cx="40%" cy="36%" r="60%">
                <stop offset="0%"   stopColor="#1e1e1e" />
                <stop offset="100%" stopColor="#050505" />
              </radialGradient>
            </defs>
            <circle cx={520} cy={520} r={518} fill="url(#vg)" />
            {GROOVE_RINGS.map(({ r, op, sw }) => (
              <circle key={r} cx={520} cy={520} r={r} fill="none" stroke={`rgba(255,255,255,${op})`} strokeWidth={sw} />
            ))}
            <circle cx={520} cy={520} r={128} fill={mood.lO} />
            <circle cx={520} cy={520} r={108} fill={mood.lI} />
            <text x={520} y={511} fontFamily="Montserrat,sans-serif" fontSize={19} fontWeight={200} letterSpacing={4} fill={mood.lF} textAnchor="middle">{mood.lT}</text>
            <text x={520} y={535} fontFamily="Montserrat,sans-serif" fontSize={12} fill={mood.lF} textAnchor="middle" opacity={0.55}>VS STUDIO</text>
            <circle cx={520} cy={520} r={11} fill="#050505" />
            <ellipse cx={385} cy={355} rx={72} ry={44} fill="rgba(255,255,255,0.042)" transform="rotate(-30 385 355)" />
          </svg>

          {/* Static sheen overlay */}
          <div style={{
            position: 'absolute', width: '1040px', height: '1040px',
            top: '50%', left: '-380px', marginTop: '-520px',
            borderRadius: '50%', zIndex: 5, pointerEvents: 'none',
            background: 'linear-gradient(125deg, rgba(255,255,255,0.06) 0%, transparent 38%, rgba(0,0,0,0.22) 100%)',
          }} />

          {/* Edge fades */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '110px', zIndex: 7, pointerEvents: 'none', background: 'linear-gradient(180deg, #060808 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '110px', zIndex: 7, pointerEvents: 'none', background: 'linear-gradient(0deg, #060808 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100px', zIndex: 7, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent 0%, rgba(6,8,8,0.85) 100%)' }} />
        </div>

        {/* ══ RIGHT — CONTENT PANEL ═══════════════════════════════════════ */}
        <div style={{
          position:      isMobile ? 'relative' : 'absolute',
          right:         isMobile ? 'auto' : 0,
          top:           isMobile ? 'auto' : 0,
          bottom:        isMobile ? 'auto' : 0,
          width:         isMobile ? '100%' : '44%',
          zIndex:        20,
          padding:       isMobile ? '72px 24px 60px' : 'clamp(48px,6vh,80px) 64px clamp(48px,6vh,80px) 48px',
          display:       'flex',
          flexDirection: 'column',
          justifyContent:'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(90deg, transparent 0%, rgba(6,8,8,0.45) 40%, rgba(6,8,8,0.7) 100%)' }} />

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '8px', letterSpacing: '0.48em', textTransform: 'uppercase', color: 'var(--ac)', opacity: 0.65, marginBottom: '20px' }}>
            02 — Pick Your Mood
          </p>

          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,3.8vw,56px)', fontWeight: 200, fontStyle: 'italic', color: '#f0ead8', lineHeight: 1.2, marginBottom: '12px' }}>
            Every love story has a different <span style={{ color: mood.ac }}>{mood.word}</span>
          </h2>

          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: '#f0ead8', opacity: 0.25, marginBottom: '36px', letterSpacing: '0.08em' }}>
            Select a mood. Choose a story. Let it play.
          </p>

          {/* Mood tabs */}
          <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '44px' }}>
            {Object.entries(MOODS).map(([key, m]) => (
              <button
                key={key}
                className="hov"
                onClick={() => handleMoodChange(key)}
                style={{
                  background:   'none', border: 'none', padding: '0 0 12px',
                  fontFamily:   "'Montserrat', sans-serif",
                  fontSize:     '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
                  cursor:       'none',
                  color:        key === activeMood ? m.ac : '#f0ead8',
                  opacity:      key === activeMood ? 1 : 0.28,
                  borderBottom: key === activeMood ? `1px solid ${m.ac}` : '1px solid transparent',
                  marginBottom: '-1px',
                  transition:   'opacity 0.3s ease, color 0.3s ease',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Album cards */}
          <div style={{
            position:      isMobile ? 'relative' : 'relative',
            height:        isMobile ? 'auto' : 'clamp(240px,30vh,340px)',
            display:       isMobile ? 'flex' : 'block',
            flexDirection: 'column',
            gap:           isMobile ? '10px' : '0',
          }}>
            {mood.couples.map((couple, i) => (
              <AlbumCard
                key={`${activeMood}-${i}`}
                couple={couple}
                cfg={CARD_CONFIG[i]}
                acColor={mood.ac}
                moodLabel={mood.label}
                onClick={() => openLightbox(couple.video, couple.name)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* ── Mute toggle ───────────────────────────────────────────────── */}
        <button
          onClick={handleMuteToggle}
          style={{
            position:      isMobile ? 'relative' : 'absolute',
            bottom:        isMobile ? 'auto' : '32px',
            right:         isMobile ? 'auto' : '32px',
            alignSelf:     isMobile ? 'flex-start' : 'auto',
            margin:        isMobile ? '20px 24px 40px' : '0',
            zIndex:        30,
            background:    'transparent',
            border:        '1px solid rgba(201,168,76,0.4)',
            color:         '#c9a84c',
            fontFamily:    "'Montserrat', sans-serif",
            fontWeight:    300,
            fontSize:      '8px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            padding:       '12px 24px',
            cursor:        'pointer',
            transition:    'border-color 0.3s, background 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#c9a84c')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)')}
        >
          {isMuted ? '♪ UNMUTE' : '♪ MUTE'}
        </button>
      </section>

      {lightboxVideo && (
        <Lightbox video={lightboxVideo} name={lightboxName} onClose={closeLightbox} />
      )}
    </>
  );
}
