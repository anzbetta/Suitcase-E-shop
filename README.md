# Suitcase E-shop

Multi-page e-commerce website for luggage and suitcases, built from a Figma template without JavaScript or CSS frameworks. The project uses HTML, SCSS (Sass), and TypeScript, with product data stored in a local JSON file.

## Highlights
- Dynamic catalog: filters, sorting, search, and pagination with instant updates.
- Product flow: card click -> Product Details, plus recommendations.
- Shopping cart: merge rules, live totals, discount logic, and persistence.
- Polished UX: login modal validation and responsive navigation.

## Tech stack
- HTML5
- SCSS (Sass)
- TypeScript

## Requirements / Prerequisites
- Node.js 18+
- npm

## Installation and running

1. Install dependencies:

```bash
npm install
```

2. Start development (SCSS + TypeScript watchers and local server):

```bash
npm run dev
```

The project is intended to be started using only two commands: `npm install` and `npm run dev`.

## NPM scripts
- `npm run dev` — run SCSS and TypeScript watchers in parallel.
- `npm run build` — build SCSS and TypeScript once.
- `npm run scss:watch` — watch SCSS only.
- `npm run ts:watch` — watch TypeScript only.
- `npm run lint` — run ESLint and Stylelint checks.

## Project structure
- `src/` — source files
- `src/html/` — pages (index, catalog, product details, etc.)
- `src/scss/` — styles (partials, components, pages)
- `src/ts/` — TypeScript logic
- `src/assets/data.json` — product data
- `dist/` — compiled output

## Requirements coverage (short)

### Stage 1 — Setup
- Install and run with `npm install` and `npm run dev`.

### Stage 2 — Layout (HTML + CSS)
- Semantic HTML, SCSS partials, and sticky header.

### Stage 3 — Responsive design
- Breakpoints at 768px / 1024px / 1440px, no horizontal scroll.

### Stage 4 — Interactivity & functionality
- Header/footer navigation, login modal validation, cart counter updates.
- Homepage slider + JSON-driven sections.
- Catalog filters/sort/search/pagination and Top Best Sets.
- Product Details with dynamic data, reviews, and recommendations.
- Cart merge rules, live totals, discount, and LocalStorage.

### Stage 5 — Quality
- ESLint + Stylelint, `npm run lint`.

## Notes
- Product data lives in [src/assets/data.json](src/assets/data.json).
