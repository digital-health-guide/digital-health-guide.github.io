<script>
	import { DEFAULT_LOCALE, localePrefix } from '#lib/locales.js';

	const home = `${localePrefix(DEFAULT_LOCALE)}/`;
	// Runs before hydration; keeps the query string and fragment.
	const redirect = `<script>location.replace(${JSON.stringify(home)} + location.search + location.hash);<\/script>`;
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content="0;url={home}" />
	<link rel="canonical" href="https://digital-health-guide.github.io{home}" />
	{@html redirect}
</svelte:head>

<p><a href={home}>Continue to the book</a></p>
