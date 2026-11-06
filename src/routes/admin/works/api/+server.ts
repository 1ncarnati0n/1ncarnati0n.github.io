import { dev } from '$app/environment';
import { error, json } from '@sveltejs/kit';
import { resetWorksCache } from '$lib/content/works';
import { saveImage, saveWork, type WorkInput } from '$lib/server/works-editor';
import type { RequestHandler } from './$types';

export const prerender = false;

function guard() {
	if (!dev) error(404, 'Not found');
}

function fail(e: unknown) {
	return json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
}

/** 작업(글 + frontmatter) 저장 */
export const PUT: RequestHandler = async ({ request }) => {
	guard();
	try {
		const file = await saveWork((await request.json()) as WorkInput);
		resetWorksCache();
		return json({ file });
	} catch (e) {
		return fail(e);
	}
};

/** 이미지 업로드: multipart (slug, file) → { url } */
export const POST: RequestHandler = async ({ request }) => {
	guard();
	try {
		const form = await request.formData();
		const slug = String(form.get('slug') ?? '');
		const file = form.get('file');
		if (!(file instanceof File)) throw new Error('파일이 없습니다');
		return json({ url: await saveImage(slug, file) });
	} catch (e) {
		return fail(e);
	}
};
