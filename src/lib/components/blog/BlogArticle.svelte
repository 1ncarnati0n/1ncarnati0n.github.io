<script lang="ts">
	interface Props {
		title: string;
		date: Date;
		readingTime: number;
		tags: string[];
		cssClasses: string[];
		html: string;
	}

	let { title, date, readingTime, tags, cssClasses, html }: Props = $props();

	let articleClassName = $derived(['prose-custom', ...cssClasses].join(' ').trim());
</script>

<article class="flex-wrap flex-col items-center max-w-3xl">
	<header class="mb-10">
		<h1 class="font-header mb-3 text-2xl md:text-3xl font-medium">
			{title}
		</h1>

		<div class="gap-3 text-sm">
			<time datetime={date.toISOString()}>
				{date.toLocaleDateString('ko-KR')}
			</time>
			<span>·</span>
			<span>{readingTime}분 읽기</span>
		</div>

		{#if tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each tags as tag}
					<span
						class="rounded-full px-2 py-0.5 text-xs"
						style:background-color="var(--color-surface)"
						style:color="var(--color-secondary)"
					>
						{tag}
					</span>
				{/each}
			</div>
		{/if}
	</header>

	<hr class="mb-10" />

	<div class={articleClassName}>
		{@html html}
	</div>
</article>
