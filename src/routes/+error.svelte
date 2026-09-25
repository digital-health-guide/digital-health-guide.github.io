<script>
	import { page } from '$app/state';
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import { SITE_NAME } from '$lib/site.js';
	import { PREFIXED_LOCALE_SLUGS, DEFAULT_LOCALE } from '$lib/locales.js';
	import { stringsFor } from '$lib/strings.js';

	// The static 404.html is shared by every unmatched URL; once it hydrates,
	// page.url reflects the real browser location, so both the chrome and
	// home can still follow the reader's own locale rather than always the
	// default.
	const locale = $derived.by(() => {
		const first = page.url.pathname.split('/')[1] ?? '';
		return PREFIXED_LOCALE_SLUGS.has(first) ? first : DEFAULT_LOCALE;
	});
	const t = $derived(stringsFor(locale));
	const home = $derived(locale === DEFAULT_LOCALE ? '/' : `/${locale}/`);
	const heading = $derived(page.status === 404 ? t.notFoundHeading : t.errorHeading);
</script>

<svelte:head>
	<title>{heading} — {SITE_NAME}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<ArticleLayout label={heading} class="prose">
	<h1>{heading}</h1>
	{#if page.status === 404}
		<p>
			{t.notFoundBody} <code>{page.url.pathname}</code>. {t.notFoundBodyEnd}
		</p>
	{:else}
		<p>{page.error?.message ?? t.errorBodyFallback}</p>
	{/if}
	<p>
		{t.tryPrefix} <a href={home}>{t.tryTableOfContents}</a>, <a href="/glossary/">{t.tryGlossary}</a>,
		{t.tryOr} <a href="/subject-index/">{t.tryIndex}</a>.
	</p>
</ArticleLayout>
