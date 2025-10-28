### krisenstab

Our static site in Sveltekit, powered by Markdown content and Tailwind CSS.  
Each project lives as a `.md` file inside `/src/routes/texts`, automatically loaded and rendered as pages.

---

## Structure

```
src/
 ├─ lib/
 │   └─ components/
 │        └─ Header.svelte
 ├─ routes/
 │   ├─ +layout.svelte
 │   ├─ +layout.js
 │   ├─ projects/
 │   │   ├─ +page.svelte       → lists all projects
 │   │   ├─ +page.js           → loads markdown summaries
 │   │   └─ [slug]/
 │   │        ├─ +page.svelte  → renders full markdown
 │   │        └─ +page.js
 │   └─ texts/                 → markdown sources
 │        ├─ vantage.md
 │        ├─ design-signals.md
 │        └─ unfolding-the-archive.md
 ├─ app.css / postcss.config.js / tailwind.config.js
 └─ static/lastUpdated.json
```

Each markdown file drives one project page.  
The section **before the first `---`** appears in `/projects`,  
everything **after `---`** appears in `/projects/[slug]`.

Example:

```md
---
title: Vantage
date: 2024 - ongoing
---

Short description and images.

---

Full text and images for the project page.
```

---

## Development

```bash
npm install
npm run dev
```

Start the dev server at **http://localhost:5173**

---

## Build (static)

```bash
npm run build
```

This builds a **fully static site** using `@sveltejs/adapter-static`.  
Each project markdown file is prerendered into HTML.

Deploy to github with:

```bash
npm run deploy
```
