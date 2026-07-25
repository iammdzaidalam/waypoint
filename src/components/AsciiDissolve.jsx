'use client';
import { useLayoutEffect, useRef } from 'react';

// Purely decorative reveal: covers its children with an ASCII character grid
// that decays away in noise-threshold order while the content fades up.
// Adds no state and never blocks interaction (canvas is pointer-events: none).
const RAMP = '%#*+:.';
const CELL = 12;
const DURATION = 750;

export default function AsciiDissolve({ trigger, delay = 0, children }) {
  const wrapRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const w = Math.ceil(wrap.offsetWidth);
    const h = Math.ceil(wrap.offsetHeight);
    if (w < 8 || h < 8) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.setAttribute('aria-hidden', 'true');
    wrap.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `10px ${getComputedStyle(document.body).fontFamily}`;
    ctx.textBaseline = 'top';

    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    const thresholds = new Float32Array(cols * rows);
    for (let i = 0; i < thresholds.length; i++) thresholds[i] = Math.random();
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#171717';

    const ease = t => 1 - Math.pow(1 - t, 4);

    const render = p => {
      content.style.opacity = String(0.35 + 0.65 * p);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = ink;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const th = thresholds[r * cols + c];
          if (p >= th) continue; // cell already dissolved
          // As progress nears a cell's threshold it steps down the ramp.
          const closeness = Math.min((th - p) / 0.3, 1);
          const idx = Math.round((1 - closeness) * (RAMP.length - 1));
          ctx.globalAlpha = 0.25 + 0.55 * closeness;
          ctx.fillText(RAMP[idx], c * CELL + 2, r * CELL + 1);
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let start = null;
    let done = false;

    const frame = now => {
      if (start === null) start = now + delay;
      const t = Math.min(Math.max((now - start) / DURATION, 0), 1);
      render(ease(t));
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        done = true;
        canvas.remove();
        content.style.opacity = '';
      }
    };

    render(0); // full cover before the first painted frame - no flash
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (!done) {
        canvas.remove();
        content.style.opacity = '';
      }
    };
  }, [trigger, delay]);

  return (
    <div ref={wrapRef} className="ascii-dissolve">
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
