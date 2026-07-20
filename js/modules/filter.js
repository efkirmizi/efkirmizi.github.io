/* ============================================================
   filter.js — tag filter chips for the projects grid.
   Chips are derived from the tags already present in data.js,
   so adding a project with a new tag grows the filter bar
   automatically. Re-renders the grid and replays the stagger
   animation on every selection.
   ============================================================ */

export function initProjectFilters(filtersMount, gridMount, projects, renderProjects) {
  if (!filtersMount || !gridMount) return;

  // Unique tags in first-seen order, with project counts
  const counts = new Map();
  projects.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));

  const chips = [["All", projects.length], ...counts];

  filtersMount.innerHTML = chips
    .map(
      ([tag, count], i) => `
      <button class="filter-chip${i === 0 ? " is-active" : ""}" type="button"
              data-tag="${tag}" aria-pressed="${i === 0}">
        ${tag} <span class="filter-count">${count}</span>
      </button>`
    )
    .join("");

  const buttons = [...filtersMount.querySelectorAll(".filter-chip")];

  const apply = (tag) => {
    buttons.forEach((b) => {
      const active = b.dataset.tag === tag;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    const list = tag === "All" ? projects : projects.filter((p) => p.tags.includes(tag));
    renderProjects(gridMount, list);

    // The scroll-reveal observer only watches nodes present at load,
    // so replay the stagger animation by toggling visibility manually.
    gridMount.classList.remove("is-visible");
    void gridMount.offsetWidth; // force reflow so the transition restarts
    gridMount.classList.add("is-visible");
  };

  filtersMount.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (btn) apply(btn.dataset.tag);
  });
}
