<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<button
	onclick={theme.toggle}
	class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
	aria-label={$theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
>
	{#if $theme === 'light'}
		<Moon size={20} strokeWidth={1.5} />
	{:else}
		<Sun size={20} strokeWidth={1.5} />
	{/if}
</button>
