import { defineParams } from '@sveltejs/kit/params';
import { PREFIXED_LOCALE_SLUGS } from '#lib/locales.js';

// Matches the `/<locale>/…` URL prefix. Shared pages (`/glossary/`, `/spec/`,
// …) and the legacy unprefixed URLs stay with the top-level catch-all.
/** @param {string} param */
function matchLocale(param) {
	return PREFIXED_LOCALE_SLUGS.has(param);
}

export const params = defineParams({
	locale: (param) => (matchLocale(param) ? param : undefined)
});
