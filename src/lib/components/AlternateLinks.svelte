<script>
	// <link rel="alternate" hreflang="…"> for every locale that has an
	// equivalent page, so search engines offer readers their own language.
	// See https://developers.google.com/search/docs/specialty/international/localized-versions
	import { SITE_URL } from '$lib/site.js';
	import { HREFLANG_BY_SLUG } from '$lib/locales.js';

	/** @type {{ alternates: { locale: string, route: string }[] }} */
	let { alternates } = $props();
</script>

{#each alternates as alt (alt.locale)}
	<link rel="alternate" hreflang={HREFLANG_BY_SLUG[alt.locale]} href={`${SITE_URL}${alt.route}`} />
{/each}
{#if alternates.some((a) => a.locale === 'en-gb')}
	<link
		rel="alternate"
		hreflang="x-default"
		href={`${SITE_URL}${alternates.find((a) => a.locale === 'en-gb').route}`}
	/>
{/if}
