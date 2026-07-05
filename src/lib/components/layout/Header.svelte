<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import DarkModeToggle from '$lib/components/ui/DarkModeToggle.svelte';

	const navItems = [
		{ route: '/blog', label: 'Tech Blog' },
		{ route: '/search', label: 'Search' },
		{ route: '/works', label: 'Works' },
		{ route: '/about', label: 'About' },
	] as const;

	function getActiveNavItem(pathname: string) {
		if (pathname === '/') return undefined;
		const segment = pathname.split('/')[1];
		return navItems.find((item) => item.route === `/${segment}`);
	}

	function refreshActiveRoute() {
		if (!activeNavItem) return;
		goto(resolve(activeNavItem.route), { invalidateAll: true });
	}

	let menuOpen = $state(false);
	let pathname = $derived($page.url.pathname);
	let activeNavItem = $derived(getActiveNavItem(pathname));
	let pageTitle = $derived(activeNavItem?.label ?? '');
</script>

<!-- 헤더 바: 항상 최상단 -->
<header class="fixed top-8 w-full z-100 px-9 flex items-center justify-between">
	<!-- 좌: 로고 -->
	<a href={resolve('/')} class="logo" onclick={() => (menuOpen = false)}>
		1ncarnati0n
	</a>

	<!-- 우: Menu / Close 토글 -->
	<button
		onclick={() => (menuOpen = !menuOpen)}
		class="logo"
		aria-expanded={menuOpen}
		aria-controls="site-menu"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
	>
		{menuOpen ? 'Close' : 'Menu'}
	</button>
</header>

<header
	class="fixed top-5 left-0 w-full z-90 px-6 h-16 flex items-center justify-center pointer-events-none"
>
	{#if pageTitle}
		<button
			type="button"
			class="logo pointer-events-auto transition-opacity duration-500 ease-in-out cursor-pointer hover:opacity-60"
			style:opacity={menuOpen ? 0 : 1}
			onclick={refreshActiveRoute}
			aria-label="{pageTitle} 새로 불러오기"
		>
			{pageTitle}
		</button>
	{/if}
</header>

<!-- 풀스크린 오버레이 -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
	onclick={() => (menuOpen = false)}
	class="fixed inset-0 z-40 flex flex-col items-center justify-center
		bg-white/80 dark:bg-neutral-950/80
		transition-[opacity,visibility] duration-500 ease-in-out
		{menuOpen ? 'visible opacity-100 backdrop-blur-md' : 'invisible opacity-0'}"
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<nav
		id="site-menu"
		onclick={(e) => e.stopPropagation()}
		class="mask-linear-to-neutral-50 flex flex-col items-center gap-8"
	>
		{#each navItems as item, i (item.route)}
			<a
				href={resolve(item.route)}
				onclick={() => (menuOpen = false)}
				class="text-2xl font-bold hover:opacity-30 menu-item {menuOpen ? 'menu-item-open' : ''}"
				style:--stagger="{i * 80}ms"
			>
				{item.label}
			</a>
		{/each}
		<div
			class="mt-4 menu-item {menuOpen ? 'menu-item-open' : ''}"
			style:--stagger="{navItems.length * 80}ms"
		>
			<DarkModeToggle />
		</div>
		<div>
			<p class="text-center">
				Architectural Design <br />
				Computational Design <br />
				AI Engineering <br />
				Software Development
			</p>
			<a href="https://github.com/1ncarnati0n" onclick={() => (menuOpen = false)}>
				<p class="text-center">gitHub link</p>
			</a>
		</div>
	</nav>
</div>
