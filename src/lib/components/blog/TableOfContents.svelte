<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import type { Heading } from '$lib/types/content';

	interface Props {
		headings: Heading[];
	}

	let { headings }: Props = $props();
	let collapsed = $state(false);
	// Quartz처럼 화면에 보이는 제목 전부를 강조
	const inView = new SvelteSet<string>();

	let minLevel = $derived(headings.length > 0 ? Math.min(...headings.map((h) => h.level)) : 2);

	onMount(() => {
		const headingElements = headings
			.map((h) => document.getElementById(h.slug))
			.filter(Boolean) as HTMLElement[];

		if (headingElements.length === 0) return;

		const observer = new IntersectionObserver((entries) => {
			for (const e of entries) {
				if (e.isIntersecting) inView.add(e.target.id);
				else inView.delete(e.target.id);
			}
		});

		headingElements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

{#if headings.length > 0}
	<nav class="qz-toc" aria-label="목차">
		<button
			type="button"
			class="qz-panel-header"
			class:collapsed
			aria-expanded={!collapsed}
			onclick={() => (collapsed = !collapsed)}
		>
			<h3>Table of Contents</h3>
			<ChevronDown class="qz-fold" size={21} strokeWidth={2} />
		</button>
		{#if !collapsed}
			<ul>
				{#each headings as h (h.slug)}
					<li style:padding-left="{h.level - minLevel}rem">
						<a href="#{h.slug}" class:in-view={inView.has(h.slug)}>{h.text}</a>
					</li>
				{/each}
			</ul>
		{/if}
	</nav>
{/if}
