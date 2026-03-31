<script lang="ts">
	import RightPanel from '$lib/components/blog/RightPanel.svelte';
	import type { PageData } from './$types';
	import type { LayoutData } from './$types';

	let { data }: { data: PageData & LayoutData } = $props();

	let topicCount = $derived(data.tree.filter((node) => node.type === 'folder').length);
</script>

<svelte:head>
	<title>Blog | 1ncarnati0n</title>
</svelte:head>

<!-- 본문: 포스트 목록 -->
<section class="min-w-0">
	<div class="mb-12">
		<h2 class="text-xl font-medium">Blog Summaries</h2>
		<p class="mt-3">
			왼쪽에서는 `contents/blog` 트리 구조 그대로 글을 탐색하고,
			오른쪽에서는 각 문서의 핵심 요약을 빠르게 훑어볼 수 있습니다.
		</p>
		<div class="mt-4 flex flex-wrap gap-2 text-sm">
			<span
				class="rounded-full px-3 py-1"
				style:background-color="var(--color-surface)"
				style:color="var(--color-secondary)"
			>
				{topicCount} topics
			</span>
			<span
				class="rounded-full px-3 py-1"
				style:background-color="var(--color-surface)"
				style:color="var(--color-secondary)"
			>
				{data.posts.length} posts
			</span>
		</div>
	</div>

	<div class="space-y-8">
		{#each data.posts as post}
			<article
				class="rounded-2xl border px-5 py-5 transition-colors"
				style:border-color="var(--color-border)"
				style:background-color="var(--color-surface)"
			>
				<a href="/blog/{post.slug}" class="block group no-underline">
					<div class="mb-2 text-xs uppercase tracking-[0.16em]">
						{post.sourcePathParts.join(' / ') || 'Root'}
					</div>
					<h3 class="text-lg font-medium transition-opacity group-hover:opacity-70">
						{post.title}
					</h3>
					<p class="mt-2 text-sm">
						{post.description || '요약이 없는 문서입니다.'}
					</p>
					<div class="mt-4 flex flex-wrap items-center gap-3 text-xs">
						<time datetime={post.date}>
							{new Date(post.date).toLocaleDateString('ko-KR')}
						</time>
						<span>·</span>
						<span>{post.readingTime}분 읽기</span>
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>

<!-- 우측: Graph만 -->
<RightPanel graphData={data.graphData} />
