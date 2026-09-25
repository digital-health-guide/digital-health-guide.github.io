<script>
	import { page } from '$app/state';
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import { SITE_NAME } from '$lib/site.js';
	import { PREFIXED_LOCALE_SLUGS } from '$lib/locales.js';

	const heading = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
	// The static 404.html is shared by every unmatched URL; once it hydrates,
	// page.url reflects the real browser location, so home can still point at
	// the reader's own locale rather than always the default.
	const home = $derived.by(() => {
		const first = page.url.pathname.split('/')[1] ?? '';
		return PREFIXED_LOCALE_SLUGS.has(first) ? `/${first}/` : '/';
	});
</script>

<svelte:head>
	<title>{heading} — {SITE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<ArticleLayout label={heading} class="prose">
	<h1>{heading}</h1>
	{#if page.status === 404}
		<p>
			There is no page at <code>{page.url.pathname}</code>. The book may have moved or renamed it.
		</p>
	{:else}
		<p>{page.error?.message ?? 'The page could not be loaded.'}</p>
	{/if}
	<p>
		Try the <a href={home}>table of contents</a>, the <a href="/glossary/">glossary</a>, or the
		<a href="/subject-index/">index</a>.
	</p>
</ArticleLayout>
