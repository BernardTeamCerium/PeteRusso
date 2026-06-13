# Pete Russo — Personal Brand Site

A fast, modern, single-page site for **Pete Russo** — entrepreneur, executive, and
keynote speaker. Built as a static site (HTML / CSS / vanilla JS) with a dark, premium
aesthetic: deep charcoal surfaces, gold accents, an editorial serif display face, and
smooth scroll-reveal motion.

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

- **Photos:** swap the three SVGs in `assets/img/` for real images.
  - Hero: a portrait works best (it's masked into a tall arched frame, ~4:5).
  - About: an on-stage / speaking shot (~4:5).
  - You can keep the `.svg` filenames or update the `src` in `index.html`.
- **Testimonials:** the quotes in the *Voices* section are representative placeholders.
  Replace with real client/organizer quotes and names. (A `* Representative testimonials`
  note is shown until then.)
- **Contact form:** currently front-end only — it validates and opens the visitor's email
  client (`mailto:prusso@retireaef.com`). To capture submissions directly, point the form
  at a service like Formspree/Netlify Forms or a small backend (see `assets/js/main.js`).
- **Social links / email:** verify the Instagram, LinkedIn, and email in `index.html`.

## Design notes

- **Type:** [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) + [Inter](https://fonts.google.com/specimen/Inter) (UI/body), loaded from Google Fonts.
- **Color tokens** live in `:root` in `styles.css` — change the gold/charcoal palette in one place.
- **Accessibility:** skip link, focus styles, `aria` on the menu/form, and full
  `prefers-reduced-motion` support (animations and counters are disabled when requested).
- **Performance:** no frameworks; ~one CSS file, one small JS file, inline SVG art.

## Deploy

Drop the folder on any static host:

- **Netlify / Vercel / Cloudflare Pages:** point at the repo, no build command, publish dir = root.
- **GitHub Pages:** enable Pages on the branch, root folder.
