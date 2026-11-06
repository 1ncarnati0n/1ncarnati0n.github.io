<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
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

	let collapsed = $state(false);

	function toggleFolder(pathKey: string) {
		if (userToggled.has(pathKey)) userToggled.delete(pathKey);
		else userToggled.add(pathKey);
	}
</script>

{#snippet renderNode(node: BlogTreeNode)}
	{#if node.type === 'folder'}
		{@const key = folderKey(node)}
		{@const isOpen = expandedFolders.has(key)}
		<li>
			<button
				type="button"
				class="qz-folder"
				onclick={() => toggleFolder(key)}
				aria-expanded={isOpen}
				aria-controls="folder-{key}"
			>
				<svg width="12" height="12" viewBox="5 8 14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
				{node.name}
			</button>
			{#if isOpen}
				<ul id="folder-{key}">
					{#each node.children as child (child.type === 'folder' ? folderKey(child) : child.slug)}
						{@render renderNode(child)}
					{/each}
				</ul>
			{/if}
		</li>
	{:else}
		<li>
			<a href={resolve('/blog/[slug]', { slug: node.slug })} class:active={node.slug === activeSlug}>
				{node.title}
			</a>
		</li>
	{/if}
{/snippet}

<nav class="qz-explorer" aria-label="Explorer">
	<button
		type="button"
		class="qz-panel-header"
		class:collapsed
		aria-expanded={!collapsed}
		onclick={() => (collapsed = !collapsed)}
	>
		<h2>Blog</h2>
		<ChevronDown class="qz-fold" size={21} strokeWidth={2} />
	</button>
	{#if !collapsed}
		<div class="qz-explorer-content">
			<ul>
				{#each tree as node (node.type === 'folder' ? folderKey(node) : node.slug)}
					{@render renderNode(node)}
				{/each}
			</ul>
		</div>
	{/if}
</nav>
