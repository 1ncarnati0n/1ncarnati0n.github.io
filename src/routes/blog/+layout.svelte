<script lang="ts">
	import BlogSideMenu from '$lib/components/blog/BlogSideMenu.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="qz">
	<aside class="qz-sidebar qz-left">
		<BlogSideMenu tree={data.tree} />
	</aside>

	<!-- 중앙(.qz-center) + 우측(RightPanel)은 각 page가 구성 -->
	{@render children()}
</div>
