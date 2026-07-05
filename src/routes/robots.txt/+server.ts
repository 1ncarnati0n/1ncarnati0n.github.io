import { SITE_URL } from '$lib/content/site';

export const prerender = true;

export async function GET() {
	return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
		},
	});
}
