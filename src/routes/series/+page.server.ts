import { getAllSeries } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { series: await getAllSeries() };
};
