import { error, redirect } from '@sveltejs/kit';
import { routes, sharedRoutes } from '#lib/book.js';
import { loadDoc } from '#lib/pageData.js';
import { DEFAULT_LOCALE, RETIRED_LOCALES, localePrefix } from '#lib/locales.js';

const strip = (route) => route.replace(/^\/|\/$/g, '');

/**
 * Prerender the shared reference pages, plus the old unprefixed chapter URLs
 * (which redirect to the default locale), without relying on crawling.
 */
export function entries() {
	const prefix = localePrefix(DEFAULT_LOCALE);
	return [
		...sharedRoutes().map(({ route }) => ({ path: strip(route) })),
		...routes(DEFAULT_LOCALE).map(({ route }) => ({ path: strip(route.slice(prefix.length)) })),
		// Retired locale slugs: the home page and every chapter.
		...Object.entries(RETIRED_LOCALES).flatMap(([from, to]) =>
			[`/${to}/`, ...routes(to).map(({ route }) => route)].map((route) => ({
				path: strip(`/${from}${route.slice(localePrefix(to).length)}`)
			}))
		)
	];
}

export function load({ params }) {
	// A rest parameter keeps the trailing slash that trailingSlash: 'always' adds.
	const route = `/${params.path.replace(/\/+$/, '')}/`;
	const [first, ...rest] = params.path.split('/');
	if (first in RETIRED_LOCALES) {
		const target = `/${RETIRED_LOCALES[first]}/${rest.join('/')}`.replace(/\/+$/, '') + '/';
		if (loadDoc(target)) redirect(308, target);
	}
	const data = loadDoc(route);
	if (data) return data;
	// Old URLs of the default locale were unprefixed.
	const prefixed = `${localePrefix(DEFAULT_LOCALE)}${route}`;
	if (loadDoc(prefixed)) redirect(308, prefixed);
	error(404, `No page at ${route}`);
}
