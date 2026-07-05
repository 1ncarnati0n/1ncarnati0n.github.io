<script lang="ts">
	import BlogArticle from '$lib/components/blog/BlogArticle.svelte';
	import RightPanel from '$lib/components/blog/RightPanel.svelte';
	import TableOfContents from '$lib/components/blog/TableOfContents.svelte';
	import type { PageData } from './$types';
	import type { LayoutData } from '../$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href={data.meta.url} />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={data.meta.url} />
	{#if data.meta.image}
		<meta property="og:image" content={data.meta.image} />
	{/if}
	<meta name="twitter:card" content={data.meta.image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.meta.description} />
	{#if data.meta.image}
		<meta name="twitter:image" content={data.meta.image} />
	{/if}
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
<RightPanel graphData={data.graphData} backlinks={data.backlinks}>
	{#snippet extra()}
		<TableOfContents headings={data.post.headings} />
	{/snippet}
</RightPanel>
