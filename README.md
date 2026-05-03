# Suitcase E-shop — multi‑page storefront (HTML + SCSS + TypeScript)

A polished, multi-page e-commerce website for luggage and suitcases — built from a Figma template **without JS/CSS frameworks**.
The app focuses on the full “shop” flow: browsing a catalog, viewing product details, and managing a cart with persistent totals.

## Live demo (GitHub Pages)

This project can be published on GitHub Pages using **Deploy from a branch** (no CI workflow required).

- Demo URL will look like: `https://<username>.github.io/<repo>/`.
- The root page redirects to `src/index.html`.

One-time setup: GitHub → **Settings** → **Pages** → **Build and deployment** → **Deploy from a branch** → select `main` (or `master`) and `/ (root)`.

Important: GitHub Pages serves static files. Before pushing, run `npm run build` and commit the generated `dist/` folder.

## What you can do in the app

- Browse a dynamic catalog with **filters**, **sorting**, **search**, and **pagination** (updates instantly).
- Open a product from a card → **Product Details** page with recommendations.
- Add items to the cart with **merge rules**, live totals, discount logic, and **persistence**.
- Use a responsive header/navigation + login modal with basic validation.

## Tech stack

- HTML5 (multi-page layout)
- SCSS (Sass) — structured styles by pages/components
- TypeScript — modular logic compiled to ES modules
- Local JSON dataset for products

## Prerequisites

- Node.js 18+
- npm

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start development watchers (SCSS + TypeScript):

```bash
npm run dev
```

3. Open the app:

- Open `src/index.html` in a browser, or
- Use VS Code **Live Server** (recommended for convenient navigation across pages).

Note: `npm run dev` runs watchers only (this project doesn’t bundle a built-in dev server).

## NPM scripts

- `npm run dev` — watch SCSS and TypeScript in parallel.
- `npm run build` — build SCSS + TypeScript once.
- `npm run scss:watch` — watch SCSS only.
- `npm run scss:build` — build SCSS once.
- `npm run ts:watch` — watch TypeScript only.
- `npm run ts:build` — compile TypeScript once.
- `npm run lint` — run ESLint (TS) and Stylelint (SCSS).

## Project structure

- `src/` — source files
  - `src/index.html` — entry page (Home)
  - `src/html/` — other pages (catalog, product details, cart, etc.)
  - `src/scss/` — SCSS sources (partials/components/pages)
  - `src/ts/` — TypeScript sources (feature modules)
  - `src/assets/` — static assets + data
    - `src/assets/data.json` — product dataset
- `dist/` — compiled output
  - `dist/styles/` — compiled CSS
  - `dist/js/` — compiled JavaScript (ES modules)

## Data source

Product data is stored locally in [src/assets/data.json](src/assets/data.json) and is used to render catalog/product pages.

## Quality

- Linting is available via `npm run lint` (ESLint + Stylelint).
- Responsive layout targets breakpoints around 768px / 1024px / 1440px.

## Pages (high level)

- Home — hero + sections driven by dataset
- Catalog — filters / sort / search / pagination
- Product Details — details + recommendations
- Cart — item merge rules, totals, discount, persistence
- About / Contact — static informational pages

## Demo checklist (2 minutes)

- Open `src/index.html` → go to **Catalog**.
- Use **search**, change **sorting**, apply a **filter**, and jump pages via **pagination**.
- Open any product card → check **Product Details** + recommendations.
- Add to cart from the product page, then open **Cart** and verify totals.
- Refresh the page and confirm the cart state persists (LocalStorage).

## Screenshots

Add your screenshots to `screenshots/` and link them here.

- Home: `screenshots/home.png`
- Catalog: `screenshots/catalog.png`
- Product Details: `screenshots/product-details.png`
- Cart: `screenshots/cart.png`
