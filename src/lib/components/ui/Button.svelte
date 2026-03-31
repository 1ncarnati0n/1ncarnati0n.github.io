<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		external?: boolean;
		onclick?: () => void;
		disabled?: boolean;
		class?: string;
	}

	let {
		children,
		size = 'md',
		href,
		external = false,
		onclick,
		disabled = false,
		class: className = '',
	}: Props = $props();

	let classes = $derived(`btn btn-${size} ${className}`);
</script>

{#if href}
	{#if external}
		<a {href} target="_blank" rel="noopener noreferrer" class={classes}>
			{@render children()}
		</a>
	{:else}
		<a {href} class={classes}>
			{@render children()}
		</a>
	{/if}
{:else}
	<button {onclick} {disabled} class={classes}>
		{@render children()}
	</button>
{/if}
