<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Series | 1ncarnati0n</title>
	<meta name="description" content="Blog posts grouped by series." />
</svelte:head>

<section class="mx-auto max-w-4xl">
	<h1>Series</h1>

	{#if data.series.length === 0}
		<p>아직 series가 없습니다.</p>
	{:else}
		<div class="mt-8 space-y-4">
			{#each data.series as series (series.name)}
				<a
					href={resolve('/series/[series]', { series: series.name })}
					class="block rounded border px-4 py-3 hover:opacity-70"
					style:border-color="var(--color-border)"
				>
					<span class="font-medium">{series.name}</span>
					<span style:color="var(--color-secondary)">({series.count})</span>
				</a>
			{/each}
		</div>
	{/if}
</section>
