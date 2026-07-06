/* ============================================================
   nav.js — sticky nav state, mobile hamburger menu,
   and active-link highlighting while scrolling.
   ============================================================ */

export function initNav() {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const links = [...document.querySelectorAll(".nav-link")];

  /* --- Glass background once scrolled past the top --- */
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Mobile menu --- */
  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close after navigating, and on Escape
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* --- Active section highlighting ---
     Watches each section that has a nav link and marks the link
     whose section currently occupies the middle of the viewport. */
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) =>
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`)
    );
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    // A thin horizontal band around the viewport's upper-middle:
    // whichever section crosses it is considered "current".
    { rootMargin: "-35% 0px -60% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
