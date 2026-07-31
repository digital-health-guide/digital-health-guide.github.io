import { error } from '@sveltejs/kit';
import { document, routes } from '$lib/book.js';

/** Prerender every document the book publishes, without relying on crawling. */
export function entries() {
	return routes().map(({ route }) => ({ path: route.replace(/^\/|\/$/g, '') }));
}

export function load({ params }) {
	// A rest parameter keeps the trailing slash that trailingSlash: 'always' adds.
	const route = `/${params.path.replace(/\/+$/, '')}/`;
	const doc = document(route);
	if (!doc) error(404, `No page at ${route}`);
	return { doc };
}
