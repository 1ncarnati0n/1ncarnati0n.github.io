<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import RelationGraph from './RelationGraph.svelte';
	import type { Backlink, GraphData } from '$lib/content/graph';

	interface Props {
		graphData: GraphData;
		backlinks?: Backlink[];
		extra?: Snippet;
	}

	let { graphData, backlinks = [], extra }: Props = $props();
</script>

<aside class="hidden xl:block">
	<div class="sticky top-24 space-y-6">
		<RelationGraph data={graphData} />
		{#if backlinks.length > 0}
			<div>
				<p
					class="text-xs font-medium uppercase tracking-widest mb-3"
					style:color="var(--color-secondary)"
				>
					Backlinks
				</p>
				<ul class="space-y-3">
					{#each backlinks as backlink (backlink.slug)}
						<li>
							<a
								href={resolve('/blog/[slug]', { slug: backlink.slug })}
								class="block text-xs hover:opacity-70"
							>
								<span class="block font-medium" style:color="var(--color-primary)">
									{backlink.title}
								</span>
								<span class="line-clamp-2" style:color="var(--color-secondary)">
									{backlink.description}
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if extra}
			{@render extra()}
		{/if}
	</div>
</aside>
