<script>
	import { DEFAULT_LOCALE, localePrefix } from '#lib/locales.js';

	const home = `${localePrefix(DEFAULT_LOCALE)}/`;
	// `/?<target>` is a search (see SearchGate), so only a bare `/` redirects.
	// Runs before hydration, on the client: a server-side redirect would drop the query.
	const redirect = `<script>if (!location.search) location.replace(${JSON.stringify(home)} + location.hash);<\/script>`;
</script>

<svelte:head>
	<link rel="canonical" href="https://digital-health-guide.github.io{home}" />
	{@html redirect}
	<noscript><meta http-equiv="refresh" content="0;url={home}" /></noscript>
</svelte:head>

<p><a href={home}>Continue to the book</a></p>
