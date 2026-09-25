<script>
	import HomePage from '$lib/components/HomePage.svelte';

	let { data } = $props();
</script>

<HomePage doc={data.doc} alternates={data.alternates} />
