<script>
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import { SITE_NAME, SITE_URL } from '$lib/site.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{SITE_NAME} — ways of working for digital health and care</title>
	<meta name="description" content={data.doc.summary} />
	<link rel="canonical" href={`${SITE_URL}/`} />
	<meta property="og:title" content={SITE_NAME} />
	<meta property="og:description" content={data.doc.summary} />
	<meta property="og:type" content="book" />
	<meta property="og:url" content={`${SITE_URL}/`} />
	<meta property="og:image" content={`${SITE_URL}/icon-1200.png`} />
</svelte:head>

<ArticleLayout label={data.doc.title} class="prose">
	{@html data.doc.html}
</ArticleLayout>
