import { error } from '@sveltejs/kit';
import { getWorkSlugs, getWork } from '$lib/content/works';
import { renderMarkdown } from '$lib/content/mdx';
import type { PageServerLoad } from './$types';

export const prerender = 'auto';

export const load: PageServerLoad = async ({ params }) => {
	const work = await getWork(params.slug);
	if (!work) error(404, 'Work not found');

	return {
		work: {
			title: work.title,
			description: work.description,
			date: work.date.toISOString(),
			status: work.status,
			tools: work.tools,
			category: work.category,
		},
		html: await renderMarkdown(work.content),
	};
};

export async function entries() {
	const slugs = await getWorkSlugs();
	return slugs.map((slug) => ({ slug }));
}
