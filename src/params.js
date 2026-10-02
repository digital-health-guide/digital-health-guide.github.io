import { defineParams } from '@sveltejs/kit/params';
import { PREFIXED_LOCALE_SLUGS } from '#lib/locales.js';

// Matches the `/<locale>/…` URL prefix — only the locales served with one
// (everything except the default locale, en-gb, which is unprefixed). This
// keeps `/chapters/…`, `/glossary/`, etc. routing through the existing
// top-level catch-all instead of being swallowed here.
/** @param {string} param */
function matchLocale(param) {
	return PREFIXED_LOCALE_SLUGS.has(param);
}

export const params = defineParams({
	locale: (param) => (matchLocale(param) ? param : undefined)
});
