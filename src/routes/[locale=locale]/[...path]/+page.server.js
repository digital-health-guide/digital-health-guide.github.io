import { error } from '@sveltejs/kit';
import { routes } from '$lib/book.js';
import { loadDoc } from '$lib/pageData.js';
import { PREFIXED_LOCALE_SLUGS } from '$lib/locales.js';

/** Prerender every document this locale publishes, without relying on crawling. */
export function entries() {
	return [...PREFIXED_LOCALE_SLUGS].flatMap((locale) =>
		routes(locale).map(({ route }) => ({
			locale,
			// route is "/<locale>/chapters/<slug>/"; strip both the locale prefix
			// and the trailing slash to get the [...path] rest-parameter value.
			path: route.slice(`/${locale}/`.length).replace(/\/+$/, '')
		}))
	);
}

export function load({ params }) {
	// A rest parameter keeps the trailing slash that trailingSlash: 'always' adds.
	const route = `/${params.locale}/${params.path.replace(/\/+$/, '')}/`;
	const data = loadDoc(route);
	if (!data) error(404, `No page at ${route}`);
	return data;
}
