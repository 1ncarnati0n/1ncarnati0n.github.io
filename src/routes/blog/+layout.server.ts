import { getBlogTree } from '$lib/content/posts';
import { getBlogGraphData } from '$lib/content/graph';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const [tree, graphData] = await Promise.all([getBlogTree(), getBlogGraphData()]);

	return { tree, graphData };
};
