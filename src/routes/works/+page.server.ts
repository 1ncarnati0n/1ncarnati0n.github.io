import { getAllWorks } from '$lib/content/works';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		works: (await getAllWorks()).map((work) => ({
			slug: work.slug,
			title: work.title,
			description: work.description,
			date: work.date.toISOString(),
			status: work.status,
			tools: work.tools,
			category: work.category,
		})),
	};
};
