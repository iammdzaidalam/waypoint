'use client';
import { useEffect, useRef } from 'react';

// Purely decorative full-viewport ASCII field. Renders behind all content
// (z-index 0, pointer-events none) and never touches app state.
const RAMP = ' .:-+=*#%';
const CELL = 15;
const RADIUS = 200;
const IDLE_MS = 2500;

// Cheap deterministic per-cell hash so the base noise pattern is stable
// across frames (no flicker) without storing a PRNG.
function hash(i) {
  let t = (i * 2654435761) >>> 0;
  t ^= t >>> 13;
  t = (t * 1274126177) >>> 0;
  t ^= t >>> 16;
  return t / 4294967296;
}

export default function AsciiField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const animated = !reducedMotion && finePointer;

    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    let values = null;
    let base = null;
    let phases = null;
    let ink = '#171717';
    let font = '11px monospace';
    let mx = -1e4;
    let my = -1e4;
    let lastMove = 0;
    let env = 0; // movement envelope: 1 while the cursor moves, 0 when static
    let raf = 0;
    let running = false;
    let destroyed = false;

    const readStyles = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue('--ascii-ink').trim()
        || cs.getPropertyValue('--ink').trim()
        || '#171717';
      font = `11px ${getComputedStyle(document.body).fontFamily}`;
    };

    const drawCell = (c, r, v) => {
      const idx = Math.max(0, Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1))));
      if (idx === 0) return;
      ctx.globalAlpha = Math.min(0.22, 0.04 + v * 0.18);
      ctx.fillText(RAMP[idx], c * CELL + 2, r * CELL + 2);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.fillStyle = ink;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          drawCell(c, r, base[r * cols + c]);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      const n = cols * rows;
      values = new Float32Array(n);
      base = new Float32Array(n);
      phases = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const r1 = hash(i);
        const r2 = hash(i + 7919);
        // Sparse, faint, stable noise: most cells stay empty.
        base[i] = r1 < 0.12 ? 0.06 + r2 * 0.14 : 0;
        phases[i] = r2 * Math.PI * 2;
        values[i] = base[i];
      }
      readStyles();
      drawStatic();
    };

    const step = now => {
      raf = 0;
      if (destroyed) return;
      ctx.clearRect(0, 0, w, h);
      ctx.font = font;
      ctx.textBaseline = 'top';
      ctx.fillStyle = ink;

      // The effect only lives while the cursor moves: the envelope rises
      // quickly on movement and eases down when it goes static, shrinking
      // both the radius and the intensity of the energized spot.
      const envTarget = now - lastMove < 150 ? 1 : 0;
      env += (envTarget - env) * (envTarget > env ? 0.3 : 0.045);
      const radius = RADIUS * env;
      const r2max = radius * radius;
      const hasSpot = radius > 6;
      let energized = false;

      for (let r = 0; r < rows; r++) {
        const cy = r * CELL + CELL / 2;
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          let target = base[i];
          // Slow ambient drift (~±1 ramp step) so the field feels alive.
          if (target > 0) target += 0.06 * Math.sin(now * 0.0004 + phases[i]);
          if (hasSpot) {
            const dx = c * CELL + CELL / 2 - mx;
            const dy = cy - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < r2max) {
              const s = 1 - Math.sqrt(d2) / radius;
              const boost = s * s * (3 - 2 * s) * env; // smoothstep falloff
              if (boost > target) target = boost;
            }
          }
          const v = values[i];
          // Rise fast under the cursor, decay slowly: leaves a fading trail.
          const next = v + (target - v) * (target > v ? 0.3 : 0.06);
          values[i] = next;
          if (next > base[i] + 0.08) energized = true;
          drawCell(c, r, next);
        }
      }
      ctx.globalAlpha = 1;

      // Idle sleep: nothing above base and no recent pointer movement.
      if (!energized && now - lastMove > IDLE_MS) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (!running && !destroyed && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      wake();
    };

    const onLeave = () => {
      mx = -1e4;
      my = -1e4;
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        running = false;
      } else if (animated) {
        lastMove = performance.now();
        wake();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Repaint once real fonts arrive and whenever the theme flips.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (destroyed) return;
        readStyles();
        if (!running) drawStatic();
      });
    }
    const themeObserver = new MutationObserver(() => {
      readStyles();
      if (!running) drawStatic();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (animated) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('blur', onLeave);
      document.documentElement.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      themeObserver.disconnect();
      if (animated) {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('blur', onLeave);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }, []);

  return <canvas ref={ref} className="ascii-field" aria-hidden="true" />;
}
