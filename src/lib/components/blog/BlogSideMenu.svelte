<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import type { BlogTreeNode, BlogTreeFolderNode } from '$lib/types/content';

	interface Props {
		tree: BlogTreeNode[];
		expandAll?: boolean;
	}

	let { tree, expandAll = false }: Props = $props();

	// 현재 활성 slug
	let activeSlug = $derived(
		$page.url.pathname.startsWith('/blog/')
			? $page.url.pathname.replace('/blog/', '').replace(/\/$/, '')
			: undefined
	);

	function folderKey(node: BlogTreeFolderNode): string {
		return node.pathParts.join('/');
	}

	function collectAutoExpanded(nodes: BlogTreeNode[], slug?: string): SvelteSet<string> {
		const expanded = new SvelteSet<string>();
		function walk(node: BlogTreeNode): boolean {
			if (node.type === 'post') return node.slug === slug;
			const hasActiveChild = node.children.some(walk);
			if (hasActiveChild) expanded.add(folderKey(node));
			return hasActiveChild;
		}
		nodes.forEach(walk);
		return expanded;
	}

	function collectAllFolders(nodes: BlogTreeNode[]): SvelteSet<string> {
		const folders = new SvelteSet<string>();
		function walk(node: BlogTreeNode) {
			if (node.type === 'folder') {
				folders.add(folderKey(node));
				node.children.forEach(walk);
			}
		}
		nodes.forEach(walk);
		return folders;
	}

	// 자동 확장 대상
	let autoExpanded = $derived(
		expandAll ? collectAllFolders(tree) : collectAutoExpanded(tree, activeSlug)
	);

	// 사용자 수동 토글
	let userToggled = new SvelteSet<string>();
	let prevSlug = $state<string | undefined>(undefined);

	// activeSlug가 바뀌면 수동 토글 초기화
	$effect(() => {
		if (prevSlug !== activeSlug) {
			prevSlug = activeSlug;
			userToggled.clear();
		}
	});

	// 최종 확장 상태 = 자동 확장 XOR 사용자 토글
	let expandedFolders = $derived.by(() => {
		const result = new SvelteSet(autoExpanded);
		for (const key of userToggled) {
			if (result.has(key)) result.delete(key);
			else result.add(key);
		}
		return result;
	});

	function toggleFolder(pathKey: string) {
		if (userToggled.has(pathKey)) userToggled.delete(pathKey);
		else userToggled.add(pathKey);
	}
</script>

{#snippet renderNode(node: BlogTreeNode, depth: number)}
	{#if node.type === 'folder'}
		{@const key = folderKey(node)}
		{@const isOpen = expandedFolders.has(key)}
		<li class="font-sans">
			<button
				type="button"
				onclick={() => toggleFolder(key)}
				class="flex items-center gap-1.5 w-full text-left py-1.5 text-sm
					transition-colors hover:caret-amber-200 cursor-pointer"
				style:padding-left="{depth * 0.9 + 0.75}rem"
				aria-expanded={isOpen}
				aria-controls="folder-{key}"
			>
				<span
					class="inline-block text-[0.6rem] transition-transform duration-200 text-secondary"
					style:transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
				>
					▶
				</span>
				<span class="font-medium" style:color="var(--color-primary)">
					{node.name}
				</span>
			</button>

			{#if isOpen}
				<ul id="folder-{key}" class="relative">
					<span
						class="absolute top-0 bottom-2 w-px bg-border"
						style:left="{(depth + 1) * 0.8 + 0.3}rem"
						aria-hidden="true"
					></span>
					{#each node.children as child (child.type === 'folder' ? folderKey(child) : child.slug)}
						{@render renderNode(child, depth + 1)}
					{/each}
				</ul>
			{/if}
		</li>
	{:else}
		{@const isActive = node.slug === activeSlug}
		<li>
			<a
				href={resolve('/blog/[slug]', { slug: node.slug })}
				class="block py-1 text-sm truncate transition-colors hover:opacity-70"
				style:padding-left="{depth * 0.9 + 0.75}rem"
				style:color={isActive ? 'var(--color-primary)' : 'var(--color-secondary)'}
				style:font-weight={isActive ? 600 : 400}
			>
				{node.title}
			</a>
		</li>
	{/if}
{/snippet}

<nav class="fixed pt-1">
	<ul>
		{#each tree as node (node.type === 'folder' ? folderKey(node) : node.slug)}
			{@render renderNode(node, 0)}
		{/each}
	</ul>
</nav>
