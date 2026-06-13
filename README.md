# Pete Russo — Personal Brand Site

A fast, modern, single-page site for **Pete Russo** — entrepreneur, executive, and
keynote speaker. Built as a static site (HTML / CSS / vanilla JS) with a modern, premium
aesthetic: deep slate surfaces, electric-cobalt accents, an editorial serif display face,
and smooth scroll-reveal motion.

No build step. No dependencies. Deploys anywhere.

## Structure

```
.
├── index.html              # All page content & sections
├── assets/
│   ├── css/styles.css      # Design system + layout + responsive + motion
│   ├── js/main.js          # Nav, scroll reveal, counters, mobile menu, form
│   └── img/
│       ├── favicon.svg
│       ├── pete-russo.svg  # Hero portrait placeholder  → replace
│       └── pete-about.svg  # About/stage placeholder     → replace
└── README.md
```

## Sections

1. **Hero** — name, positioning, dual CTAs, animated portrait + experience badge
2. **Stats** — animated counters ($450M+, hundreds of employees, etc.)
3. **About** — bio, credentials, signature, pull-quote
4. **Speaking** — four keynote topics + booking CTA
5. **Coaching** — 1:1 strategy call value props + offer card
6. **Journey** — timeline from NYC vending machine → $450M enterprise
7. **Voices** — testimonials (placeholder copy — replace before launch)
8. **Contact** — inquiry form (mailto fallback) + direct contact methods
9. **Footer** — nav + social links

## Local preview

It's plain static files — just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Before launch — content to replace

- **Photos:** real photos of Pete are wired in (`assets/img/`):
  - `pete-russo.jpg` — hero portrait (vertical, fits the arched ~4:5 frame).
  - `pete-about.jpg` — About section (private-aviation / Forbes shot).
  - `pete-russo-alt.jpg` — spare alternate (thoughtful pose), not currently placed.
  To change any, drop a new file at the same path or update the `src` in `index.html`.
- **Testimonials:** the quotes in the *Voices* section are representative placeholders.
  Replace with real client/organizer quotes and names. (A `* Representative testimonials`
  note is shown until then.)
- **Contact form:** wired for [Formspree](https://formspree.io) (no backend needed).
  1. Create a free Formspree form and copy its form ID.
  2. In `index.html`, replace `YOUR_FORM_ID` in the form's `action`
     (`https://formspree.io/f/YOUR_FORM_ID`).
  That's it — submissions post via AJAX and the visitor stays on the page. Until the ID is
  set (or if the request fails), the form gracefully falls back to opening the visitor's
  email client (`mailto:prusso@retireaef.com`), so no lead is lost. Prefer Netlify Forms or
  your own endpoint? Just point the `action` there — the same JS handles it.
- **Social links / email:** verify the Instagram, LinkedIn, and email in `index.html`.

## Design notes

- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) + [Inter](https://fonts.google.com/specimen/Inter) (UI/body), loaded from Google Fonts.
- **Color tokens** live in `:root` in `styles.css` — the slate base + electric-cobalt accent (`--accent*`) can be re-themed in one place.
- **Accessibility:** skip link, focus styles, `aria` on the menu/form, and full
  `prefers-reduced-motion` support (animations and counters are disabled when requested).
- **Performance:** no frameworks; ~one CSS file, one small JS file, inline SVG art.

## Deploy

Drop the folder on any static host:

- **Netlify / Vercel / Cloudflare Pages:** point at the repo, no build command, publish dir = root.
- **GitHub Pages:** enable Pages on the branch, root folder.
