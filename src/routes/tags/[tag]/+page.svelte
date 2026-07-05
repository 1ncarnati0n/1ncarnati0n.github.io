<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>#{data.tag} | 1ncarnati0n</title>
	<meta name="description" content={`Posts tagged ${data.tag}.`} />
</svelte:head>

<section class="mx-auto max-w-4xl">
	<h1>#{data.tag}</h1>

	<div class="mt-8 space-y-6">
		{#each data.posts as post (post.slug)}
			<article>
				<a href={resolve('/blog/[slug]', { slug: post.slug })} class="block hover:opacity-70">
					<h2 class="text-lg">{post.title}</h2>
					<p>{post.description}</p>
					<time class="text-xs" datetime={post.date}>
						{new Date(post.date).toLocaleDateString('ko-KR')}
					</time>
				</a>
			</article>
		{/each}
	</div>
</section>
