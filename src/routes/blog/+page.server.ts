import { getAllBlogPosts } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await getAllBlogPosts();

	return {
		posts: posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date.toISOString(),
			readingTime: post.readingTime,
			tags: post.tags,
			category: post.category,
			series: post.series,
			sourcePathParts: post.sourcePathParts,
		})),
	};
};
