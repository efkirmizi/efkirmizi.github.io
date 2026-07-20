/* ============================================================
   main.js — application entry point.
   Wires content (data.js) to renderers and initializes all
   interactive behavior. Each feature is an isolated module.
   ============================================================ */

import {
  config,
  skills,
  projects,
  experience,
  education,
  certifications,
  publications,
  achievements,
} from "./data.js";

import {
  renderSkills,
  renderProjects,
  renderExperience,
  renderEducation,
  renderCertifications,
  renderPublications,
  renderAchievements,
} from "./modules/render.js";

import { initTyped } from "./modules/typed.js";
import { initNav } from "./modules/nav.js";
import { initScrollProgress, initReveal, initBackToTop } from "./modules/scroll.js";
import { initProjectFilters } from "./modules/filter.js";
import { initSpotlight } from "./modules/spotlight.js";

/* ---------- Render dynamic sections ---------- */
renderSkills(document.getElementById("skills-grid"), skills);
renderProjects(document.getElementById("projects-grid"), projects);
renderExperience(document.getElementById("experience-timeline"), experience);
renderEducation(document.getElementById("education-grid"), education);
renderCertifications(document.getElementById("certs-grid"), certifications);
renderPublications(document.getElementById("pubs-list"), publications);
renderAchievements(document.getElementById("achievements-grid"), achievements);

/* Hide any section whose content list is empty (e.g. no certifications
   yet) so the page never shows a dangling header with nothing under it. */
const hideIfEmpty = (list, sectionId) => {
  if (!list.length) document.getElementById(sectionId)?.style.setProperty("display", "none");
};
hideIfEmpty(certifications, "certifications");
hideIfEmpty(publications, "publications");
hideIfEmpty(achievements, "achievements");

/* ---------- Interactive behavior ---------- */
initNav();
initScrollProgress();
initBackToTop();
initTyped(document.getElementById("typed"), config.typedRoles);
initProjectFilters(
  document.getElementById("project-filters"),
  document.getElementById("projects-grid"),
  projects,
  renderProjects
);
initSpotlight();
initReveal(); // must run AFTER rendering so new .reveal nodes are observed

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Contact form ----------
   With config.formEndpoint set (e.g. Formspree), submissions POST
   there. Without it, we gracefully fall back to the visitor's own
   mail client so the form is never a dead end. */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "form-status";

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  if (config.formEndpoint) {
    status.textContent = "Sending…";
    try {
      const res = await fetch(config.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      status.textContent = "Message sent — thank you! I'll get back to you soon.";
      status.classList.add("is-ok");
    } catch {
      status.textContent = "Something went wrong. Please email me directly instead.";
      status.classList.add("is-err");
    }
  } else {
    // mailto fallback: open a pre-filled draft in the visitor's mail app
    const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app…";
    status.classList.add("is-ok");
  }
});
