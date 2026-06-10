'use client';

import { useEffect, useRef, useState } from 'react';
import { useMobile } from '../lib/useMobile';

const CDN = 'https://res.cloudinary.com/drn6x6hbd/image/upload/';

const CATEGORIES = [
  {
    key:    'editorial',
    label:  'Editorial',
    images: [
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465744/sphere1.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465743/sphere2.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465741/sphere3.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465743/sphere4.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465744/sphere5.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465744/sphere6.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465745/sphere7.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465742/sphere8.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465742/sphere9.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465742/sphere10.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465742/sphere11.jpg',
      'https://res.cloudinary.com/drn6x6hbd/image/upload/v1779465742/sphere12.jpg',
    ],
  },
  {
    key:    'friends',
    label:  'Friends & Family',
    images: Array.from({ length: 12 }, (_, i) => `${CDN}ff${i + 1}.jpg`),
  },
  {
    key:    'storytelling',
    label:  'Story-telling',
    images: Array.from({ length: 12 }, (_, i) => `${CDN}story${i + 1}.jpg`),
  },
];

const R     = 360;  /* sphere radius */
const FOV   = 900;  /* perspective distance */
const T_H   = 200;  /* horizontal spread of triangle */
const LERP  = 0.055; /* ~0.8s transition at 60fps */

/* Base node layout — 12 fibonacci points on a unit sphere, scaled by R */
const BASE_NODES = Array.from({ length: 12 }, (_, i) => {
  const total = 12;
  const y     = 1 - (i / (total - 1)) * 2;
  const r     = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return {
    ox: r * Math.cos(theta) * R,
    oy: y * R,
    oz: r * Math.sin(theta) * R,
    w:  270 + (i % 3) * 60,
    h:  360 + (i % 4) * 45,
    index: i,
  };
});

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rotateX(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateY(x, y, z, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}

export default function Sphere() {
  const canvasRef      = useRef(null);
  const rafRef         = useRef(null);
  const allImagesRef   = useRef({});
  const triangleRef    = useRef({ angle: 0, targetAngle: 0 });
  const activeCatRef   = useRef(0);
  const mouseRef       = useRef({ x: -9999, y: -9999 });
  const spherePosRef   = useRef([]);
  const touchStartRef  = useRef({ x: 0, y: 0 }); /* for tap detection */

  const sphereRots = useRef([
    { rotX: 0.18, rotY: 0,    velX: 0, velY: 0.003,  isDragging: false, lastMX: 0, lastMY: 0, focusedNode: -1, seekStartTime: null, seekDuration: 600, seekStartRotX: 0, seekStartRotY: 0, seekTargetRotX: 0, seekTargetRotY: 0 },
    { rotX: 0.22, rotY: 2.09, velX: 0, velY: 0.0028, isDragging: false, lastMX: 0, lastMY: 0, focusedNode: -1, seekStartTime: null, seekDuration: 600, seekStartRotX: 0, seekStartRotY: 0, seekTargetRotX: 0, seekTargetRotY: 0 },
    { rotX: 0.15, rotY: 4.19, velX: 0, velY: 0.0032, isDragging: false, lastMX: 0, lastMY: 0, focusedNode: -1, seekStartTime: null, seekDuration: 600, seekStartRotX: 0, seekStartRotY: 0, seekTargetRotX: 0, seekTargetRotY: 0 },
  ]);

  const [activeCategory, setActiveCategory] = useState('editorial');
  const [allLoaded,      setAllLoaded]      = useState(false);
  const isMobile = useMobile();

  /* ── Preload every category's images once on mount ───────────────────────── */
  useEffect(() => {
    let done = 0;
    const total = CATEGORIES.reduce((s, c) => s + c.images.length, 0);
    CATEGORIES.forEach((cat) => {
      const imgs = cat.images.map((src) => {
        const img = new Image();
        img.src = src;
        img.onload = img.onerror = () => {
          done++;
          if (done === total) setAllLoaded(true);
        };
        return img;
      });
      allImagesRef.current[cat.key] = imgs;
    });
  }, []);

  /* ── Update active index + triangle target angle on category change ──────── */
  useEffect(() => {
    const idx    = CATEGORIES.findIndex((c) => c.key === activeCategory);
    activeCatRef.current = idx;
    const rawTarget = -idx * (2 * Math.PI / 3);
    const tr    = triangleRef.current;
    let   diff  = rawTarget - tr.angle;
    while (diff >  Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    tr.targetAngle = tr.angle + diff;
  }, [activeCategory]);

  /* ── Main canvas loop ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!allLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function drawSphere(catKey, cx, cy, sphScale, alpha, isActive) {
      const imgs  = allImagesRef.current[catKey] || [];
      const si    = CATEGORIES.findIndex((c) => c.key === catKey);
      const sr    = sphereRots.current[si];
      const mX    = mouseRef.current.x;
      const mY    = mouseRef.current.y;
      const R_eff = R * sphScale;

      ctx.save();
      ctx.globalAlpha = alpha;

      const projected = BASE_NODES.map((n) => {
        let [x, y, z] = rotateX(n.ox * sphScale, n.oy * sphScale, n.oz * sphScale, sr.rotX);
        [x, y, z]     = rotateY(x, y, z, sr.rotY);
        const depth   = (z + R_eff) / (2 * R_eff);
        const scale   = FOV / (FOV + z);
        const sx      = cx + x * scale;
        const sy      = cy + y * scale;
        return { ...n, sx, sy, z, scale, depth };
      });

      projected.sort((a, b) => a.z - b.z);

      let hoveredNode = -1;
      if (isActive) {
        for (let i = projected.length - 1; i >= 0; i--) {
          const n  = projected[i];
          const hw = (n.w * n.scale * sphScale) / 2;
          const hh = (n.h * n.scale * sphScale) / 2;
          if (mX >= n.sx - hw && mX <= n.sx + hw && mY >= n.sy - hh && mY <= n.sy + hh) {
            hoveredNode = n.index; break;
          }
        }
      }

      projected.forEach((n) => {
        const isHov      = isActive && n.index === hoveredNode;
        const sc         = n.scale * sphScale * (isHov ? 1.15 : 1);
        const w          = n.w * sc;
        const h          = n.h * sc;
        const brightness = Math.min(1, 0.45 + n.depth * 0.55 + (isHov ? 0.2 : 0));
        const blur       = isHov ? 0 : Math.max(0, (1 - n.depth) * 2.5);

        ctx.save();
        ctx.translate(n.sx, n.sy);
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w, h);
        ctx.clip();

        ctx.filter = `brightness(${brightness}) saturate(0.88)${blur > 0 ? ` blur(${blur.toFixed(1)}px)` : ''}`;
        const img = imgs[n.index];
        if (img && img.complete && img.naturalWidth > 0) {
          const imgRatio  = img.naturalWidth / img.naturalHeight;
          const cardRatio = w / h;
          let drawW, drawH;
          if (imgRatio > cardRatio) { drawW = w; drawH = w / imgRatio; }
          else                      { drawH = h; drawW = h * imgRatio; }
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
          ctx.fillStyle = '#111';
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }
        ctx.filter = 'none';

        if (!isHov) {
          const vigAlpha = (1 - n.depth) * 0.45;
          if (vigAlpha > 0.01) {
            ctx.fillStyle = `rgba(6,6,6,${vigAlpha.toFixed(3)})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);
          }
        }
        ctx.restore();
      });

      ctx.restore();
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const tr  = triangleRef.current;
      const cX  = W * 0.44;
      const cY  = H / 2;

      const sphereData = CATEGORIES.map((cat, i) => {
        const phi      = tr.angle + i * (2 * Math.PI / 3);
        const depth    = Math.cos(phi);
        const cx       = cX + Math.sin(phi) * T_H;
        const sphScale = 0.45 + 0.55 * (depth + 1) / 2;
        const alpha    = 0.40 + 0.60 * (depth + 1) / 2;
        const isActive = i === activeCatRef.current;
        return { catKey: cat.key, cx, cy: cY, sphScale, alpha, isActive, depth };
      });

      spherePosRef.current = sphereData.map(({ cx, cy, sphScale }, i) => ({ cx, cy, sphScale, index: i }));

      sphereData
        .slice()
        .sort((a, b) => a.depth - b.depth)
        .forEach(({ catKey, cx, cy, sphScale, alpha, isActive }) =>
          drawSphere(catKey, cx, cy, sphScale, alpha, isActive)
        );
    }

    function tick() {
      const tr = triangleRef.current;
      tr.angle += (tr.targetAngle - tr.angle) * LERP;

      sphereRots.current.forEach((sr) => {
        if (sr.isDragging) {
          sr.rotY += sr.velY;
          sr.rotX += sr.velX;
          sr.rotX  = Math.max(-1.1, Math.min(1.1, sr.rotX));
        } else if (sr.seekStartTime !== null) {
          const t     = Math.min(1, (performance.now() - sr.seekStartTime) / sr.seekDuration);
          const eased = easeInOutCubic(t);
          sr.rotX = sr.seekStartRotX + (sr.seekTargetRotX - sr.seekStartRotX) * eased;
          sr.rotY = sr.seekStartRotY + (sr.seekTargetRotY - sr.seekStartRotY) * eased;
          if (t >= 1) { sr.rotX = sr.seekTargetRotX; sr.rotY = sr.seekTargetRotY; sr.seekStartTime = null; }
        } else {
          sr.velY += (0.004 - sr.velY) * 0.02;
          sr.velX += (0      - sr.velX) * 0.04;
          sr.rotY += sr.velY;
          sr.rotX += sr.velX;
          sr.rotX  = Math.max(-1.1, Math.min(1.1, sr.rotX));
          sr.velX *= 0.92;
          sr.velY *= 0.97;
        }
      });

      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = 780;
    }
    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(tick);

    /* ── Hit-test: find sphere index under canvas coords mx, my ──────────── */
    function hitSphere(mx, my) {
      let hitIdx = -1;
      let minDist = Infinity;
      spherePosRef.current.forEach(({ cx, cy, sphScale, index }) => {
        const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
        if (dist < R * sphScale * 1.4 && dist < minDist) {
          minDist = dist;
          hitIdx  = index;
        }
      });
      return hitIdx;
    }

    /* ── Shared card-select logic (used by click and tap) ─────────────────── */
    function triggerCardSelect(mx, my) {
      const sphIdx = hitSphere(mx, my);
      if (sphIdx < 0) return;

      const sr  = sphereRots.current[sphIdx];
      const pos = spherePosRef.current[sphIdx];
      const { cx, cy, sphScale } = pos;

      const projected = BASE_NODES.map((n) => {
        let [x, y, z] = rotateX(n.ox * sphScale, n.oy * sphScale, n.oz * sphScale, sr.rotX);
        [x, y, z]     = rotateY(x, y, z, sr.rotY);
        const scale   = FOV / (FOV + z);
        return { ...n, sx: cx + x * scale, sy: cy + y * scale, z, scale };
      });
      projected.sort((a, b) => b.z - a.z);

      let hitNode = null;
      for (const n of projected) {
        const hw = (n.w * n.scale * sphScale) / 2;
        const hh = (n.h * n.scale * sphScale) / 2;
        if (mx >= n.sx - hw && mx <= n.sx + hw && my >= n.sy - hh && my <= n.sy + hh) {
          hitNode = n; break;
        }
      }

      if (!hitNode || sr.focusedNode === hitNode.index) {
        sr.focusedNode   = -1;
        sr.seekStartTime = null;
        return;
      }

      const ux = hitNode.ox / R;
      const uy = hitNode.oy / R;
      const uz = hitNode.oz / R;
      let dY   = Math.atan2(-ux, uz) - (sr.rotY % (2 * Math.PI));
      if (dY >  Math.PI) dY -= 2 * Math.PI;
      if (dY < -Math.PI) dY += 2 * Math.PI;

      sr.focusedNode    = hitNode.index;
      sr.seekStartRotX  = sr.rotX;
      sr.seekStartRotY  = sr.rotY;
      sr.seekTargetRotX = -Math.asin(uy);
      sr.seekTargetRotY = sr.rotY + dY;
      sr.seekStartTime  = performance.now();
    }

    /* ── Mouse interaction ─────────────────────────────────────────────── */
    let wasDragging = false;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      sphereRots.current.forEach((sr) => {
        if (sr.isDragging) {
          const dx  = e.clientX - sr.lastMX;
          const dy  = e.clientY - sr.lastMY;
          sr.velY   = dx * 0.008;
          sr.velX   = dy * 0.008;
          sr.lastMX = e.clientX;
          sr.lastMY = e.clientY;
          wasDragging = true;
        }
      });
    }
    function onMouseDown(e) {
      wasDragging = false;
      const rect = canvas.getBoundingClientRect();
      const idx  = hitSphere(e.clientX - rect.left, e.clientY - rect.top);
      const sr   = sphereRots.current[idx >= 0 ? idx : activeCatRef.current];
      sr.isDragging = true;
      sr.lastMX     = e.clientX;
      sr.lastMY     = e.clientY;
    }
    function onClick(e) {
      if (wasDragging) return;
      const rect = canvas.getBoundingClientRect();
      triggerCardSelect(e.clientX - rect.left, e.clientY - rect.top);
    }
    function onMouseUp() {
      sphereRots.current.forEach((sr) => { sr.isDragging = false; });
    }
    function onMouseLeave() {
      sphereRots.current.forEach((sr) => { sr.isDragging = false; });
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    /* ── Touch interaction ─────────────────────────────────────────────── */
    function onTouchStart(e) {
      const rect = canvas.getBoundingClientRect();
      const t    = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      const idx  = hitSphere(t.clientX - rect.left, t.clientY - rect.top);
      const sr   = sphereRots.current[idx >= 0 ? idx : activeCatRef.current];
      sr.isDragging = true;
      sr.lastMX     = t.clientX;
      sr.lastMY     = t.clientY;
    }
    function onTouchMove(e) {
      e.preventDefault();
      const t = e.touches[0];
      sphereRots.current.forEach((sr) => {
        if (sr.isDragging) {
          const dx  = t.clientX - sr.lastMX;
          const dy  = t.clientY - sr.lastMY;
          sr.velY   = dx * 0.008;
          sr.velX   = dy * 0.008;
          sr.lastMX = t.clientX;
          sr.lastMY = t.clientY;
        }
      });
    }
    function onTouchEnd(e) {
      const t  = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      sphereRots.current.forEach((sr) => { sr.isDragging = false; });
      /* Tap: minimal movement → trigger card select */
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        const rect = canvas.getBoundingClientRect();
        triggerCardSelect(t.clientX - rect.left, t.clientY - rect.top);
      }
    }

    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click',      onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click',      onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, [allLoaded]);

  /* ── Category button style ───────────────────────────────────────────────── */
  const catBtnStyle = (key, vertical) => ({
    background:      'none',
    border:          'none',
    padding:         vertical ? '12px 0 12px 16px' : '0 0 10px',
    borderLeft:      vertical
      ? (key === activeCategory ? '2px solid #c9a84c' : '2px solid transparent')
      : 'none',
    borderBottom:    vertical
      ? 'none'
      : (key === activeCategory ? '1px solid #c9a84c' : '1px solid transparent'),
    marginBottom:    vertical ? 0 : '-1px',
    fontFamily:      "'Montserrat', sans-serif",
    fontSize:        '9px',
    letterSpacing:   key === activeCategory ? '0.28em' : '0.22em',
    textTransform:   'uppercase',
    cursor:          'pointer',
    color:           key === activeCategory ? '#c9a84c' : 'var(--ivory)',
    opacity:         key === activeCategory ? 1 : 0.4,
    textAlign:       vertical ? 'left' : 'center',
    transform:       key === activeCategory ? 'scale(1.12)' : 'scale(1)',
    transformOrigin: vertical ? 'left center' : 'center bottom',
    transition:      'opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.3s ease, letter-spacing 0.3s ease',
    whiteSpace:      'nowrap',
  });

  return (
    <section
      id="showcase"
      style={{ background: 'var(--black2)', paddingTop: isMobile ? '72px' : '110px' }}
    >
      {isMobile ? (
        <>
          {/* Mobile: header */}
          <div style={{ padding: '0 24px 20px' }}>
            <p style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontSize:      '0.6rem',
              fontWeight:    300,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
              opacity:       0.6,
            }}>
              01 — The Collection
            </p>
          </div>

          {/* Mobile: horizontal category tabs with gold dot indicator */}
          <div style={{
            display:      'flex',
            gap:          '28px',
            padding:      '0 24px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '28px',
            overflowX:    'auto',
          }}>
            {CATEGORIES.map((cat) => (
              <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button onClick={() => setActiveCategory(cat.key)} style={catBtnStyle(cat.key, false)}>
                  {cat.label}
                </button>
                {/* Glowing dot beneath active tab */}
                <div style={{
                  width:        '4px',
                  height:       '4px',
                  borderRadius: '50%',
                  background:   '#c9a84c',
                  marginTop:    '4px',
                  opacity:      cat.key === activeCategory ? 1 : 0,
                  boxShadow:    cat.key === activeCategory ? '0 0 8px rgba(201,168,76,0.8)' : 'none',
                  transition:   'opacity 0.3s ease, box-shadow 0.3s ease',
                }} />
              </div>
            ))}
          </div>

          {/* Mobile: canvas sphere — touch drag and tap to select */}
          <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: '780px', touchAction: 'none' }}
          />
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>

          {/* Left: section header + vertical category menu */}
          <div style={{
            width:         '220px',
            flexShrink:    0,
            padding:       '0 0 48px 56px',
            display:       'flex',
            flexDirection: 'column',
          }}>
            <p style={{
              fontFamily:    "'Montserrat', sans-serif",
              fontSize:      '0.6rem',
              fontWeight:    300,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
              opacity:       0.6,
              marginBottom:  '40px',
            }}>
              01 — The Collection
            </p>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  className="hov"
                  onClick={() => setActiveCategory(cat.key)}
                  style={catBtnStyle(cat.key, true)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: three-sphere canvas */}
          <div style={{ flex: 1, padding: '0 44px 0 0' }}>
            <canvas
              ref={canvasRef}
              className="hov"
              style={{ display: 'block', width: '100%', height: '780px', cursor: 'none' }}
            />
          </div>

        </div>
      )}
    </section>
  );
}
