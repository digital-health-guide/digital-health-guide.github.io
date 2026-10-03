// The book's locales — the source of truth for both the content sync script
// (bin/sync-content.mjs) and the site's routing/UI. Keep in sync with
// ../digital-health-guide/locales/*.
//
// `en-gb` is the default locale: it is the book's source of truth. Every
// locale, the default included, is served under `/<slug>/`. The old unprefixed
// URLs (`/`, `/chapters/…`) redirect to the `/en-gb/` equivalents.

/** @type {{ slug: string, label: string, hreflang: string }[]} */
// Sorted alphabetically by slug (ar-001, bn-001, cy-001, de-001, en-001, en-gb,
// en-gb-oxendict, en-us, es-001, fr-001, hi-001, ja-001, ru-001, zh-001) — not by label, so
// "English - Great Britain" sorts before "English - Great Britain - Oxford"
// rather than by the language name.
export const LOCALES = [
	{ slug: 'ar-001', label: 'العربية', hreflang: 'ar-001' },
	{ slug: 'bn-001', label: 'বাংলা', hreflang: 'bn-001' },
	{ slug: 'cy-001', label: 'Cymraeg', hreflang: 'cy-001' },
	{ slug: 'de-001', label: 'Deutsch', hreflang: 'de-001' },
	{ slug: 'en-001', label: 'English', hreflang: 'en-001' },
	{ slug: 'en-gb', label: 'English - Great Britain', hreflang: 'en-GB' },
	{ slug: 'en-gb-oxendict', label: 'English - Great Britain - Oxford', hreflang: 'en-GB-oxendict' },
	{ slug: 'en-us', label: 'English - United States', hreflang: 'en-US' },
	{ slug: 'es-001', label: 'Español', hreflang: 'es-001' },
	{ slug: 'fr-001', label: 'Français', hreflang: 'fr-001' },
	{ slug: 'hi-001', label: 'हिन्दी', hreflang: 'hi-001' },
	{ slug: 'ja-001', label: '日本語', hreflang: 'ja-001' },
	{ slug: 'ru-001', label: 'Русский', hreflang: 'ru-001' },
	{ slug: 'zh-001', label: '中文', hreflang: 'zh-001' }
];

export const DEFAULT_LOCALE = 'en-gb';

/** @type {Record<string, string>} Retired locale slugs -> the slug that replaced them; their URLs redirect. */
export const RETIRED_LOCALES = {
	'de-de': 'de-001',
	'hi-in': 'hi-001',
	'ja-jp': 'ja-001',
	'zh-cn': 'zh-001'
};

/** @type {Set<string>} */
export const LOCALE_SLUGS = new Set(LOCALES.map((l) => l.slug));

/** @type {Set<string>} Locales served under a `/<slug>/` prefix (all of them). */
export const PREFIXED_LOCALE_SLUGS = LOCALE_SLUGS;

/** @type {Record<string, string>} slug -> display label, for LocalePicker's `localeLabels`. */
export const LOCALE_LABELS = Object.fromEntries(LOCALES.map((l) => [l.slug, l.label]));

/** @type {Record<string, string>} slug -> BCP 47 tag, for `hreflang` alternate links. */
export const HREFLANG_BY_SLUG = Object.fromEntries(LOCALES.map((l) => [l.slug, l.hreflang]));

/** Site path prefix for a locale: '/<slug>'. */
export function localePrefix(slug) {
	return `/${slug}`;
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
