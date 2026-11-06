<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/components/layout/Header.svelte';
	import '../app.css';

	// 블로그는 Quartz 그리드가 자체 여백을 가진다
	let isBlog = $derived($page.url.pathname.startsWith('/blog') && !$page.error);

	let { children } = $props();
</script>

<svelte:head>
	<title>1ncarnati0n</title>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
>
	본문으로 건너뛰기
</a>

<Header />

<main id="main-content" class="min-h-screen {isBlog ? '' : 'px-10 py-18'}">
	{@render children()}
</main>
