<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatQuartzDate } from '$lib/content/site';

	interface Props {
		title: string;
		date?: Date;
		readingTime: number;
		tags: string[];
		pathParts: string[];
		cssClasses: string[];
		html: string;
	}

	let { title, date, readingTime, tags, pathParts, cssClasses, html }: Props = $props();

	let articleClassName = $derived(['qz-article', ...cssClasses].join(' ').trim());
</script>

<div class="qz-center">
	<nav class="qz-breadcrumbs" aria-label="breadcrumbs">
		<div><a href={resolve('/blog')}>Home</a><span class="qz-sep">❯</span></div>
		{#each pathParts as part, i (i)}
			<div><span>{part}</span><span class="qz-sep">❯</span></div>
		{/each}
		<div><span>{title}</span></div>
	</nav>

	<h1 class="qz-title">{title}</h1>

	<p class="qz-meta">
		{#if date}
			<time datetime={date.toISOString()}>{formatQuartzDate(date)}</time>
		{/if}
		<span>{readingTime} min read</span>
	</p>

	{#if tags.length > 0}
		<ul class="qz-tags">
			{#each tags as tag (tag)}
				<li><a href={resolve('/tags/[tag]', { tag })}>{tag}</a></li>
			{/each}
		</ul>
	{/if}

	<article class={articleClassName}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html html}
	</article>
</div>
