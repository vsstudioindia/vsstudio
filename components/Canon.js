'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

const VIDEOS = [
  {
    src: 'https://www.youtube.com/embed/wV8IyWrtHBE?rel=0&modestbranding=1&controls=0&playsinline=1&mute=1&autoplay=1&loop=1&playlist=wV8IyWrtHBE&enablejsapi=1',
    name: 'Light & Emotion',
  },
  {
    src: 'https://www.youtube.com/embed/sV98uABCY6E?rel=0&modestbranding=1&controls=0&playsinline=1&mute=1&enablejsapi=1',
    name: 'The Craft of Seeing',
  },
];

export default function Canon() {
  const [activeIdx, setActiveIdx] = useState(0);
  const isMobile = useMobile();

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRefs = useRef([]);
  const timerRef = useRef(null);
  const activeIdxRef = useRef(0);

  function goToVid(idx) {
    const sec = sectionRef.current;
    const track = trackRef.current;

    if (!sec || !track) return;

    track.style.transform =
      `translateY(${-idx * sec.offsetHeight}px)`;

    progressRefs.current.forEach((bar, i) => {
      if (!bar) return;

      if (i === idx) {
        bar.style.transition = 'none';
        bar.style.height = '0%';
        bar.offsetHeight;
        bar.style.transition = 'height 30s linear';
        bar.style.height = '100%';
      } else {
        bar.style.transition = 'none';
        bar.style.height = '0%';
      }
    });

    activeIdxRef.current = idx;
    setActiveIdx(idx);

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      goToVid((idx + 1) % VIDEOS.length);
    }, 30000);
  }

  useEffect(() => {
    if (isMobile) return;

    goToVid(0);

    function onResize() {
      const sec = sectionRef.current;
      const track = trackRef.current;

      if (!sec || !track) return;

      track.style.transform =
        `translateY(${-activeIdxRef.current * sec.offsetHeight}px)`;
    }

    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile]);

  return (
    <>
      <style>{`
        #canon {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          position: relative;
        }

        #canon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(201,168,76,0.12),
            transparent
          );
          z-index: 10;
          pointer-events: none;
        }

        .canon-right {
          position: relative;
        }

        .canon-right::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          bottom: 15%;
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(201,168,76,0.15) 30%,
            rgba(201,168,76,0.15) 70%,
            transparent
          );
          pointer-events: none;
        }

        @media (max-width: 767px) {
          #canon {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .canon-right::before {
            display: none;
          }
        }
      `}</style>

      <section id="canon" ref={sectionRef}>

        {/* ══ MOBILE / DESKTOP VIDEO AREA ═══════════════════════════════ */}

        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            height: isMobile ? '100svh' : '100vh',
          }}
        >

          <div
            ref={trackRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transition:
                'transform 0.8s cubic-bezier(.76,0,.24,1)',
            }}
          >

            {(isMobile ? [VIDEOS[0]] : VIDEOS).map((vid, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  height: isMobile ? '100svh' : '100vh',
                  overflow: 'hidden',
                  background: '#000',
                }}
              >

                <iframe
                  src={vid.src}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: isMobile ? '177.78%' : '100%',
                    height: isMobile ? '100%' : '177.78%',
                    transform: 'translate(-50%, -50%)',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                />

                {/* Dark overlay */}
                {!isMobile && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.45)',
                      opacity: activeIdx === i ? 0 : 1,
                      transition: 'opacity 0.6s ease',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Desktop video label ONLY */}
                {!isMobile && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '32px',
                      left: '32px',
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '7px',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        color: '#c9a84c',
                        opacity: 0.55,
                        marginBottom: '6px',
                      }}
                    >
                      Canon India
                    </p>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: 'italic',
                        fontSize: '15px',
                        fontWeight: 300,
                        color: '#f0ead8',
                        opacity: 0.75,
                      }}
                    >
                      {vid.name}
                    </p>
                  </div>
                )}

                {/* Desktop progress bar ONLY */}
                {!isMobile && (
                  <div
                    ref={(el) => {
                      progressRefs.current[i] = el;
                    }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: '2px',
                      height: '0%',
                      background: 'var(--gold)',
                      opacity: 0.6,
                      zIndex: 3,
                    }}
                  />
                )}

              </div>
            ))}

          </div>

          {/* Desktop navigation dots ONLY */}
          {!isMobile && (
            <div
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              {VIDEOS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background:
                      activeIdx === i
                        ? 'var(--gold)'
                        : 'rgba(201,168,76,0.25)',
                    transition: 'background 0.4s ease',
                  }}
                />
              ))}
            </div>
          )}

        </div>

        {/* ══ RIGHT — TEXT ═══════════════════════════════════════════════ */}

        <div
          className="canon-right"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: isMobile
              ? '56px 24px'
              : 'clamp(56px,8vh,100px) 64px',
            background: 'var(--black2)',
          }}
        >

          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '8px',
              letterSpacing: '0.48em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              opacity: 0.65,
              marginBottom: '24px',
            }}
          >
            04 — Craft & Recognition
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 200,
              fontSize: isMobile
                ? 'clamp(48px, 14vw, 72px)'
                : 'clamp(56px, 6vw, 92px)',
              lineHeight: 0.95,
              marginBottom: '36px',
              color: 'var(--ivory)',
            }}
          >
            Canon
            <br />
            <em
              style={{
                color: 'var(--gold)',
                fontStyle: 'italic',
              }}
            >
              Wizards.
            </em>
          </h2>

          {/* Ambassador badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              border: '1px solid rgba(201,168,76,0.22)',
              padding: '10px 20px',
              marginBottom: '36px',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--gold)',
                flexShrink: 0,
              }}
            />

            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '8px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              Official Canon Ambassadors — India
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: '48px',
              height: '1px',
              background: 'var(--gold)',
              opacity: 0.3,
              marginBottom: '36px',
            }}
          />

          {/* Description */}
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px',
              color: 'var(--ivory)',
              opacity: 0.38,
              lineHeight: 2.2,
              maxWidth: '380px',
              marginBottom: '40px',
              letterSpacing: '0.03em',
            }}
          >
            We don't just shoot with Canon — we think with it.
            As official Canon Ambassadors, Vrinda and Shristi are
            among India's most recognised photographers, trusted by
            Canon to represent the craft at its highest level across
            India and beyond.
          </p>

          {/* Signature */}
          <img
            src="https://res.cloudinary.com/drn6x6hbd/image/upload/f_auto,q_auto,w_400,c_limit/v1780633150/Canon.png"
            alt="Vrinda & Shristi"
            loading="lazy"
            decoding="async"
            style={{
              height: 'clamp(80px, 11vw, 154px)',
              width: 'auto',
              objectFit: 'contain',
              alignSelf: 'flex-start',
              opacity: 0.55,
              filter: 'brightness(0) invert(1)',
            }}
          />

        </div>

      </section>
    </>
  );
}
