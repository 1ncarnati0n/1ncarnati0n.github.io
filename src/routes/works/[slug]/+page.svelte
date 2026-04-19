<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.work.title} | 1ncarnati0n</title>
</svelte:head>

<article class="max-w-5xl mx-auto">
	<h1 class="font-bold">{data.work.title}</h1>
	<p>{data.work.summary}</p>
</article>
