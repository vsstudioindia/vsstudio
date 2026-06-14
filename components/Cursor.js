'use client';

import { useEffect, useRef } from 'react';

/* Linear interpolation helper */
const lerp = (a, b, t) => a + (b - a) * t;

export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX, dotY = mouseY;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      dotX = lerp(dotX, mouseX, 0.14);
      dotY = lerp(dotY, mouseY, 0.14);
      dot.style.left = `${dotX}px`;
      dot.style.top  = `${dotY}px`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);

    const onOver = (e) => { if (e.target.closest('a, button, .hov')) dot.classList.add('hov'); };
    const onOut  = (e) => { if (e.target.closest('a, button, .hov')) dot.classList.remove('hov'); };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
    };
  }, []);

  return <div id="cur-dot" ref={dotRef} />;
}
