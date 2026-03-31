<script lang="ts">
	import BlogSideMenu from '$lib/components/blog/BlogSideMenu.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<div class="grid grid-cols-1 lg:grid-cols-[200px_1fr] xl:grid-cols-[250px_1fr_200px] gap-12">
	<!-- 좌측: 트리 사이드메뉴 -->
	<aside class="hidden lg:block">
		<BlogSideMenu tree={data.tree} />
	</aside>

	<!-- 중앙 + 우측: 각 page가 RightPanel로 구성 -->
	{@render children()}
</div>
