<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.work.title} | 1ncarnati0n</title>
	<meta name="description" content={data.work.description} />
</svelte:head>

<article class="max-w-5xl mx-auto">
	{#if data.work.cover}
		<img src={data.work.cover} alt="" class="mb-8 w-full rounded" />
	{/if}
	<h1 class="font-bold">{data.work.title}</h1>
	<p>{data.work.description}</p>
	<div class="mt-3 flex flex-wrap gap-2 text-xs">
		<span>{data.work.status}</span>
		<span>{data.work.category}</span>
		{#each data.work.tools as tool (tool)}
			<span>{tool}</span>
		{/each}
	</div>
	<div class="prose-custom mt-10">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.html}
	</div>
	{#if data.work.gallery.length > 0}
		<section aria-label="갤러리" class="mt-12 grid gap-4 sm:grid-cols-2">
			{#each data.work.gallery as src, i (src)}
				<img {src} alt="{data.work.title} 이미지 {i + 1}" loading="lazy" class="w-full rounded" />
			{/each}
		</section>
	{/if}
</article>
