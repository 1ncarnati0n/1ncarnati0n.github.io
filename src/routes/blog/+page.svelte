<script lang="ts">
	import { resolve } from '$app/paths';
	import RightPanel from '$lib/components/blog/RightPanel.svelte';
	import { formatQuartzDate, SITE_DESCRIPTION } from '$lib/content/site';
	import type { PageData } from './$types';
	import type { LayoutData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();
</script>

<svelte:head>
	<title>Blog | 1ncarnati0n</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<!-- 본문: Quartz 폴더 페이지와 같은 목록 -->
<div class="qz-center">
	<nav class="qz-breadcrumbs" aria-label="breadcrumbs">
		<div><span>Home</span></div>
	</nav>
	<h1 class="qz-title">Blog</h1>
	<p>{data.posts.length} items under this folder.</p>

	<ul class="qz-list">
		{#each data.posts as post (post.slug)}
			<li>
				<div class="qz-section">
					<p class="qz-section-meta">
						{#if post.date}
							<time datetime={post.date}>{formatQuartzDate(post.date)}</time>
						{/if}
					</p>
					<h3><a href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a></h3>
					<ul class="qz-tags">
						{#each post.tags as tag (tag)}
							<li><a href={resolve('/tags/[tag]', { tag })}>{tag}</a></li>
						{/each}
					</ul>
				</div>
			</li>
		{/each}
	</ul>
</div>

<!-- 우측: Graph만 -->
<RightPanel graphData={data.graphData} />
