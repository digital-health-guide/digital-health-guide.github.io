import { redirect } from '@sveltejs/kit';
import { DEFAULT_LOCALE, localePrefix } from '#lib/locales.js';

// The unprefixed home page is the old URL of the default locale.
export function load() {
	redirect(308, `${localePrefix(DEFAULT_LOCALE)}/`);
}
