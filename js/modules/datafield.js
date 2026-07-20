/* ============================================================
   datafield.js — site-wide interactive background.
   A fixed, full-viewport canvas behind every section: a field
   of drifting points with depth, linked into a faint
   constellation. Life comes from four layers of motion:

   · depth parallax — points shift at different rates while
     scrolling, so the field is alive on the whole page
   · data packets — bright dots that periodically travel along
     a link and make the receiving node pulse
   · query cursor — the pointer retrieves its k nearest points
     and links to them, ranked by distance (ambient k-NN)
   · click ripple — pointerdown sends a pulse through every
     node it reaches

   Never initializes on touch devices or under reduced motion
   (CSS also hides the canvas there); pauses when the tab is
   hidden.
   ============================================================ */

const COLORS = ["#6d8dff", "#a06bff", "#4cc9f0"];
const LINK_D = 110; // px: constellation link distance
const K_NEAREST = 10; // links drawn from the query cursor
const QUERY_RADIUS = 300; // px: max retrieval distance
const PARALLAX = 0.07; // scroll parallax factor (scaled by depth)
const MAX_PACKETS = 3;
const BURST_LIFE = 42; // frames
const BURST_RADIUS = 180; // px
const TAU = Math.PI * 2;

export function initDataField() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("data-field");
  if (!fine || reduced || !canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w = 0;
  let h = 0;
  let points = [];
  let packets = [];
  let bursts = [];
  let pointer = null; // client coords == canvas coords (fixed, full-viewport)
  let running = false;
  let raf = 0;
  let last = 0;

  const wrap = (v, m) => ((v % m) + m) % m;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.max(70, Math.min(160, Math.round((w * h) / 12000)));
    points = [];
    for (let i = 0; i < n; i++) {
      const z = 0.35 + Math.random() * 0.65; // depth: size, speed, parallax
      const ang = Math.random() * TAU;
      const sp = (0.06 + Math.random() * 0.18) * z;
      points.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        z,
        r: (0.9 + Math.random() * 1.3) * (0.6 + z * 0.7),
        c: Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2,
        heat: 0,
        sx: 0,
        sy: 0,
      });
    }
    packets = [];
  };

  const spawnPacket = () => {
    // Ride an existing constellation link: pick a point, then a
    // currently-linked neighbor.
    const i = (Math.random() * points.length) | 0;
    for (let tries = 0; tries < 12; tries++) {
      const j = (Math.random() * points.length) | 0;
      if (j === i) continue;
      const dx = points[i].sx - points[j].sx;
      const dy = points[i].sy - points[j].sy;
      if (dx * dx + dy * dy < LINK_D * LINK_D) {
        packets.push({ i, j, t: 0, dur: 40 + Math.random() * 35 });
        return;
      }
    }
  };

  const tick = (now) => {
    if (!running) return;
    const dtn = Math.min((now - last) / 16.7, 2) || 1;
    last = now;
    const scroll = window.scrollY;

    /* ---- simulate ---- */
    for (const p of points) {
      p.vx += (Math.random() - 0.5) * 0.006 * dtn;
      p.vy += (Math.random() - 0.5) * 0.006 * dtn;
      const sp = Math.hypot(p.vx, p.vy);
      const cap = 0.3 * p.z;
      if (sp > cap) {
        p.vx = (p.vx / sp) * cap;
        p.vy = (p.vy / sp) * cap;
      }
      p.x += p.vx * dtn;
      p.y += p.vy * dtn;
      // screen position: wrap + depth-scaled scroll parallax
      p.sx = wrap(p.x + 30, w + 60) - 30;
      p.sy = wrap(p.y - scroll * PARALLAX * p.z + 30, h + 60) - 30;
    }

    /* ---- retrieve: k nearest points to the query cursor ---- */
    let hits = [];
    if (pointer) {
      const r2 = QUERY_RADIUS * QUERY_RADIUS;
      for (let i = 0; i < points.length; i++) {
        const dx = points[i].sx - pointer.x;
        const dy = points[i].sy - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) hits.push({ i, d: Math.sqrt(d2) });
      }
      hits.sort((a, b) => a.d - b.d);
      hits = hits.slice(0, K_NEAREST);
    }
    const hitSet = new Set(hits.map((x) => x.i));

    /* ---- draw ---- */
    ctx.clearRect(0, 0, w, h);

    // constellation web
    ctx.strokeStyle = COLORS[0];
    ctx.lineWidth = 1;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.sx - b.sx;
        if (dx > LINK_D || dx < -LINK_D) continue;
        const dy = a.sy - b.sy;
        if (dy > LINK_D || dy < -LINK_D) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 > LINK_D * LINK_D) continue;
        ctx.globalAlpha =
          (1 - Math.sqrt(d2) / LINK_D) * 0.14 * Math.min(a.z, b.z) * (1 + a.heat + b.heat);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    // data packets riding the links
    if (packets.length < MAX_PACKETS && Math.random() < 0.02 * dtn) spawnPacket();
    packets = packets.filter((pk) => {
      pk.t += dtn;
      const p = Math.min(pk.t / pk.dur, 1);
      const a = points[pk.i];
      const b = points[pk.j];
      const px = a.sx + (b.sx - a.sx) * p;
      const py = a.sy + (b.sy - a.sy) * p;
      ctx.fillStyle = COLORS[b.c];
      for (let g = 3; g >= 0; g--) {
        const q = Math.max(p - g * 0.05, 0);
        ctx.globalAlpha = (g === 0 ? 0.9 : 0.22 - g * 0.05) * (1 - p * 0.3);
        ctx.beginPath();
        ctx.arc(a.sx + (b.sx - a.sx) * q, a.sy + (b.sy - a.sy) * q, g === 0 ? 2.2 : 1.6, 0, TAU);
        ctx.fill();
      }
      if (p >= 1) {
        b.heat = Math.max(b.heat, 1.25); // receiving node pulses
        return false;
      }
      // packet vanishes if its link stretched apart mid-flight
      const dx = a.sx - b.sx;
      const dy = a.sy - b.sy;
      return dx * dx + dy * dy < LINK_D * LINK_D * 4;
    });

    // query links, ranked by distance
    if (pointer) {
      ctx.lineWidth = 1;
      for (let rank = 0; rank < hits.length; rank++) {
        const p = points[hits[rank].i];
        ctx.strokeStyle = COLORS[p.c];
        ctx.globalAlpha = (1 - hits[rank].d / QUERY_RADIUS) * (rank === 0 ? 0.7 : 0.42);
        ctx.beginPath();
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(p.sx, p.sy);
        ctx.stroke();
      }
    }

    // points
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      p.heat += ((hitSet.has(i) ? 1 : 0) - p.heat) * 0.1 * dtn;
      const r = p.r + p.heat * 2;
      ctx.fillStyle = COLORS[p.c];
      ctx.globalAlpha = (0.05 + p.heat * 0.2) * p.z; // halo
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r * 3, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = (0.3 + p.z * 0.25 + p.heat * 0.45) * Math.min(1, 0.4 + p.z);
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, TAU);
      ctx.fill();
    }

    // query marker
    if (pointer) {
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = COLORS[0];
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 5, 0, TAU);
      ctx.stroke();
    }

    // click ripples
    bursts = bursts.filter((bu) => {
      bu.age += dtn;
      const p = Math.min(bu.age / BURST_LIFE, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      ctx.globalAlpha = (1 - p) * 0.5;
      ctx.strokeStyle = COLORS[2];
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(bu.x, bu.y, ease * BURST_RADIUS, 0, TAU);
      ctx.stroke();
      return p < 1;
    });

    ctx.globalAlpha = 1;
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

  /* ---- wiring ---- */
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer = { x: e.clientX, y: e.clientY };
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => (pointer = null));
  window.addEventListener("blur", () => (pointer = null));

  window.addEventListener(
    "pointerdown",
    (e) => {
      bursts.push({ x: e.clientX, y: e.clientY, age: 0 });
      // the pulse heats every node it will reach
      for (const p of points) {
        const d = Math.hypot(p.sx - e.clientX, p.sy - e.clientY);
        if (d < BURST_RADIUS) p.heat = Math.max(p.heat, 1 - d / BURST_RADIUS);
      }
    },
    { passive: true }
  );

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  resize();
  start();
}
