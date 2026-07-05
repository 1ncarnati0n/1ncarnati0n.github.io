import { error } from '@sveltejs/kit';
import { getAllTags, getPostsByTag } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const prerender = 'auto';

export const load: PageServerLoad = async ({ params }) => {
	const posts = await getPostsByTag(params.tag);
	if (posts.length === 0) error(404, 'Tag not found');

	return {
		tag: params.tag,
		posts: posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date.toISOString(),
			tags: post.tags,
		})),
	};
};

export async function entries() {
	return (await getAllTags()).map((tag) => ({ tag: tag.name }));
}
