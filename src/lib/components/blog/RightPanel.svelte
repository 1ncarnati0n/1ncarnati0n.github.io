<script lang="ts">
	import type { Snippet } from 'svelte';
	import RelationGraph from './RelationGraph.svelte';
	import type { GraphData } from '$lib/content/graph';

	interface Props {
		graphData: GraphData;
		extra?: Snippet;
	}

	let { graphData, extra }: Props = $props();
</script>

<aside class="hidden xl:block">
	<div class="sticky top-24 space-y-6">
		<RelationGraph data={graphData} />
		{#if extra}
			{@render extra()}
		{/if}
	</div>
</aside>
