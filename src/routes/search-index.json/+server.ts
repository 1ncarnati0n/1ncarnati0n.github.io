import { json } from '@sveltejs/kit';
import { getSearchDocuments } from '$lib/content/search';

export const prerender = true;

export async function GET() {
	return json(await getSearchDocuments());
}
