// Matches the `/<locale>/…` URL prefix — only the locales served with one
// (everything except the default locale, en-gb, which is unprefixed). This
// keeps `/chapters/…`, `/glossary/`, etc. routing through the existing
// top-level catch-all instead of being swallowed here.

import { PREFIXED_LOCALE_SLUGS } from '$lib/locales.js';

/** @param {string} param */
export function match(param) {
	return PREFIXED_LOCALE_SLUGS.has(param);
}
