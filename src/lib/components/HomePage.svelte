<script>
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import AlternateLinks from '$lib/components/AlternateLinks.svelte';
	import { SITE_URL } from '$lib/site.js';
	import { stringsFor } from '$lib/strings.js';

	/** @type {{ doc: import('$lib/book.js').document, alternates: { locale: string, route: string }[] }} */
	let { doc, alternates } = $props();

	const url = $derived(`${SITE_URL}${doc.route}`);
	const t = $derived(stringsFor(doc.locale));
</script>

<svelte:head>
	<title>{t.siteBrand}{doc.subtitle ? ` — ${doc.subtitle}` : ''}</title>
	<meta name="description" content={doc.summary} />
	<link rel="canonical" href={url} />
	<AlternateLinks {alternates} />
	<meta property="og:title" content={t.siteBrand} />
	<meta property="og:description" content={doc.summary} />
	<meta property="og:type" content="book" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={`${SITE_URL}/icon-1200.png`} />
</svelte:head>

<ArticleLayout label={doc.title} class="prose">
	{@html doc.html}
</ArticleLayout>
