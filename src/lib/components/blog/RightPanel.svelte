<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import RelationGraph from './RelationGraph.svelte';
	import type { Backlink, GraphData } from '$lib/content/graph';

	interface Props {
		graphData: GraphData;
		backlinks?: Backlink[];
		toc?: Snippet;
	}

	let { graphData, backlinks = [], toc }: Props = $props();
</script>

<!-- Quartz 우측 사이드바 순서: TOC → Backlinks. 그래프는 원본에 없지만 유지 -->
<aside class="qz-sidebar qz-right">
	{#if toc}
		{@render toc()}
	{/if}
	{#if backlinks.length > 0}
		<div class="qz-backlinks">
			<h3>Backlinks</h3>
			<ul>
				{#each backlinks as backlink (backlink.slug)}
					<li>
						<a href={resolve('/blog/[slug]', { slug: backlink.slug })}>{backlink.title}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<RelationGraph data={graphData} />
</aside>
