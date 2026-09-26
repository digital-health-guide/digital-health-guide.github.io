// The book, read from the vendored Markdown in content/.
//
// Everything here runs at build time only: it is imported from *.server.js
// modules, so neither the Markdown nor the renderer reaches the browser.

import { renderMarkdown } from './markdown.js';
import { routeFor } from './paths.js';
import { DEFAULT_LOCALE, LOCALES, LOCALE_SLUGS, localePrefix } from './locales.js';

const raw = import.meta.glob('/content/**/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

/** @type {Record<string, string>} content path -> Markdown source */
const sources = Object.fromEntries(
	Object.entries(raw).map(([key, value]) => [key.replace('/content/', ''), value])
);

const firstHeading = (markdown) => {
	const match = /^#\s+(.+)$/m.exec(markdown);
	return match ? match[1].trim() : '';
};

/** The locale a content path belongs to, or null for shared reference material. */
function localeOfFile(file) {
	const slug = file.split('/')[0];
	return LOCALE_SLUGS.has(slug) ? slug : null;
}

/**
 * Chapters for one locale, in book order — the directory names are
 * zero-padded and sortable, e.g. "01-00-introduction".
 *
 * The chapter number comes from the *slug*, not the heading text: the
 * heading reads "Chapter 1.0 — …" in English locales and "Pennod 1.0 — …"
 * in Welsh, so parsing the slug is the one thing that works for every
 * locale without hard-coding a translation of the word "Chapter". Slugs
 * starting "00-" are front matter (the preface) and carry no chapter
 * number, matching the book's own convention.
 */
function chaptersFor(locale) {
	const prefix = `${locale}/chapters/`;
	return Object.keys(sources)
		.filter((file) => file.startsWith(prefix))
		.sort()
		.map((file) => {
			const slug = file.slice(prefix.length, file.length - '/index.md'.length);
			const title = firstHeading(sources[file]);
			const match = /^(\d{2})-(\d{2})-/.exec(slug);
			const number = match && match[1] !== '00' ? `${Number(match[1])}.${Number(match[2])}` : null;
			// Strip a leading "<word> N.M — " (any language) for a clean short name.
			const dash = /[—–-]\s*(.+)$/.exec(title);
			const name = number && dash ? dash[1].trim() : title;
			return { file, route: /** @type {string} */ (routeFor(file)), title, number, name, slug };
		});
}

const chaptersByLocale = new Map(LOCALES.map(({ slug }) => [slug, chaptersFor(slug)]));

/** Resolve a chapter number such as "3.4" to its route within one locale. */
function chapterHrefFor(locale) {
	const routeByNumber = new Map(
		(chaptersByLocale.get(locale) ?? []).filter((c) => c.number).map((c) => [c.number, c.route])
	);
	return (number) => routeByNumber.get(number) ?? null;
}

/**
 * Every route this site publishes.
 *
 * With no argument: every route, across every locale — for the sitemap.
 * With a locale: that locale's own chapters and home page; the default
 * locale's list also includes the shared, unlocalized reference material
 * (glossary, index, style guide, spec), since those are only ever served
 * unprefixed and so belong to exactly one prerender pass.
 */
export function routes(locale) {
	const all = Object.keys(sources)
		.map((file) => ({ file, route: routeFor(file), locale: localeOfFile(file) }))
		// Every locale's own home page is served by its own +page.server.js,
		// not the [...path] catch-all — exclude "/" and "/<locale>/" alike.
		.filter((entry) => entry.route && !LOCALES.some(({ slug }) => entry.route === `${localePrefix(slug)}/`))
		// spec/README.md is a byte-for-byte copy of spec/index.md in the book.
		.filter((entry) => entry.file !== 'spec/README.md');
	if (!locale) return all;
	return all.filter(
		(entry) => entry.locale === locale || (locale === DEFAULT_LOCALE && entry.locale === null)
	);
}

/** The locale a route belongs to: the leading `/<slug>/…` segment, or the default locale. */
function localeForRoute(route) {
	for (const { slug } of LOCALES) {
		if (slug === DEFAULT_LOCALE) continue;
		const prefix = localePrefix(slug);
		if (route === `${prefix}/` || route.startsWith(`${prefix}/`)) return slug;
	}
	return DEFAULT_LOCALE;
}

/**
 * Render one document for a page load.
 *
 * @param {string} route e.g. "/chapters/01-00-introduction/" or "/cy-001/chapters/01-00-introduction/"
 */
export function document(route) {
	const locale = localeForRoute(route);
	const entry =
		routes().find((candidate) => candidate.route === route) ??
		(route === `${localePrefix(locale)}/` ? { file: `${locale}/index.md`, route } : null);
	if (!entry) return null;

	const rendered = renderMarkdown(sources[entry.file], {
		file: entry.file,
		route,
		locale,
		chapterHref: chapterHrefFor(locale)
	});
	const chapters = chaptersByLocale.get(locale) ?? [];
	const index = chapters.findIndex((chapter) => chapter.route === route);
	const sibling = (offset) => {
		const chapter = chapters[index + offset];
		return index === -1 || !chapter ? null : { title: chapter.title, route: chapter.route };
	};

	return {
		route,
		file: entry.file,
		locale,
		title: rendered.title,
		subtitle: rendered.subtitle,
		summary: rendered.summary,
		html: rendered.html,
		headings: rendered.headings,
		previous: sibling(-1),
		next: sibling(1)
	};
}

/** Chapters for one locale, for building navigation/contents. */
export function chapters(locale) {
	return chaptersByLocale.get(locale) ?? [];
}

/**
 * The equivalent route for `route` in `toLocale`, for cross-locale
 * (`hreflang`) links. Every locale shares the same chapter slugs and the
 * same shared reference pages, so this is a straight substitution.
 */
export function equivalentRoute(route, toLocale) {
	const fromLocale = localeForRoute(route);
	const fromPrefix = localePrefix(fromLocale);
	const suffix = fromPrefix && route.startsWith(fromPrefix) ? route.slice(fromPrefix.length) : route;
	// Shared, unlocalized docs (glossary, spec, …) have exactly one route,
	// the same for every locale — nothing to substitute.
	if (suffix !== '/' && !suffix.startsWith('/chapters/')) return null;
	return `${localePrefix(toLocale)}${suffix}`;
}
