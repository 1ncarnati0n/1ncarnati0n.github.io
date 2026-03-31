import { error } from '@sveltejs/kit';
import { normalizeBlogReference } from '$lib/content/blog-slug';
import { renderMarkdown } from '$lib/content/mdx';
import { getAllBlogPosts, getBlogPostBySlug, getBlogReferenceLookup } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [post, references] = await Promise.all([
		getBlogPostBySlug(params.slug),
		getBlogReferenceLookup(),
	]);

	if (!post) error(404, 'Post not found');

	const html = await renderMarkdown(post.content, {
		resolveWikiLink: (reference) => {
			const resolved = references.get(normalizeBlogReference(reference));
			if (!resolved) return null;
			return {
				href: `/blog/${resolved.slug}`,
				title: resolved.title,
				description: resolved.description,
			};
		},
		resolveEmbed: (reference) => {
			const resolved = references.get(normalizeBlogReference(reference));
			if (!resolved) return null;
			return {
				type: 'note',
				href: `/blog/${resolved.slug}`,
				title: resolved.title,
				description: resolved.description,
			};
		},
	});

	return {
		post: {
			title: post.title,
			date: post.date.toISOString(),
			readingTime: post.readingTime,
			tags: post.tags,
			cssClasses: post.cssClasses,
			description: post.description,
			headings: post.headings,
		},
		html,
	};
};

export async function entries() {
	const posts = await getAllBlogPosts();
	return posts.map((post) => ({ slug: post.slug }));
}
