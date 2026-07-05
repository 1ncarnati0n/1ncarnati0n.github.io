import { error } from '@sveltejs/kit';
import { normalizeBlogReference } from '$lib/content/blog-slug';
import { applyRenderedHeadingIds } from '$lib/content/frontmatter';
import { getBacklinks, getLocalBlogGraphData } from '$lib/content/graph';
import { renderMarkdown } from '$lib/content/mdx';
import { getAllBlogPosts, getBlogPostBySlug, getBlogReferenceLookup } from '$lib/content/posts';
import { absoluteUrl, SITE_TITLE } from '$lib/content/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [post, references, graphData, backlinks] = await Promise.all([
		getBlogPostBySlug(params.slug),
		getBlogReferenceLookup(),
		getLocalBlogGraphData(params.slug),
		getBacklinks(params.slug),
	]);

	if (!post) error(404, 'Post not found');

	const html = await renderMarkdown(post.content, {
		resolveWikiLink: (reference) => {
			const resolved = references.get(normalizeBlogReference(reference));
			if (!resolved) return null;
			return {
				href: `/blog/${resolved.slug}/`,
				title: resolved.title,
				description: resolved.description,
			};
		},
		resolveEmbed: (reference) => {
			const resolved = references.get(normalizeBlogReference(reference));
			if (!resolved) return null;
			return {
				type: 'note',
				href: `/blog/${resolved.slug}/`,
				title: resolved.title,
				description: resolved.description,
			};
		},
	});
	const url = absoluteUrl(`/blog/${post.slug}/`);

	return {
		post: {
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date.toISOString(),
			updated: post.updated?.toISOString(),
			readingTime: post.readingTime,
			tags: post.tags,
			category: post.category,
			series: post.series,
			cover: post.cover,
			cssClasses: post.cssClasses,
			headings: applyRenderedHeadingIds(post.headings, html),
		},
		meta: {
			title: `${post.title} | ${SITE_TITLE}`,
			description: post.description,
			url,
			image: post.cover ? absoluteUrl(post.cover) : undefined,
		},
		graphData,
		backlinks,
		html,
	};
};

export async function entries() {
	const posts = await getAllBlogPosts();
	return posts.map((post) => ({ slug: post.slug }));
}
