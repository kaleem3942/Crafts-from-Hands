# Crafts from Hands — React (Vite)

A faithful React + Vite conversion of the Crafts from Hands storefront
(handmade woven crafts from Pakistan). Same design, same text, same data,
same features and behaviour as the original single-file version — only the
code format changed: the app is now a standard Vite + React project with
JSX components instead of one self-contained HTML file.

## Project layout

- `index.html` — page shell (title, meta, Google Fonts), mounts `#root`
- `src/main.jsx` — React entry point
- `src/App.jsx` — all components and the App (pages: Home, Shop, Story &
  Film, Checkout, policy pages, Contact; cart drawer, wishlist, quick-view
  3D viewer, Three.js vase studio)
- `src/data.js` — all site data (products, new collection, deals, stack
  groups, testimonials, film chapters, policies) plus `fmt` / `stars` helpers
- `src/index.css` — the site's full stylesheet
- `public/assets/` — product photos, gallery images, logo, maker artwork
  and the product film (`products-film.mp4`), served at `assets/...`

## Run it

```bash
npm install     # install dependencies (react, react-dom, three, vite)
npm run dev     # start the dev server (Vite prints the local URL)
```

## Build for production

```bash
npm run build   # outputs a static site into dist/
npm run preview # serve the production build locally to check it
```

The built `dist/` folder is a plain static site — it can be hosted on any
static host. Asset paths are relative (`assets/...`), exactly as in the
original site.
