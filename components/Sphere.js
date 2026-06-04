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
    images: [`${CDN}story1.jpg`, `${CDN}story2.jpg`, `${CDN}story3.jpg`],
  },
];

const R   = 280; /* sphere radius */
const FOV = 900; /* perspective distance */

function fibonacciNode(i, total) {
  const y     = 1 - (i / (total - 1)) * 2;
  const r     = Math.sqrt(1 - y * y);
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return { ox: r * Math.cos(theta), oy: y, oz: r * Math.sin(theta) };
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
  const canvasRef  = useRef(null);
  const stateRef   = useRef({
    rotX: 0.18, rotY: 0,
    velX: 0,    velY: 0.003,
    isDragging: false,
    lastMX: 0,  lastMY: 0,
    hoveredNode: -1,
    mouseX: -9999, mouseY: -9999,
    targetRotX: null, targetRotY: null,
  });
  const imagesRef    = useRef([]);
  const rafRef       = useRef(null);
  const [activeCategory, setActiveCategory] = useState('editorial');
  const [imagesVersion,  setImagesVersion]  = useState(0);
  const isMobile = useMobile();

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);

  /* ── Load images whenever category changes ───────────────────────────────── */
  useEffect(() => {
    let done = 0;
    const paths = activeCat.images;
    const imgs = paths.map((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        console.log('Loaded successfully:', img.src);
        done++;
        if (done === paths.length) { imagesRef.current = imgs; setImagesVersion((v) => v + 1); }
      };
      img.onerror = () => {
        console.log('FAILED to load:', img.src);
        done++;
        if (done === paths.length) { imagesRef.current = imgs; setImagesVersion((v) => v + 1); }
      };
      return img;
    });
  }, [activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Main canvas loop — restarts whenever images change ─────────────────── */
  useEffect(() => {
    if (imagesVersion === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    /* Node geometry — computed once per image set */
    const imgs  = imagesRef.current;
    const count = imgs.length;
    const nodes = imgs.map((_, i) => {
      const { ox, oy, oz } = fibonacciNode(i, count);
      return {
        ox: ox * R, oy: oy * R, oz: oz * R,
        w:  180 + (i % 3) * 40,
        h:  240 + (i % 4) * 30,
        img: imgs[i],
        index: i,
      };
    });

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Project every node */
      const projected = nodes.map((n) => {
        let [x, y, z] = rotateX(n.ox, n.oy, n.oz, s.rotX);
        [x, y, z]     = rotateY(x, y, z, s.rotY);

        const depth  = (z + R) / (2 * R);               /* 0 (back) … 1 (front) */
        const scale  = FOV / (FOV + z);
        const sx     = W / 2 + x * scale;
        const sy     = H / 2 + y * scale;
        return { ...n, sx, sy, z, scale, depth };
      });

      /* Sort back → front */
      projected.sort((a, b) => a.z - b.z);

      /* Hit-test: walk front → back to find topmost hovered card */
      let hit = -1;
      for (let i = projected.length - 1; i >= 0; i--) {
        const n  = projected[i];
        const hw = (n.w * n.scale) / 2;
        const hh = (n.h * n.scale) / 2;
        if (
          s.mouseX >= n.sx - hw && s.mouseX <= n.sx + hw &&
          s.mouseY >= n.sy - hh && s.mouseY <= n.sy + hh
        ) { hit = n.index; break; }
      }
      if (hit !== s.hoveredNode) {
        s.hoveredNode = hit;
      }

      /* Draw each card */
      projected.forEach((n) => {
        const isHov  = n.index === s.hoveredNode;
        const sc     = n.scale * (isHov ? 1.22 : 1);
        const w      = n.w * sc;
        const h      = n.h * sc;
        const brightness = Math.min(1, 0.45 + n.depth * 0.55 + (isHov ? 0.2 : 0));
        const blur   = isHov ? 0 : Math.max(0, (1 - n.depth) * 2.5);

        ctx.save();
        ctx.translate(n.sx, n.sy);

        /* Clip to card rect */
        ctx.beginPath();
        ctx.rect(-w / 2, -h / 2, w, h);
        ctx.clip();

        /* Image — object-fit cover via 9-param drawImage */
        ctx.filter = `brightness(${brightness}) saturate(0.88)${blur > 0 ? ` blur(${blur.toFixed(1)}px)` : ''}`;
        if (n.img.complete && n.img.naturalWidth > 0) {
          const imgRatio  = n.img.naturalWidth / n.img.naturalHeight;
          const cardRatio = w / h;
          let sx, sy, sWidth, sHeight;
          if (imgRatio > cardRatio) {
            /* Image wider than card — fit height, crop width */
            sHeight = n.img.naturalHeight;
            sWidth  = sHeight * cardRatio;
            sx      = (n.img.naturalWidth - sWidth) / 2;
            sy      = 0;
          } else {
            /* Image taller than card — fit width, crop height */
            sWidth  = n.img.naturalWidth;
            sHeight = sWidth / cardRatio;
            sx      = 0;
            sy      = (n.img.naturalHeight - sHeight) / 2;
          }
          ctx.drawImage(n.img, sx, sy, sWidth, sHeight, -w / 2, -h / 2, w, h);
        } else {
          ctx.fillStyle = '#111';
          ctx.fillRect(-w / 2, -h / 2, w, h);
        }
        ctx.filter = 'none';

        /* Depth vignette on non-hovered back cards */
        if (!isHov) {
          const vigAlpha = (1 - n.depth) * 0.45;
          if (vigAlpha > 0.01) {
            ctx.fillStyle = `rgba(6,6,6,${vigAlpha.toFixed(3)})`;
            ctx.fillRect(-w / 2, -h / 2, w, h);
          }
        }

        /* Gold border + shadow on hovered card */
        if (isHov) {
          ctx.restore();
          ctx.save();
          ctx.translate(n.sx, n.sy);
          ctx.shadowColor  = 'rgba(201,168,76,0.35)';
          ctx.shadowBlur   = 32;
          ctx.strokeStyle  = '#c9a84c';
          ctx.lineWidth    = 1.5;
          ctx.strokeRect(-w / 2, -h / 2, w, h);
          ctx.shadowBlur   = 0;
        }

        ctx.restore();
      });
    }

    function tick() {
      const s = stateRef.current;
      if (s.targetRotX !== null && !s.isDragging) {
        /* Seek mode — lerp toward target */
        s.rotX += (s.targetRotX - s.rotX) * 0.05;
        s.rotY += (s.targetRotY - s.rotY) * 0.05;
        s.velX  = 0;
        s.velY  = 0;
        if (Math.abs(s.targetRotX - s.rotX) < 0.001 && Math.abs(s.targetRotY - s.rotY) < 0.001) {
          s.rotX = s.targetRotX;
          s.rotY = s.targetRotY;
          s.targetRotX = null;
          s.targetRotY = null;
        }
      } else if (!s.isDragging) {
        /* Auto-rotate nudge */
        s.velY += (0.004 - s.velY) * 0.02;
        s.velX += (0      - s.velX) * 0.04;
        s.rotY  += s.velY;
        s.rotX  += s.velX;
        s.rotX   = Math.max(-1.1, Math.min(1.1, s.rotX));
        s.velX  *= 0.92;
        s.velY  *= 0.97;
      } else {
        s.rotY  += s.velY;
        s.rotX  += s.velX;
        s.rotX   = Math.max(-1.1, Math.min(1.1, s.rotX));
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    /* Resize handler */
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = 780;
    }
    resize();
    window.addEventListener('resize', resize);

    rafRef.current = requestAnimationFrame(tick);

    /* ── Mouse interaction ─────────────────────────────────────────── */
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      s.mouseX = e.clientX - rect.left;
      s.mouseY = e.clientY - rect.top;
      if (s.isDragging) {
        const dx = e.clientX - s.lastMX;
        const dy = e.clientY - s.lastMY;
        s.velY = dx * 0.008;
        s.velX = dy * 0.008;
        s.lastMX = e.clientX;
        s.lastMY = e.clientY;
      }
    }
    function onMouseDown(e) {
      s.isDragging    = true;
      s.lastMX        = e.clientX;
      s.lastMY        = e.clientY;
      s.targetRotX    = null;
      s.targetRotY    = null;
    }

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const W    = canvas.width;
      const H    = canvas.height;

      /* Project nodes at current rotation and hit-test */
      let hitNode = null;
      const projected = nodes.map((n) => {
        let [x, y, z] = rotateX(n.ox, n.oy, n.oz, s.rotX);
        [x, y, z]     = rotateY(x, y, z, s.rotY);
        const scale   = FOV / (FOV + z);
        const sx      = W / 2 + x * scale;
        const sy      = H / 2 + y * scale;
        return { ...n, sx, sy, z, scale };
      });
      projected.sort((a, b) => b.z - a.z); /* front first for hit priority */
      for (const n of projected) {
        const hw = (n.w * n.scale) / 2;
        const hh = (n.h * n.scale) / 2;
        if (mx >= n.sx - hw && mx <= n.sx + hw && my >= n.sy - hh && my <= n.sy + hh) {
          hitNode = n;
          break;
        }
      }
      if (!hitNode) return;

      /* Compute rotX/rotY that place the node's unit vector at (0,0,+1) */
      const px = hitNode.ox / R;
      const py = hitNode.oy / R;
      const pz = hitNode.oz / R;
      const tRotX = -Math.atan2(py, Math.sqrt(px * px + pz * pz)) * Math.sign(pz >= 0 ? 1 : -1);
      const tRotY = Math.atan2(-px, pz);

      /* Shortest-path wrap for rotY so we don't spin the long way */
      let dY = tRotY - (s.rotY % (2 * Math.PI));
      if (dY >  Math.PI) dY -= 2 * Math.PI;
      if (dY < -Math.PI) dY += 2 * Math.PI;

      s.targetRotX = -Math.asin(py);
      s.targetRotY  = s.rotY + dY;
    }
    function onMouseUp() { s.isDragging = false; }
    function onMouseLeave() {
      s.isDragging = false;
      s.mouseX = -9999;
      s.mouseY = -9999;
    }

    /* ── Touch interaction ─────────────────────────────────────────── */
    function onTouchStart(e) {
      const t = e.touches[0];
      s.isDragging = true;
      s.lastMX = t.clientX;
      s.lastMY = t.clientY;
    }
    function onTouchMove(e) {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - s.lastMX;
      const dy = t.clientY - s.lastMY;
      s.velY = dx * 0.008;
      s.velX = dy * 0.008;
      s.lastMX = t.clientX;
      s.lastMY = t.clientY;
    }
    function onTouchEnd() { s.isDragging = false; }

    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click',      onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);

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
  }, [imagesVersion]);

  /* ── Shared category button style ───────────────────────────────────────── */
  const catBtnStyle = (key, vertical) => ({
    background:    'none',
    border:        'none',
    padding:       vertical ? '12px 0 12px 16px' : '0 0 12px',
    borderLeft:    vertical
      ? (key === activeCategory ? '2px solid #c9a84c' : '2px solid transparent')
      : 'none',
    borderBottom:  vertical
      ? 'none'
      : (key === activeCategory ? '1px solid #c9a84c' : '1px solid transparent'),
    marginBottom:  vertical ? 0 : '-1px',
    fontFamily:    "'Montserrat', sans-serif",
    fontSize:      '9px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    cursor:        'pointer',
    color:         key === activeCategory ? '#c9a84c' : 'var(--ivory)',
    opacity:       key === activeCategory ? 1 : 0.4,
    textAlign:     vertical ? 'left' : 'center',
    transition:    'opacity 0.4s ease, color 0.4s ease, border-color 0.4s ease',
    whiteSpace:    'nowrap',
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
            <p
              style={{
                fontFamily:    "'Montserrat', sans-serif",
                fontSize:      '0.6rem',
                fontWeight:    300,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color:         'var(--gold)',
                opacity:       0.6,
              }}
            >
              01 — The Collection
            </p>
          </div>

          {/* Mobile: horizontal category tabs */}
          <div
            style={{
              display:      'flex',
              gap:          '28px',
              padding:      '0 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '28px',
              overflowX:    'auto',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={catBtnStyle(cat.key, false)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile: image grid for active category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            {activeCat.images.map((src, i) => (
              <div key={i} style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={{
                    display:   'block',
                    width:     '100%',
                    height:    '100%',
                    objectFit: 'cover',
                    filter:    'brightness(0.85) saturate(0.88)',
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>

          {/* Left: header + vertical category menu */}
          <div
            style={{
              width:         '220px',
              flexShrink:    0,
              padding:       '0 0 48px 56px',
              display:       'flex',
              flexDirection: 'column',
            }}
          >
            <p
              style={{
                fontFamily:    "'Montserrat', sans-serif",
                fontSize:      '0.6rem',
                fontWeight:    300,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color:         'var(--gold)',
                opacity:       0.6,
                marginBottom:  '40px',
              }}
            >
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

          {/* Right: 3D sphere canvas */}
          <canvas
            ref={canvasRef}
            className="hov"
            style={{
              display: 'block',
              flex:    1,
              height:  '780px',
              cursor:  'none',
            }}
          />

        </div>
      )}
    </section>
  );
}
