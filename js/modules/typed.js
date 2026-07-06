/* ============================================================
   typed.js — lightweight typing/deleting effect for the hero.
   No dependencies; respects prefers-reduced-motion.
   ============================================================ */

const TYPE_SPEED = 65;      // ms per character while typing
const DELETE_SPEED = 35;    // ms per character while deleting
const HOLD_DELAY = 2200;    // pause after a word is fully typed
const NEXT_DELAY = 400;     // pause before typing the next word

export function initTyped(el, words) {
  if (!el || !words?.length) return;

  // Motion-sensitive users get a static label instead of animation.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = words[0];
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = words[wordIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIndex);

    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = HOLD_DELAY;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = NEXT_DELAY;
    }

    setTimeout(tick, delay);
  };

  el.textContent = "";
  setTimeout(tick, 600);
}
