<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import FlexSearch from 'flexsearch';
	import type { SearchDocument } from '$lib/types/content';

	type SearchIndex = {
		add(id: number, content: string): void;
		search(query: string, limit?: number): Array<number | string>;
	};

	let query = $state('');
	let documents = $state<SearchDocument[]>([]);
	let results = $state<SearchDocument[]>([]);
	let index = $state<SearchIndex | null>(null);

	function searchText(document: SearchDocument) {
		return [
			document.title,
			document.title,
			document.tags.join(' '),
			document.tags.join(' '),
			document.description,
			document.headings.join(' '),
			document.body,
		].join(' ');
	}

	function updateResults(nextQuery = query, nextIndex = index, nextDocuments = documents) {
		const normalized = nextQuery.trim();

		if (!normalized || !nextIndex) {
			results = nextDocuments.slice(0, 12);
			return;
		}

		results = nextIndex
			.search(normalized, 24)
			.map((id) => nextDocuments[Number(id)])
			.filter((document): document is SearchDocument => Boolean(document));
	}

	onMount(async () => {
		const response = await fetch(resolve('/search-index.json'));
		documents = await response.json();
		const nextIndex = new FlexSearch.Index({ tokenize: 'forward' }) as SearchIndex;

		documents.forEach((document, id) => nextIndex.add(id, searchText(document)));
		index = nextIndex;
		updateResults();
	});

	$effect(() => {
		updateResults(query, index, documents);
	});
</script>

<svelte:head>
	<title>Search | 1ncarnati0n</title>
	<meta name="description" content="Search blog posts." />
</svelte:head>

<section class="mx-auto max-w-4xl">
	<h1>Search</h1>

	<label class="mt-8 block">
		<span class="sr-only">Search posts</span>
		<input
			bind:value={query}
			type="search"
			placeholder="Search posts"
			class="w-full rounded border bg-transparent px-4 py-3"
			style:border-color="var(--color-border)"
		/>
	</label>

	<div class="mt-8 space-y-6">
		{#each results as result (result.slug)}
			<article>
				<a href={resolve('/blog/[slug]', { slug: result.slug })} class="block hover:opacity-70">
					<h2 class="text-lg">{result.title}</h2>
					<p>{result.description}</p>
					<div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
						<time datetime={result.date}>
							{new Date(result.date).toLocaleDateString('ko-KR')}
						</time>
						{#each result.tags as tag (tag)}
							<span
								class="rounded-full px-2 py-0.5"
								style:background-color="var(--color-surface)"
								style:color="var(--color-secondary)"
							>
								#{tag}
							</span>
						{/each}
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>
