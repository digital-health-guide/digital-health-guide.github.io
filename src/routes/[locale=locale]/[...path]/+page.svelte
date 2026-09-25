<script>
	import DocPage from '$lib/components/DocPage.svelte';

	let { data } = $props();
</script>

<DocPage doc={data.doc} alternates={data.alternates} />
