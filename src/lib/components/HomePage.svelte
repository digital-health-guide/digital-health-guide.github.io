<script>
	import ArticleLayout from '#lib/lily/components/ArticleLayout.svelte';
	import AlternateLinks from '#lib/components/AlternateLinks.svelte';
	import { SITE_URL } from '#lib/site.js';
	import { stringsFor } from '#lib/strings.js';
	import { LOCALE_SLUGS } from '#lib/locales.js';
	import { HERO, ENDONYMS } from '#lib/hero.js';

	/** @type {{ doc: import('#lib/book.js').document, alternates: { locale: string, route: string }[] }} */
	let { doc, alternates } = $props();

	const url = $derived(`${SITE_URL}${encodeURI(doc.route)}`);
	const t = $derived(stringsFor(doc.locale));

	/** @param {string} text */
	const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	// The hero is the page's H1, the H3 subheadline, and the first paragraph; the
	// "Translations:" sentence follows that paragraph.
	const html = $derived.by(() => {
		const label = HERO[doc.locale]?.translations ?? HERO['en-001'].translations;
		const links = [...LOCALE_SLUGS]
			.filter((slug) => slug in ENDONYMS)
			.map(
				(slug) =>
					`<a href="/${slug}/"${slug === doc.locale ? ' aria-current="page"' : ''}>${esc(ENDONYMS[slug])}</a>`
			)
			.join(', ');
		const sentence = `<p class="home-translations">${esc(label)}${links}</p>`;
		const subheading = doc.html.indexOf('</h3>');
		const end = doc.html.indexOf('</p>', Math.max(subheading, 0));
		return end === -1 ? doc.html : doc.html.slice(0, end + 4) + sentence + doc.html.slice(end + 4);
	});
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
	{@html html}
</ArticleLayout>
