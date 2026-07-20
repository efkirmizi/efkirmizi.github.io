/* ============================================================
   herofx.js — interactive hero background.
   Two pointer-driven effects sharing one listener and one
   animation loop:

   1. Retrieval field — drifting "embedding" points, loosely
      clustered by color. The cursor acts as a query vector:
      the k nearest points within range light up and link to
      it, ranked by distance — ambient k-NN search.
   2. Orb physics — the gradient orbs trade their CSS keyframe
      drift for a lazy spring that leans them away from the
      cursor.

   Skipped entirely on touch devices and for reduced-motion
   users (the static hero remains); paused while the hero is
   off-screen or the tab is hidden.
   ============================================================ */

const K_NEAREST = 8; // links drawn from the query cursor
const QUERY_RADIUS = 280; // px: max retrieval distance
const ORB_PUSH = 70; // px: max orb displacement
const ORB_RANGE = 520; // px: distance at which orbs start reacting
const TAU = Math.PI * 2;
const COLORS = ["#6d8dff", "#a06bff", "#4cc9f0"];

export function initHeroFX() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.getElementById("home");
  const canvas = document.getElementById("hero-field");
  if (!fine || reduced || !hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let anchors = [];
  let points = [];
  let pointerClient = null; // latest pointer position in client coords
  let heroRect = null; // hero rect, refreshed once per frame
  let running = false;
  let visible = true;
  let raf = 0;
  let last = 0;

  /* Orbs keep their layout position; JS drives only a translate. */
  const orbs = [...hero.querySelectorAll(".orb")].map((el) => ({
    el,
    cx: 0,
    cy: 0,
    x: 0,
    y: 0,
  }));
  if (orbs.length) hero.classList.add("orbs-live");

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    anchors = [
      { x: w * 0.2, y: h * 0.34, phase: 0 },
      { x: w * 0.52, y: h * 0.74, phase: 2.1 },
      { x: w * 0.82, y: h * 0.3, phase: 4.2 },
    ];

    // Point budget scales with area, capped for perf
    const n = Math.max(48, Math.min(110, Math.round((w * h) / 16000)));
    points = [];
    for (let i = 0; i < n; i++) {
      const c = i % anchors.length;
      const a = anchors[c];
      const spread = Math.min(w, h) * 0.3;
      points.push({
        x: a.x + (Math.random() + Math.random() - 1) * spread,
        y: a.y + (Math.random() + Math.random() - 1) * spread * 0.8,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 1.3 + Math.random() * 1.1,
        heat: 0,
        c,
      });
    }

    // Untransformed orb centers (offset* ignores transforms)
    orbs.forEach((o) => {
      o.cx = o.el.offsetLeft + o.el.offsetWidth / 2;
      o.cy = o.el.offsetTop + o.el.offsetHeight / 2;
    });
  };

  const tick = (now) => {
    if (!running) return;
    const dtn = Math.min((now - last) / 16.7, 2) || 1; // 1 = one 60fps frame
    last = now;
    const t = now * 0.00025;

    heroRect = hero.getBoundingClientRect();
    const pointer =
      pointerClient &&
      pointerClient.x >= heroRect.left &&
      pointerClient.x <= heroRect.right &&
      pointerClient.y >= heroRect.top &&
      pointerClient.y <= heroRect.bottom
        ? { x: pointerClient.x - heroRect.left, y: pointerClient.y - heroRect.top }
        : null;

    /* ---- move the field ---- */
    for (const p of points) {
      const a = anchors[p.c];
      const ax = a.x + Math.cos(t + a.phase) * 26;
      const ay = a.y + Math.sin(t * 1.3 + a.phase) * 20;
      p.vx += (ax - p.x) * 0.00004 * dtn + (Math.random() - 0.5) * 0.01 * dtn;
      p.vy += (ay - p.y) * 0.00004 * dtn + (Math.random() - 0.5) * 0.01 * dtn;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > 0.3) {
        p.vx = (p.vx / sp) * 0.3;
        p.vy = (p.vy / sp) * 0.3;
      }
      p.x += p.vx * dtn;
      p.y += p.vy * dtn;
    }

    /* ---- retrieve: k nearest points to the query cursor ---- */
    let hits = [];
    if (pointer) {
      const r2 = QUERY_RADIUS * QUERY_RADIUS;
      for (let i = 0; i < points.length; i++) {
        const dx = points[i].x - pointer.x;
        const dy = points[i].y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) hits.push({ i, d: Math.sqrt(d2) });
      }
      hits.sort((a, b) => a.d - b.d);
      hits = hits.slice(0, K_NEAREST);
    }
    const hitSet = new Set(hits.map((h) => h.i));

    /* ---- draw ---- */
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.heat += ((hitSet.has(i) ? 1 : 0) - p.heat) * 0.12 * dtn;
      const r = p.r + p.heat * 2;
      ctx.fillStyle = COLORS[p.c];
      ctx.globalAlpha = 0.06 + p.heat * 0.18; // soft halo
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 3, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.42 + p.heat * 0.5; // core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fill();
    }

    if (pointer) {
      ctx.lineWidth = 1;
      for (let rank = 0; rank < hits.length; rank++) {
        const p = points[hits[rank].i];
        ctx.strokeStyle = COLORS[p.c];
        ctx.globalAlpha = (1 - hits[rank].d / QUERY_RADIUS) * (rank === 0 ? 0.65 : 0.4);
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      // query marker
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = COLORS[0];
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 5, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    /* ---- orb spring physics ---- */
    for (let i = 0; i < orbs.length; i++) {
      const o = orbs[i];
      // gentle autonomous wander so the orbs stay alive without a pointer
      let tx = Math.cos(t * 0.9 + i * 2.4) * 16;
      let ty = Math.sin(t * 0.7 + i * 2.4) * 14;
      if (pointer) {
        const dx = o.cx - pointer.x;
        const dy = o.cy - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        const push = ORB_PUSH * Math.max(0, 1 - d / ORB_RANGE);
        tx += (dx / d) * push;
        ty += (dy / d) * push;
      }
      o.x += (tx - o.x) * 0.045 * dtn; // heavy, fluid lag
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

  /* ---- wiring ---- */
  window.addEventListener(
    "pointermove",
    (e) => {
      pointerClient = { x: e.clientX, y: e.clientY };
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => {
    pointerClient = null;
  });
  window.addEventListener("blur", () => {
    pointerClient = null;
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(hero);
  document.addEventListener("visibilitychange", sync);

  new ResizeObserver(resize).observe(hero);
  resize();
  sync();
}
