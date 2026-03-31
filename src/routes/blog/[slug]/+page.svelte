<script lang="ts">
	import BlogArticle from '$lib/components/blog/BlogArticle.svelte';
	import RightPanel from '$lib/components/blog/RightPanel.svelte';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import type { PageData } from './$types';
	import type { LayoutData } from '../$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} | 1ncarnati0n</title>
	<meta name="description" content={data.post.description} />
</svelte:head>

<!-- 본문 -->
<div class="flex justify-center">
	<BlogArticle
		title={data.post.title}
		date={new Date(data.post.date)}
		readingTime={data.post.readingTime}
		tags={data.post.tags}
		cssClasses={data.post.cssClasses}
		html={data.html}
	/>
</div>

<!-- 우측: Graph + TOC -->
<RightPanel graphData={data.graphData}>
	{#snippet extra()}
		<TableOfContents headings={data.post.headings} />
	{/snippet}
</RightPanel>
