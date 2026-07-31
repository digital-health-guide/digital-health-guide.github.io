import { contents } from '$lib/book.js';

export const prerender = true;
// Directory-style URLs so GitHub Pages serves index.html without a redirect.
export const trailingSlash = 'always';

export function load() {
	return { contents: contents() };
}
