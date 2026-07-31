// The book, read from the vendored Markdown in content/.
//
// Everything here runs at build time only: it is imported from *.server.js
// modules, so neither the Markdown nor the renderer reaches the browser.

import { renderMarkdown } from './markdown.js';
import { routeFor } from './paths.js';

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

/** Chapters in book order — the filenames are zero-padded and sortable. */
export const chapters = Object.keys(sources)
	.filter((file) => file.startsWith('chapters/'))
	.sort()
	.map((file) => {
		const title = firstHeading(sources[file]);
		const match = /^Chapter\s+(\d+\.\d+)\s*[—–-]\s*(.+)$/.exec(title);
		return {
			file,
			route: /** @type {string} */ (routeFor(file)),
			title,
			number: match ? match[1] : null,
			name: match ? match[2] : title
		};
	});

const routeByNumber = new Map(chapters.filter((c) => c.number).map((c) => [c.number, c.route]));

/** Resolve a chapter number such as "3.4" to its route, for cross-references. */
export const chapterHref = (number) => routeByNumber.get(number) ?? null;

/** Every route this site publishes, in prerender order. */
export function routes() {
	return Object.keys(sources)
		.map((file) => ({ file, route: routeFor(file) }))
		.filter((entry) => entry.route && entry.route !== '/')
		// spec/README.md and spec/index.md are the same document upstream.
		.filter((entry) => entry.file !== 'spec/README.md');
}

/**
 * Render one document for a page load.
 *
 * @param {string} route e.g. "/chapters/01-00-introduction/"
 */
export function document(route) {
	const entry = routes().find((candidate) => candidate.route === route) ??
		(route === '/' ? { file: 'README.md', route: '/' } : null);
	if (!entry) return null;

	const rendered = renderMarkdown(sources[entry.file], {
		file: entry.file,
		route,
		chapterHref
	});
	const index = chapters.findIndex((chapter) => chapter.route === route);
	const sibling = (offset) => {
		const chapter = chapters[index + offset];
		return index === -1 || !chapter ? null : { title: chapter.title, route: chapter.route };
	};

	return {
		route,
		file: entry.file,
		title: rendered.title,
		summary: rendered.summary,
		html: rendered.html,
		headings: rendered.headings,
		previous: sibling(-1),
		next: sibling(1)
	};
}
