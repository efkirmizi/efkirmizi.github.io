/* ============================================================
   spotlight.js — cursor-tracking glow on cards.
   One delegated listener sets --mx/--my custom properties;
   components.css paints a radial highlight at that point.
   Skipped on touch devices and for reduced-motion users.
   ============================================================ */

export function initSpotlight() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;

  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );

  document.body.classList.add("spotlight-on");
}
