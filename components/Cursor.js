'use client';

import { useEffect, useRef } from 'react';

/* Linear interpolation helper */
const lerp = (a, b, t) => a + (b - a) * t;

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    /* Raw mouse coords — updated synchronously on mousemove */
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    /* Smoothed positions for each element */
    let dotX = mouseX,  dotY = mouseY;
    let ringX = mouseX, ringY = mouseY;

    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    /* Animate both cursors every frame with different lerp speeds */
    const tick = () => {
      dotX  = lerp(dotX,  mouseX, 0.14);
      dotY  = lerp(dotY,  mouseY, 0.14);
      ringX = lerp(ringX, mouseX, 0.07);
      ringY = lerp(ringY, mouseY, 0.07);

      dot.style.left  = `${dotX}px`;
      dot.style.top   = `${dotY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);

    /* ── Hover state on interactive elements ── */
    const targets = () =>
      document.querySelectorAll('a, button, .hov');

    const addHov = () => {
      dot.classList.add('hov');
      ring.classList.add('hov');
    };
    const removeHov = () => {
      dot.classList.remove('hov');
      ring.classList.remove('hov');
    };

    /* Use event delegation so dynamically-mounted elements are covered */
    const onOver = (e) => {
      if (e.target.closest('a, button, .hov')) addHov();
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .hov')) removeHov();
    };

    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return (
    <>
      <div id="cur-dot"  ref={dotRef}  />
      <div id="cur-ring" ref={ringRef} />
    </>
  );
}
