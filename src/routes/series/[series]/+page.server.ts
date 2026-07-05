import { error } from '@sveltejs/kit';
import { getAllSeries, getPostsBySeries } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const prerender = 'auto';

export const load: PageServerLoad = async ({ params }) => {
	const posts = await getPostsBySeries(params.series);
	if (posts.length === 0) error(404, 'Series not found');

	return {
		series: params.series,
		posts: posts.map((post) => ({
			slug: post.slug,
			title: post.title,
			description: post.description,
			date: post.date.toISOString(),
		})),
	};
};

export async function entries() {
	return (await getAllSeries()).map((series) => ({ series: series.name }));
}
