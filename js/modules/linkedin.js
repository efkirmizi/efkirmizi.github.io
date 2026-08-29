/* ============================================================
   linkedin.js — lazily mounts LinkedIn's official profile badge.

   The badge markup itself lives in index.html (it is LinkedIn's,
   pasted verbatim); their script swaps that <div> for an iframe.
   This is the site's only third-party script, so it is held back
   until the badge is about to scroll into view — it costs nothing
   on first paint. If it is blocked or never answers, the plain
   link inside the badge stays as the fallback and the reserved
   space collapses, so the card is never a dead rectangle.
   ============================================================ */

const SCRIPT_SRC = "https://platform.linkedin.com/badges/js/profile.js";
const LOAD_MARGIN = "300px";   // start fetching just before the badge is on screen
const GIVE_UP_AFTER = 8000;    // ms to wait for the iframe before falling back for good

export function initLinkedInBadge(card) {
  if (!card) return;

  // Nothing to mount without LinkedIn's own markup in the card.
  if (!card.querySelector(".LI-profile-badge")) return;

  const mount = () => {
    let timer = 0;

    // The widget renders by appending an <iframe>, so watching the
    // card is more reliable than trusting the script's load event.
    const watcher = new MutationObserver(() => {
      if (!card.querySelector("iframe")) return;
      watcher.disconnect();
      clearTimeout(timer);
      card.classList.add("is-loaded");
    });
    watcher.observe(card, { childList: true, subtree: true });

    // Called on a failed script load, and as the deadline backstop for a
    // script that loads but never renders. The iframe can also land between
    // mutation batches, so check for it before declaring the widget dead.
    const settle = () => {
      watcher.disconnect();
      clearTimeout(timer);
      card.classList.add(card.querySelector("iframe") ? "is-loaded" : "is-unavailable");
    };

    timer = setTimeout(settle, GIVE_UP_AFTER);

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("error", settle);
    document.body.appendChild(script);
  };

  if (!("IntersectionObserver" in window)) {
    mount();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      obs.disconnect(); // load once
      mount();
    },
    { rootMargin: LOAD_MARGIN }
  );

  observer.observe(card);
}
