import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { listEditableWorks } from '$lib/server/works-editor';
import type { PageServerLoad } from './$types';

// 로컬 전용 편집기: 정적 빌드(out/)에 포함하지 않는다
export const prerender = false;

export const load: PageServerLoad = async () => {
	if (!dev) error(404, 'Not found');
	return { works: await listEditableWorks() };
};
