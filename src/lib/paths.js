// Mapping between vendored content files and site routes.
// Content paths are always relative to content/, e.g. "chapters/01-00-introduction.md".

/** Resolve `href` (as written inside `fromFile`) to a content path, or null. */
export function contentPath(href, fromFile) {
	const from = fromFile.includes('/') ? fromFile.slice(0, fromFile.lastIndexOf('/')) : '';
	const segments = href.startsWith('/') ? href.slice(1).split('/') : [...from.split('/'), ...href.split('/')];
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
		case 'README.md':
			return '/';
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
	const chapter = /^chapters\/([\w.-]+)\.md$/.exec(path);
	if (chapter) return `/chapters/${chapter[1]}/`;
	const spec = /^spec\/([\w.-]+)\.md$/.exec(path);
	if (spec) return `/spec/${spec[1]}/`;
	return null;
}

/** Rewrite a Markdown link into a site link, leaving external links untouched. */
export function rewriteHref(href, fromFile) {
	if (!href) return href;
	if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//') || href.startsWith('#')) return href;
	const hashAt = href.indexOf('#');
	const hash = hashAt === -1 ? '' : href.slice(hashAt);
	const target = hashAt === -1 ? href : href.slice(0, hashAt);
	if (!target) return href;
	const route = routeFor(contentPath(target, fromFile));
	return route ? route + hash : href;
}
