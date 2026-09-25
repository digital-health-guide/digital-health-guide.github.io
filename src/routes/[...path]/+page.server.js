import { error } from '@sveltejs/kit';
import { routes } from '$lib/book.js';
import { loadDoc } from '$lib/pageData.js';
import { DEFAULT_LOCALE } from '$lib/locales.js';

/** Prerender every document the default locale publishes, without relying on crawling. */
export function entries() {
	return routes(DEFAULT_LOCALE).map(({ route }) => ({ path: route.replace(/^\/|\/$/g, '') }));
}

export function load({ params }) {
	// A rest parameter keeps the trailing slash that trailingSlash: 'always' adds.
	const route = `/${params.path.replace(/\/+$/, '')}/`;
	const data = loadDoc(route);
	if (!data) error(404, `No page at ${route}`);
	return data;
}
