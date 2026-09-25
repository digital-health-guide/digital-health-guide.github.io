// Shared load-time logic for every route that renders a book document.
// Only ever imported from *.server.js — see the note atop book.js.

import { document, equivalentRoute } from './book.js';
import { LOCALES } from './locales.js';

/** @param {string} route */
export function loadDoc(route) {
	const doc = document(route);
	if (!doc) return null;
	const alternates = LOCALES.map(({ slug }) => ({
		locale: slug,
		route: equivalentRoute(doc.route, slug)
	})).filter(/** @param {{route: string | null}} a */ (a) => a.route);
	return { doc, alternates };
}
