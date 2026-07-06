/* ============================================================
   render.js — turns the content in js/data.js into DOM.
   Each render function targets one section's mount point, so
   adding a new section later = one data array + one function.
   ============================================================ */

/* Escape user-editable strings before injecting into innerHTML */
const esc = (s = "") =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

/* ---------- Minimal inline SVG icon library ----------
   Stroke-based, inherits currentColor, no icon font needed. */
const ICONS = {
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6"/>',
  layers: '<path d="m12 2 10 5.5L12 13 2 7.5 12 2Zm-10 10 10 5.5L22 12M2 16.5 12 22l10-5.5"/>',
  brain: '<path d="M9.5 3A3.5 3.5 0 0 0 6 6.5c-2 .5-3.5 2-3.5 4.5 0 1.5.5 2.8 1.7 3.7-.2.5-.2 1-.2 1.6A4.7 4.7 0 0 0 8.7 21c1.4 0 2.5-.5 3.3-1.4.8.9 1.9 1.4 3.3 1.4a4.7 4.7 0 0 0 4.7-4.7c0-.6 0-1.1-.2-1.6 1.2-.9 1.7-2.2 1.7-3.7 0-2.5-1.5-4-3.5-4.5A3.5 3.5 0 0 0 14.5 3c-1 0-1.9.4-2.5 1.1A3.4 3.4 0 0 0 9.5 3Z"/><path d="M12 4v16"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.5 5 5 0 0 0 7 18.9h10.5Z"/>',
  wrench: '<path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6a2 2 0 1 0 2.8 2.8l5.7-5.7a4.5 4.5 0 0 0 5.6-6L14 11.9l-2-2 2.7-3.6Z"/>',
  pipeline: '<path d="M4 6h6v6H4zM14 12h6v6h-6z"/><path d="M10 9h7a1 1 0 0 1 1 1v2M14 15H7a1 1 0 0 1-1-1v-2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  message: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.4 0-2.8-.3-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3Z"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 3 3 5-7"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.2l2.3 12.4a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.2L21 7H5.2"/>',
  camera: '<path d="M4 8a2 2 0 0 1 2-2h1.5l1.2-1.8a1 1 0 0 1 .8-.4h5a1 1 0 0 1 .8.4L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z"/><circle cx="11" cy="12.5" r="3.2"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  bank: '<path d="M3 10h18L12 3 3 10Z"/><path d="M5 10v7M10 10v7M14 10v7M19 10v7M3 20h18"/>',
  map: '<path d="m9 3-6 3v15l6-3 6 3 6-3V3l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
  gamepad: '<path d="M7 12h4M9 10v4"/><circle cx="15.5" cy="11" r="1"/><circle cx="18" cy="13.5" r="1"/><rect x="2" y="6.5" width="20" height="11" rx="5.5"/>',
  github: '<path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.5.1.7-.2.7-.5v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.2 5.7.4.3.7 1 .7 2.1v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 12 .5Z"/>',
  external: '<path d="M15 3h6v6M21 3l-9 9M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a1 1 0 0 0-1 1c0 2 1.5 3.5 4 3.8M17 6h3a1 1 0 0 1 1 1c0 2-1.5 3.5-4 3.8"/>',
  medal: '<circle cx="12" cy="14" r="6"/><path d="m8.5 8.8-3-6.3h4L12 7l2.5-4.5h4l-3 6.3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-2 8 5.5-3 5.5 3-2-8"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9v5"/>',
  cert: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h10M7 12h6"/><circle cx="17" cy="15" r="2.2"/><path d="m16 17 .8 3.5L17 20l.2.5L18 17"/>',
};

const icon = (name, size = 22) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.code}</svg>`;

/* Make a grid animate in with staggered children */
const stagger = (container) => {
  container.classList.add("reveal");
  container.setAttribute("data-stagger", "");
  [...container.children].forEach((child, i) => child.style.setProperty("--i", i));
};

/* ---------- Skills ---------- */
export function renderSkills(mount, skills) {
  mount.innerHTML = skills
    .map(
      (cat) => `
      <article class="skill-category card">
        <header class="skill-category-head">
          <span class="skill-category-icon">${icon(cat.icon)}</span>
          <h3 class="skill-category-title">${esc(cat.category)}</h3>
        </header>
        <ul class="skill-list">
          ${cat.items
            .map(
              (s) => `
            <li class="skill-item">
              <span class="skill-badge" aria-hidden="true">${esc(s.abbr)}</span>
              <div>
                <div class="skill-meta">
                  <span class="skill-name">${esc(s.name)}</span>
                  <span class="skill-level">${s.level}%</span>
                </div>
                <div class="skill-bar" role="img" aria-label="${esc(s.name)} proficiency ${s.level} percent">
                  <span class="skill-bar-fill" style="--level:${s.level}%"></span>
                </div>
              </div>
            </li>`
            )
            .join("")}
        </ul>
      </article>`
    )
    .join("");
  stagger(mount);
}

/* ---------- Projects ---------- */
export function renderProjects(mount, projects) {
  mount.innerHTML = projects
    .map((p) => {
      // If a real screenshot is provided, use it; otherwise draw the
      // gradient placeholder cover with the project's icon.
      const cover = p.image
        ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" width="400" height="165" style="object-fit:cover;height:100%;width:100%">`
        : icon(p.icon, 52);

      return `
      <article class="project-card card">
        <div class="project-cover" style="--cover:${p.cover}" aria-hidden="${p.image ? "false" : "true"}">
          ${cover}
        </div>
        <div class="project-body">
          <div class="project-tech">
            ${p.tags.map((t) => `<span class="tag tag-purple">${esc(t)}</span>`).join("")}
          </div>
          <h3 class="project-title">${esc(p.title)}</h3>
          <p class="project-desc">${esc(p.description)}</p>
          <div class="project-tech">
            ${p.tech.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
          </div>
          <div class="project-links">
            ${
              p.github
                ? `<a class="project-link" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">
                     <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">${ICONS.github}</svg> Code
                   </a>`
                : ""
            }
            ${
              p.demo
                ? `<a class="project-link" href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">
                     ${icon("external", 16)} Live Demo
                   </a>`
                : ""
            }
          </div>
        </div>
      </article>`;
    })
    .join("");
  stagger(mount);
}

/* ---------- Experience timeline ---------- */
export function renderExperience(mount, experience) {
  mount.innerHTML = experience
    .map(
      (job) => `
      <li class="timeline-item">
        <article class="timeline-card card">
          <h3 class="timeline-role">${esc(job.role)}</h3>
          <p class="timeline-company">${esc(job.company)}</p>
          <span class="timeline-dates">${esc(job.dates)}</span>
          <ul class="timeline-achievements">
            ${job.achievements.map((a) => `<li>${esc(a)}</li>`).join("")}
          </ul>
        </article>
      </li>`
    )
    .join("");
  stagger(mount);
}

/* ---------- Education ---------- */
export function renderEducation(mount, education) {
  mount.innerHTML = education
    .map(
      (ed) => `
      <article class="education-card card">
        <span class="education-icon">${icon("cap", 26)}</span>
        <div>
          <h3 class="education-degree">${esc(ed.degree)}</h3>
          <p class="education-school">${esc(ed.school)}</p>
          <ul class="education-notes">
            ${ed.notes.map((n) => `<li>${esc(n)}</li>`).join("")}
          </ul>
        </div>
        <div class="education-side">
          <span class="education-dates">${esc(ed.dates)}</span>
          <span class="tag">${esc(ed.gpa)}</span>
        </div>
      </article>`
    )
    .join("");
  stagger(mount);
}

/* ---------- Certifications ---------- */
export function renderCertifications(mount, certifications) {
  mount.innerHTML = certifications
    .map(
      (c) => `
      <article class="cert-card card">
        <span class="cert-icon">${icon("cert")}</span>
        <div>
          <h3 class="cert-name">${esc(c.name)}</h3>
          <p class="cert-issuer">${esc(c.issuer)}</p>
          <span class="cert-year">${esc(c.year)}</span>
        </div>
      </article>`
    )
    .join("");
  stagger(mount);
}

/* ---------- Publications ---------- */
export function renderPublications(mount, publications) {
  mount.innerHTML = publications
    .map(
      (p) => `
      <article class="pub-card card">
        <h3 class="pub-title">${esc(p.title)}</h3>
        <p class="pub-authors">${esc(p.authors)}</p>
        <p class="pub-venue">${esc(p.venue)}</p>
        <p class="pub-abstract">${esc(p.abstract)}</p>
        ${
          p.link
            ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer" style="margin-top:.6rem">
                 ${icon("external", 15)} Read paper
               </a>`
            : ""
        }
      </article>`
    )
    .join("");
  stagger(mount);
}

/* ---------- Achievements ---------- */
export function renderAchievements(mount, achievements) {
  mount.innerHTML = achievements
    .map(
      (a) => `
      <article class="achievement-card card">
        <span class="achievement-icon">${icon(a.icon, 24)}</span>
        <h3 class="achievement-title">${esc(a.title)}</h3>
        <p class="achievement-desc">${esc(a.description)}</p>
        <span class="achievement-year">${esc(a.year)}</span>
      </article>`
    )
    .join("");
  stagger(mount);
}
