<script>
	import DocPage from '#lib/components/DocPage.svelte';
	import HomePage from '#lib/components/HomePage.svelte';

	let { data } = $props();

	// A locale alias such as /en/ renders its world locale's home page.
	const isHome = $derived(data.doc.route === `/${data.doc.locale}/`);
</script>

{#if isHome}
	<HomePage doc={data.doc} alternates={data.alternates} />
{:else}
	<DocPage doc={data.doc} alternates={data.alternates} />
{/if}
