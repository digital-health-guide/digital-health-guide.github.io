// Mapping between vendored content files and site routes.
//
// Content paths are always relative to content/, e.g.
// "en-gb/chapters/01-00-introduction/index.md" or "GLOSSARY.md". The book's
// reference material (glossary, index, style guide, spec) is not localized,
// so it lives at the content root and is served at the same route regardless
// of which locale the reader is browsing.

import { DEFAULT_LOCALE, LOCALE_SLUGS, localePrefix } from './locales.js';

/** Resolve `href` (as written inside `fromFile`) to a content path, or null. */
export function contentPath(href, fromFile) {
	const from = fromFile.includes('/') ? fromFile.slice(0, fromFile.lastIndexOf('/')) : '';
	const segments = href.startsWith('/')
		? href.slice(1).split('/')
		: [...from.split('/'), ...href.split('/')];
	const out = [];
	for (const segment of segments) {
		if (segment === '' || segment === '.') continue;
		if (segment === '..') out.pop();
		else out.push(segment);
	}
	return out.join('/');
}

/** Site route for a content path, or null when the file is not published. */
export function routeFor(path) {
	switch (path) {
		case 'GLOSSARY.md':
			return '/glossary/';
		case 'INDEX.md':
			return '/subject-index/';
		case 'STYLE_GUIDE.md':
			return '/style-guide/';
		// spec/README.md is a byte-for-byte copy of spec/index.md in the book.
		case 'spec/index.md':
		case 'spec/README.md':
			return '/spec/';
	}
	const spec = /^spec\/([\w.-]+)\.md$/.exec(path);
	if (spec) return `/spec/${spec[1]}/`;

	// A link written as "chapters/<slug>/" resolves (via contentPath) to
	// "<locale>/chapters/<slug>" with no filename; the glob key for the same
	// document is "<locale>/chapters/<slug>/index.md". Accept both.
	const chapter = /^([a-z0-9-]+)\/chapters\/([\w.-]+)(?:\/index\.md)?$/.exec(path);
	if (chapter && LOCALE_SLUGS.has(chapter[1])) {
		return `${localePrefix(chapter[1])}/chapters/${chapter[2]}/`;
	}

	const home = /^([a-z0-9-]+)\/index\.md$/.exec(path);
	if (home && LOCALE_SLUGS.has(home[1])) {
		return `${localePrefix(home[1])}/`;
	}

	return null;
}

/** Rewrite a Markdown link into a site link, leaving external links untouched. */
export function rewriteHref(href, fromFile) {
	if (!href) return href;
	if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#'))
		return href;
	const hashAt = href.indexOf('#');
	const hash = hashAt === -1 ? '' : href.slice(hashAt);
	const target = hashAt === -1 ? href : href.slice(0, hashAt);
	if (!target) return href;
	const route = routeFor(contentPath(target, fromFile));
	return route ? route + hash : href;
}

export { DEFAULT_LOCALE };
