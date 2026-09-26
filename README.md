# digital-health-guide.github.io

The website for **[Digital Health Guide](https://github.com/digital-health-guide/digital-health-guide)** — a practical handbook of best practices for delivering digital services in health and social care organizations.

Published at <https://digital-health-guide.github.io/>.

The book is the source of truth; this repository only renders it. Every page here comes from the Markdown in the book repository's [`locales/`](https://github.com/digital-health-guide/digital-health-guide/tree/main/locales), vendored into `content/` and built into a static site — one build, eight languages/dialects.

## Toolchain

- **[SvelteKit](https://svelte.dev/docs/kit)** with **[adapter-static](https://svelte.dev/docs/kit/adapter-static)** — every route is prerendered to plain HTML, which is all GitHub Pages serves.
- **[Lily Design System](https://github.com/LilyDesignSystem)** — the Svelte headless components and helpers supply the semantics and accessibility; a Lily theme stylesheet supplies the design tokens and component styling. The header's **PickerBar** (`@lilydesignsystem/svelte-picker-bar`) composes the theme, language, text-size, and share pickers into one row.
- **[marked](https://marked.js.org/)** — Markdown rendering at build time, with the link rewriting and chapter cross-referencing described below.

There is no runtime JavaScript requirement for reading: the prerendered HTML is complete. Client-side JavaScript adds the picker bar (theme, language, text size, share) and instant navigation.

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

The vendored Lily files and their upstream commit are recorded in [`src/lib/lily/VENDOR.md`](src/lib/lily/VENDOR.md). Do not edit them here — change them upstream and re-sync. `picker-bar`'s own source imports its four wrapped pickers as real `@lilydesignsystem/svelte-*` package specifiers (that is how the upstream package is built); since this site vendors from a sibling checkout rather than installing those packages for real, [`vite.config.js`](vite.config.js) aliases those specifiers at the vendored barrels instead.

## Locales

The book publishes eight locales from [`locales/`](https://github.com/digital-health-guide/digital-health-guide/tree/main/locales): **en-gb** (British English, the book's source of truth — served unprefixed, at `/`), **en-us** (American spelling), **en-gb-oxendict** (Oxford spelling), **en-001** (international English), **cy-001** (Cymraeg/Welsh, a full translation), **es-001** (Español, a full translation), **zh-cn** (中文, Simplified Chinese, a full translation), and **hi-in** (हिन्दी, Hindi, a full translation). Every locale but en-gb is served under its own `/<locale>/` prefix, so the site's existing unprefixed URLs (`/chapters/…`, `/glossary/`, …) keep working unchanged.

The header's language picker switches locale in place: from any chapter, it lands on the *same* chapter in the new locale, not that locale's home page (see `equivalentRoute` in [`src/lib/book.js`](src/lib/book.js)). Reference material — the glossary, subject index, style guide, and spec — is not translated, so it has exactly one route shared by every locale; the picker leaves it alone.

Site chrome (breadcrumbs, "On this page", "Previous"/"Next", the footer, and the picker bar's own labels) is currently English-only even on translated pages — only the book's own content is localized. Translating the chrome too is tracked as follow-up work, not yet done.

## How the book becomes a site

| Book file | Site route |
| --- | --- |
| `locales/en-gb/index.md` | `/` |
| `locales/en-gb/chapters/PP-CC-slug/index.md` | `/chapters/PP-CC-slug/` |
| `locales/<locale>/index.md` (other locales) | `/<locale>/` |
| `locales/<locale>/chapters/PP-CC-slug/index.md` | `/<locale>/chapters/PP-CC-slug/` |
| `GLOSSARY.md` | `/glossary/` |
| `INDEX.md` | `/subject-index/` |
| `STYLE_GUIDE.md` | `/style-guide/` |
| `spec/index.md` | `/spec/` |
| `spec/slug.md` | `/spec/slug/` |

While rendering, the build:

- **rewrites Markdown links** — `chapters/01-06-clinical-safety/` and `../../GLOSSARY.md` become site routes, so the same Markdown reads correctly on GitHub and on the web;
- **links chapter cross-references** — the book's house style "see Chapter 3.4 — Discovery Phases" (English locales; the same pattern in translated locales is left as plain text, since matching every language's grammar and mutation rules correctly is out of scope) becomes a link to the chapter page (never to the page you are already on, and never inside another link);
- **adds heading anchors** — every `##` and `###` gets a stable GitHub-style slug id, listed in the "On this page" panel;
- **derives prev/next** from chapter directory order within the current locale, and writes `sitemap.xml` and `hreflang` alternate links across all eight locales.

Chapter numbers come from the directory slug (`01-00-introduction` → 1.0), not from parsing the heading text — the heading reads "Chapter 1.0 — …" in English locales and "Pennod 1.0 — …" in Welsh, so this is the one thing that works for every locale without hard-coding a translation of the word "Chapter".

There is no sidebar. Navigation is the book's own table of contents on each locale's home page — rendered from that locale's `index.md`, so the site and the book cannot drift apart — plus the header links, the breadcrumb, and prev/next at the foot of each chapter.

If a link in the book points at a file that does not exist, the build fails rather than publishing a broken page.

## Themes, language, and accessibility

The header carries one control, `PickerBar`, composing four Lily helpers:

- **Language** — the eight locales above; switches to the equivalent page, not just the locale's home.
- **Theme** — Light, Dark, NHS England / Scotland / Wales (patients and practitioners), and GOV.UK. The choice is persisted, and the first visit follows the operating system's light/dark preference.
- **Text size** — small, medium, large, x-large, persisted in `localStorage`.
- **Share** — copy link, plus any configured share targets.

Themes are plain stylesheets in `static/themes/`; the picker swaps the managed `<link>` in `src/app.html`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys on every push to `main`. For the first deployment, set **Settings → Pages → Build and deployment → Source → GitHub Actions** in the repository.

The setup follows the SvelteKit guidance in [adapter-static → GitHub Pages](https://svelte.dev/docs/kit/adapter-static#GitHub-Pages):

- `fallback: '404.html'` in [`svelte.config.js`](svelte.config.js), so a wrong URL gets this site's own error page instead of GitHub's default 404;
- an empty [`static/.nojekyll`](static/.nojekyll), so GitHub does not run Jekyll over the build output;
- `paths.base` left empty. That guidance's `BASE_PATH` step is only for project pages served from `https://<owner>.github.io/<repo>/`. This repository is named after the organization, so the site is served from the root and every link can stay absolute.
