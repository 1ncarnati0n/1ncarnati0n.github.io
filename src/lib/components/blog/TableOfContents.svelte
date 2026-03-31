<script lang="ts">
	import { onMount } from 'svelte';
	import type { Heading } from '$lib/types/content';

	interface Props {
		headings: Heading[];
	}

	let { headings }: Props = $props();
	let activeId = $state('');

	let minLevel = $derived(
		headings.length > 0 ? Math.min(...headings.map((h) => h.level)) : 2
	);

	onMount(() => {
		const headingElements = headings
			.map((h) => document.getElementById(h.slug))
			.filter(Boolean) as HTMLElement[];

		if (headingElements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length > 0) {
					activeId = visible[0].target.id;
				}
			},
			{ rootMargin: '-80px 0px -60% 0px' }
		);

		headingElements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	});
</script>

{#if headings.length > 0}
	<nav aria-label="목차">
		<p
			class="text-xs font-medium uppercase tracking-widest mb-3"
			style:color="var(--color-secondary)"
		>
			On this page
		</p>
		<ul class="space-y-1.5">
			{#each headings as h}
				{@const isActive = h.slug === activeId}
				{@const indent = (h.level - minLevel) * 0.75}
				<li>
					<a
						href="#{h.slug}"
						class="block text-xs leading-snug transition-colors hover:opacity-70"
						style:padding-left="{indent}rem"
						style:color={isActive ? 'var(--color-primary)' : 'var(--color-secondary)'}
						style:font-weight={isActive ? 500 : 400}
					>
						{h.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
