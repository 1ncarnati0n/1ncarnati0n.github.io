import { getAllTags } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { tags: await getAllTags() };
};
