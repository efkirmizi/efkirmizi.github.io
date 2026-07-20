/* ============================================================
   orbs.js — spring physics for the hero's gradient orbs.
   Replaces their CSS keyframe drift with a lazy spring that
   leans them away from the cursor, plus a slow autonomous
   wander so they stay alive without a pointer.
   Skipped on touch devices and under reduced motion; paused
   while the hero is off-screen or the tab is hidden.
   ============================================================ */

const PUSH = 70; // px: max displacement
const RANGE = 520; // px: distance at which orbs start reacting

export function initOrbPhysics() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.getElementById("home");
  if (!fine || reduced || !hero) return;

  const orbs = [...hero.querySelectorAll(".orb")].map((el) => ({
    el,
    cx: 0,
    cy: 0,
    x: 0,
    y: 0,
  }));
  if (!orbs.length) return;
  hero.classList.add("orbs-live"); // hands transform over from CSS keyframes

  let pointerClient = null;
  let running = false;
  let visible = true;
  let raf = 0;
  let last = 0;

  const measure = () => {
    // offset* ignores transforms, so this is the untransformed anchor
    orbs.forEach((o) => {
      o.cx = o.el.offsetLeft + o.el.offsetWidth / 2;
      o.cy = o.el.offsetTop + o.el.offsetHeight / 2;
    });
  };

  const tick = (now) => {
    if (!running) return;
    const dtn = Math.min((now - last) / 16.7, 2) || 1;
    last = now;
    const t = now * 0.00025;

    const rect = hero.getBoundingClientRect();
    const pointer = pointerClient
      ? { x: pointerClient.x - rect.left, y: pointerClient.y - rect.top }
      : null;

    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      let tx = Math.cos(t * 0.9 + i * 2.4) * 16;
      let ty = Math.sin(t * 0.7 + i * 2.4) * 14;
      if (pointer) {
        const dx = o.cx - pointer.x;
        const dy = o.cy - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        const push = PUSH * Math.max(0, 1 - d / RANGE);
        tx += (dx / d) * push;
        ty += (dy / d) * push;
      }
      o.x += (tx - o.x) * 0.045 * dtn;
      o.y += (ty - o.y) * 0.045 * dtn;
      o.el.style.transform = `translate3d(${o.x.toFixed(1)}px, ${o.y.toFixed(1)}px, 0)`;
    }

    raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const sync = () => {
    if (visible && !document.hidden) start();
    else stop();
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      pointerClient = { x: e.clientX, y: e.clientY };
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => (pointerClient = null));
  window.addEventListener("blur", () => (pointerClient = null));

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener("visibilitychange", sync);
  new ResizeObserver(measure).observe(hero);

  measure();
  sync();
}
