<script>
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import AlternateLinks from '$lib/components/AlternateLinks.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/site.js';

	/** @type {{ doc: import('$lib/book.js').document, alternates: { locale: string, route: string }[] }} */
	let { doc, alternates } = $props();

	const url = $derived(`${SITE_URL}${doc.route}`);
</script>

<svelte:head>
	<title>{SITE_NAME}{doc.subtitle ? ` — ${doc.subtitle}` : ''}</title>
	<meta name="description" content={doc.summary} />
	<link rel="canonical" href={url} />
	<AlternateLinks {alternates} />
	<meta property="og:title" content={SITE_NAME} />
	<meta property="og:description" content={doc.summary} />
	<meta property="og:type" content="book" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={`${SITE_URL}/icon-1200.png`} />
</svelte:head>

<ArticleLayout label={doc.title} class="prose">
	{@html doc.html}
</ArticleLayout>
