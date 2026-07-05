<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tags | 1ncarnati0n</title>
	<meta name="description" content="Blog posts grouped by tag." />
</svelte:head>

<section class="mx-auto max-w-4xl">
	<h1>Tags</h1>

	{#if data.tags.length === 0}
		<p>아직 tag가 없습니다.</p>
	{:else}
		<div class="mt-8 flex flex-wrap gap-3">
			{#each data.tags as tag (tag.name)}
				<a
					href={resolve('/tags/[tag]', { tag: tag.name })}
					class="rounded-full border px-4 py-2 text-sm hover:opacity-70"
					style:border-color="var(--color-border)"
				>
					#{tag.name} <span style:color="var(--color-secondary)">({tag.count})</span>
				</a>
			{/each}
		</div>
	{/if}
</section>
