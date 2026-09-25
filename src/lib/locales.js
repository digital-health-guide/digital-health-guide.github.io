// The book's locales — the source of truth for both the content sync script
// (bin/sync-content.mjs) and the site's routing/UI. Keep in sync with
// ../digital-health-guide/locales/*.
//
// `en-gb` is the default locale: it is the book's source of truth, and it is
// served unprefixed (`/`, `/chapters/…/`) to keep the site's existing URLs
// working. Every other locale is served under `/<slug>/`.

/** @type {{ slug: string, label: string, hreflang: string }[]} */
export const LOCALES = [
	{ slug: 'en-gb', label: 'English (UK)', hreflang: 'en-GB' },
	{ slug: 'en-us', label: 'English (US)', hreflang: 'en-US' },
	{ slug: 'en-gb-oxendict', label: 'English (UK, Oxford spelling)', hreflang: 'en-GB-oxendict' },
	{ slug: 'en-001', label: 'English (International)', hreflang: 'en-001' },
	{ slug: 'cy-gb', label: 'Cymraeg', hreflang: 'cy-GB' }
];

export const DEFAULT_LOCALE = 'en-gb';

/** @type {Set<string>} */
export const LOCALE_SLUGS = new Set(LOCALES.map((l) => l.slug));

/** @type {Set<string>} Locales served under a `/<slug>/` prefix (everything but the default). */
export const PREFIXED_LOCALE_SLUGS = new Set(
	LOCALES.filter((l) => l.slug !== DEFAULT_LOCALE).map((l) => l.slug)
);

/** @type {Record<string, string>} slug -> display label, for LocalePicker's `localeLabels`. */
export const LOCALE_LABELS = Object.fromEntries(LOCALES.map((l) => [l.slug, l.label]));

/** @type {Record<string, string>} slug -> BCP 47 tag, for `hreflang` alternate links. */
export const HREFLANG_BY_SLUG = Object.fromEntries(LOCALES.map((l) => [l.slug, l.hreflang]));

/** Site path prefix for a locale: '' for the default locale, '/<slug>' otherwise. */
export function localePrefix(slug) {
	return slug === DEFAULT_LOCALE ? '' : `/${slug}`;
}

/**
 * The book repository's own path for a content/ path, for "edit this page"
 * links. Locale content is vendored from `locales/<slug>/…`; the shared
 * reference material (glossary, index, style guide, spec) is vendored from
 * the book repo's root and keeps the same path.
 */
export function bookFilePath(file) {
	const slug = file.split('/')[0];
	return LOCALE_SLUGS.has(slug) ? `locales/${file}` : file;
}
