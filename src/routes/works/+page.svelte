<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Works | 1ncarnati0n</title>
	<meta name="description" content="Portfolio projects." />
</svelte:head>

<section class="mx-auto max-w-5xl">
	<h1>Works</h1>

	{#if data.works.length === 0}
		<p class="mt-6 font-sans">아직 공개 project가 없습니다.</p>
	{:else}
		<div class="mt-8 grid gap-6 md:grid-cols-2">
			{#each data.works as work (work.slug)}
				<article
					class="rounded border p-5"
					style:border-color="var(--color-border)"
					style:background-color="var(--color-surface)"
				>
					<a href={resolve('/works/[slug]', { slug: work.slug })} class="block hover:opacity-70">
						<h2>{work.title}</h2>
						<p>{work.description}</p>
						<div class="mt-3 flex flex-wrap gap-2 text-xs">
							<span>{work.status}</span>
							<span>{work.category}</span>
							{#each work.tools as tool (tool)}
								<span>{tool}</span>
							{/each}
						</div>
					</a>
				</article>
			{/each}
		</div>
	{/if}
</section>
