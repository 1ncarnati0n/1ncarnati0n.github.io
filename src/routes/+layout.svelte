<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>1ncarnati0n</title>
	<meta name="description" content="AI & Software Engineering, Computational Design" />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded"
>
	본문으로 건너뛰기
</a>

<Header />

<main id="main-content" class="min-h-screen px-10 py-18">
	{@render children()}
</main>
