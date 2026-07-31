# digital-health-guide.github.io

The website for **[Digital Health Guide](https://github.com/digital-health-guide/digital-health-guide)** — a practical handbook of best practices for delivering digital services in health and social care organizations.

Published at <https://digital-health-guide.github.io/>.

The book is the source of truth; this repository only renders it. Every page here comes from the Markdown in the book repository, vendored into `content/` and built into a static site.

## Toolchain

- **[SvelteKit](https://svelte.dev/docs/kit)** with **[adapter-static](https://svelte.dev/docs/kit/adapter-static)** — every route is prerendered to plain HTML, which is all GitHub Pages serves.
- **[Lily Design System](https://github.com/LilyDesignSystem)** — the Svelte headless components and helpers supply the semantics and accessibility; a Lily theme stylesheet supplies the design tokens and component styling.
- **[marked](https://marked.js.org/)** — Markdown rendering at build time, with the link rewriting and chapter cross-referencing described below.

There is no runtime JavaScript requirement for reading: the prerendered HTML is complete. Client-side JavaScript adds the theme picker, the text-size picker, and instant navigation.

## Working locally

```sh
npm install
npm run dev        # dev server with live reload
npm run build      # prerender the whole site into build/
npm run preview    # serve build/ exactly as GitHub Pages will
```

## Keeping content in sync

Both the book and the design system are vendored, so the site builds anywhere without the sibling checkouts present.

```sh
npm run sync       # copy the book's Markdown into content/ and the icon into static/
npm run sync:lily  # copy the Lily components, helpers, and themes
```

`npm run sync` reads the sibling checkout `../digital-health-guide` by default; set `BOOK=/path/to/digital-health-guide` to point elsewhere. `npm run sync:lily` reads `~/git/lilydesignsystem/lily-design-system` by default; set `LILY=/path/to/lily-design-system` to override. Both scripts overwrite what they manage, so re-running them is the way to pick up upstream changes. Commit the result.

The vendored Lily files and their upstream commit are recorded in [`src/lib/lily/VENDOR.md`](src/lib/lily/VENDOR.md). Do not edit them here — change them upstream and re-sync.

## How the book becomes a site

| Book file | Site route |
| --- | --- |
| `README.md` | `/` |
| `chapters/PP-CC-slug.md` | `/chapters/PP-CC-slug/` |
| `GLOSSARY.md` | `/glossary/` |
| `INDEX.md` | `/subject-index/` |
| `STYLE_GUIDE.md` | `/style-guide/` |
| `spec/index.md` | `/spec/` |
| `spec/slug.md` | `/spec/slug/` |

While rendering, the build:

- **rewrites Markdown links** — `chapters/01-06-clinical-safety.md` and `../GLOSSARY.md` become site routes, so the same Markdown reads correctly on GitHub and on the web;
- **links chapter cross-references** — the book's house style "see Chapter 3.4 — Discovery Phases" and "See Chapters 1.9, 3.0" becomes a link to the chapter page (never to the page you are already on, and never inside another link);
- **adds heading anchors** — every `##` and `###` gets a stable GitHub-style slug id, listed in the "On this page" panel;
- **derives prev/next** from chapter file order, and writes `sitemap.xml`.

There is no sidebar. Navigation is the book's own table of contents on the home page — rendered from `README.md`, so the site and the README cannot drift apart — plus the header links, the breadcrumb, and prev/next at the foot of each chapter.

If a link in the book points at a file that does not exist, the build fails rather than publishing a broken page.

## Themes and accessibility

The header carries two Lily helpers:

- **Text size** — small, medium, large, x-large, persisted in `localStorage`.
- **Theme** — Light, Dark, NHS England / Scotland / Wales (patients and practitioners), and GOV.UK. The choice is persisted, and the first visit follows the operating system's light/dark preference.

Themes are plain stylesheets in `static/themes/`; the picker swaps the managed `<link>` in `src/app.html`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. For the first deployment, set **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository.

The setup follows the SvelteKit guidance in [adapter-static → GitHub Pages](https://svelte.dev/docs/kit/adapter-static#GitHub-Pages):

- `fallback: '404.html'` in [`svelte.config.js`](svelte.config.js), so a wrong URL gets this site's own error page instead of GitHub's default 404;
- an empty [`static/.nojekyll`](static/.nojekyll), so GitHub does not run Jekyll over the build output;
- `paths.base` left empty. That guidance's `BASE_PATH` step is only for project pages served from `https://<owner>.github.io/<repo>/`. This repository is named after the organization, so the site is served from the root and every link can stay absolute.
