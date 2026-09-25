<script>
	import ArticleLayout from '$lib/lily/components/ArticleLayout.svelte';
	import BreadcrumbNav from '$lib/lily/components/BreadcrumbNav.svelte';
	import BreadcrumbList from '$lib/lily/components/BreadcrumbList.svelte';
	import BreadcrumbListItem from '$lib/lily/components/BreadcrumbListItem.svelte';
	import ContentsNav from '$lib/lily/components/ContentsNav.svelte';
	import ContentsList from '$lib/lily/components/ContentsList.svelte';
	import ContentsListItem from '$lib/lily/components/ContentsListItem.svelte';
	import PaginationNav from '$lib/lily/components/PaginationNav.svelte';
	import PaginationList from '$lib/lily/components/PaginationList.svelte';
	import PaginationListItem from '$lib/lily/components/PaginationListItem.svelte';
	import AlternateLinks from '$lib/components/AlternateLinks.svelte';
	import { REPOSITORY, SITE_NAME, SITE_URL } from '$lib/site.js';
	import { localePrefix, bookFilePath } from '$lib/locales.js';
	import { stringsFor } from '$lib/strings.js';

	/** @type {{ doc: import('$lib/book.js').document, alternates: { locale: string, route: string }[] }} */
	let { doc, alternates } = $props();

	const url = $derived(`${SITE_URL}${doc.route}`);
	const source = $derived(`${REPOSITORY}/blob/main/${bookFilePath(doc.file)}`);
	const home = $derived(`${localePrefix(doc.locale)}/`);
	const t = $derived(stringsFor(doc.locale));
	// Chapters sit one level down; the reference pages hang off the contents.
	const parent = $derived(doc.file.includes('/chapters/') ? t.breadcrumbChapters : t.breadcrumbReference);
</script>

<svelte:head>
	<title>{doc.title} — {SITE_NAME}</title>
	<meta name="description" content={doc.summary} />
	<link rel="canonical" href={url} />
	<AlternateLinks {alternates} />
	<meta property="og:title" content={doc.title} />
	<meta property="og:description" content={doc.summary} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={`${SITE_URL}/icon-1200.png`} />
</svelte:head>

<BreadcrumbNav label={t.breadcrumb} class="doc-breadcrumb">
	<BreadcrumbList>
		<BreadcrumbListItem><a href={home}>{t.navContents}</a></BreadcrumbListItem>
		<BreadcrumbListItem>{parent}</BreadcrumbListItem>
		<BreadcrumbListItem current>{doc.title}</BreadcrumbListItem>
	</BreadcrumbList>
</BreadcrumbNav>

{#if doc.headings.length > 2}
	<ContentsNav label={t.onThisPage} class="doc-contents">
		<h2>{t.onThisPage}</h2>
		<ContentsList>
			{#each doc.headings as heading (heading.id)}
				<ContentsListItem data-depth={heading.depth}>
					<a href={`#${heading.id}`}>{heading.text}</a>
				</ContentsListItem>
			{/each}
		</ContentsList>
	</ContentsNav>
{/if}

<ArticleLayout label={doc.title} class="prose">
	{@html doc.html}
</ArticleLayout>

{#if doc.previous || doc.next}
	<PaginationNav label={t.chapterNavigation} class="doc-pagination">
		<PaginationList>
			{#if doc.previous}
				<PaginationListItem>
					<a href={doc.previous.route} rel="prev">
						<span class="direction">{t.previous}</span>
						<span class="title">{doc.previous.title}</span>
					</a>
				</PaginationListItem>
			{/if}
			{#if doc.next}
				<PaginationListItem>
					<a href={doc.next.route} rel="next">
						<span class="direction">{t.next}</span>
						<span class="title">{doc.next.title}</span>
					</a>
				</PaginationListItem>
			{/if}
		</PaginationList>
	</PaginationNav>
{/if}

<p class="doc-source">
	<a href={source}>{t.editOnGitHub}</a> — {t.sourceOfTruth}
</p>
