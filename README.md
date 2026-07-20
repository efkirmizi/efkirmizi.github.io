# Personal Portfolio — Enis Furkan Kırmızı

A fast, dependency-free portfolio for AI / Data Engineering roles. Dark theme,
blue-purple accents, glassmorphism, scroll animations — built with plain
HTML, CSS, and ES-module JavaScript. No build step, no framework, no npm.

## Folder structure

```
PersonalWebsite/
├── index.html              # Single page: all sections + SEO meta + JSON-LD
├── css/
│   ├── base.css            # Design tokens (CSS variables), reset, typography,
│   │                       #   layout, scroll-reveal system, reduced-motion
│   ├── components.css      # Reusable UI: nav, buttons, cards, tags, skill
│   │                       #   bars, filter chips, spotlight, form, etc.
│   └── sections.css        # Per-section layout + responsive breakpoints
├── js/
│   ├── data.js             # ★ ALL content lives here — edit this to customize
│   ├── main.js             # Entry point: renders sections, wires up behavior
│   └── modules/
│       ├── render.js       # data.js → DOM (includes the stroke icon set)
│       ├── brandicons.js   # Inline brand logos (Simple Icons, CC0) for skills
│       ├── filter.js       # Tag filter chips for the projects grid
│       ├── spotlight.js    # Cursor-tracking glow on cards
│       ├── datafield.js    # Site-wide constellation background (canvas)
│       ├── orbs.js         # Spring physics for the hero's gradient orbs
│       ├── typed.js        # Hero typing effect
│       ├── nav.js          # Sticky nav, hamburger, active-link highlighting
│       └── scroll.js       # Progress bar, reveal-on-scroll, back-to-top
├── assets/
│   ├── covers/             # Hand-drawn SVG "blueprint" cover art per project
│   ├── favicon.svg
│   └── resume.pdf          # Placeholder — replace with your real resume
└── README.md
```

## Customizing

1. **Content** — almost everything is in [`js/data.js`](js/data.js): skills
   (with proficiency levels), projects, experience, education, certifications,
   publications, achievements, and the typed hero roles. Add an object to an
   array and it renders automatically.
2. **Identity** — name, headline, about text, and contact details are static
   HTML in [`index.html`](index.html) (kept static for SEO). Search for
   `your-username` and replace with your GitHub/LinkedIn handles; update the
   canonical URL and JSON-LD block in `<head>` too.
3. **Resume** — drop your real PDF over `assets/resume.pdf`.
4. **Contact form** — works out of the box via a `mailto:` fallback. For real
   submissions, create a free [Formspree](https://formspree.io) form and paste
   its endpoint into `config.formEndpoint` in `js/data.js`.
5. **Project covers** — each project points its `image` field at a hand-drawn
   SVG illustration in `assets/covers/` (a small "blueprint" of the system).
   Swap any of them for a real screenshot (`assets/covers/foo.webp` works the
   same way); remove the `image` field to fall back to the gradient + icon.
6. **Skill icons** — skill items reference brand logos by slug
   (`icon: "pytorch"`) from `js/modules/brandicons.js` (Simple Icons path
   data, CC0). Skills without a logo use a stroke glyph from `render.js`,
   and anything unresolved falls back to the two-letter `abbr` badge.
7. **Theme** — every color, radius, font, and easing is a CSS variable at the
   top of [`css/base.css`](css/base.css). Change `--accent` / `--accent-2`
   and the whole site follows.

## Run locally

The site uses ES modules, so it needs to be served over HTTP (opening
`index.html` directly via `file://` will block module imports).

Any static server works:

```powershell
# Python (already on most machines)
python -m http.server 8000

# ...or Node
npx serve .
```

Then open http://localhost:8000.

## Deploy

### GitHub Pages
1. Create a repo named `<your-username>.github.io` (or any repo).
2. Push this folder's contents to the `main` branch.
3. Repo → Settings → Pages → Source: `main` / root. Done — no build config
   needed since the site is fully static.

### Vercel
1. Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Build command: *(empty)*. Output directory: `./`.
3. Or from the CLI: `npx vercel` in this folder.

### Netlify
1. Drag-and-drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or
2. Connect the repo: build command *(empty)*, publish directory `./`.

After deploying, update the `canonical`, `og:url`, and JSON-LD URLs in
`index.html` with your real domain.

## Design decisions

- **Vanilla over React** — a portfolio is one mostly-static page. Skipping a
  framework removes ~100 KB of JS, gives a near-perfect Lighthouse score by
  default, and keeps deployment to "push files anywhere". The data-driven
  rendering in `data.js` + `render.js` preserves the main benefit React would
  have offered (content as data, markup generated).
- **Hybrid static/dynamic rendering** — hero, about, and contact are static
  HTML (best for SEO and no-JS visitors); repetitive lists (skills, projects,
  timeline…) render from `data.js` so growing them never means copy-pasting
  markup.
- **Inline SVG icons instead of an icon font/library** — zero network
  requests, styleable with `currentColor`, and only the icons actually used
  ship to the browser. Brand logos for skills are inlined the same way from
  the CC0 Simple Icons set (`js/modules/brandicons.js`), with a few colors
  lightened so they stay readable on the dark theme.
- **Blueprint covers instead of stock images** — every project card carries a
  hand-drawn SVG schematic of that system (medallion layers for the
  lakehouse, teacher→student funnel for distillation, ACL-gated retrieval for
  the RAG platform…). No fake screenshots, a few KB each, and they share the
  site's grid + palette so the grid reads as one system.
- **Tag filtering without a framework** — filter chips are derived from the
  `tags` already present in `data.js` (`js/modules/filter.js`); selecting one
  re-renders the grid and replays the stagger animation.
- **The background is a living data constellation** — `js/modules/datafield.js`
  draws a fixed full-viewport canvas behind every section: drifting points
  with depth (deeper points are smaller, slower, and parallax less while
  scrolling), linked into a faint web. Data packets periodically travel
  along links and pulse the receiving node; the cursor acts as a query
  vector whose k nearest points light up and link to it ranked by distance;
  clicking sends a ripple through every node it reaches. Alt sections and
  the footer use translucent backgrounds so the field stays visible,
  dimmed, behind them. The hero's gradient orbs get their own spring
  physics (`js/modules/orbs.js`). Both effects never initialize on touch
  devices or under `prefers-reduced-motion`, and pause when the tab is
  hidden.
- **The site mark is the same metaphor** — the favicon and nav glyph are a
  "query constellation": a ringed cyan query node retrieving its two
  nearest neighbors.
- **IntersectionObserver for everything scroll-related** — reveal animations,
  skill-bar fills, and nav highlighting all use observers instead of scroll
  handlers, so the main thread stays idle while scrolling. The progress bar
  (which genuinely needs scroll position) is rAF-throttled.
- **Accessibility & motion** — semantic landmarks, skip link, focus-visible
  styles, `aria` labels on icon-only links, and a `prefers-reduced-motion`
  block that disables the typing effect, floating terminal, orbs, and reveals.
  Content is never JS-gated: without JavaScript the page still shows all
  static sections (reveal styles are scoped under a `.js` class).
- **Dark-only theme** — the design language (glass, glow, gradients) is built
  for dark. A light mode would be a second design, not a toggle; the token
  system in `base.css` makes it easy to add later if wanted.

## Extending later

- **Blog / research page** — add `blog.html` reusing `base.css` +
  `components.css`; the nav is plain markup, just add a link.
- **AI demos / visualizations** — add a section mount point in `index.html`,
  a data array in `data.js`, and a render function in `render.js` (follow any
  existing section as the pattern).
- **CMS** — `data.js` is the content schema. Point a headless CMS at it, or
  fetch JSON at load and pass it to the same render functions.
