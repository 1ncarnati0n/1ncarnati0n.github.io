import { error } from '@sveltejs/kit';
import { getWorkSlugs, getWork } from '$lib/content/works';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const work = await getWork(params.slug);
	if (!work) error(404, 'Work not found');

	return { work };
};

export async function entries() {
	const slugs = await getWorkSlugs();
	return slugs.map((slug) => ({ slug }));
}
