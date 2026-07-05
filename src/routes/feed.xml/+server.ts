import { getAllBlogPosts } from '$lib/content/posts';
import { absoluteUrl, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, xmlEscape } from '$lib/content/site';

export const prerender = true;

export async function GET() {
	const posts = await getAllBlogPosts();
	const items = posts
		.map((post) => {
			const url = absoluteUrl(`/blog/${post.slug}/`);
			return [
				'<item>',
				`<title>${xmlEscape(post.title)}</title>`,
				`<link>${xmlEscape(url)}</link>`,
				`<guid>${xmlEscape(url)}</guid>`,
				`<description>${xmlEscape(post.description)}</description>`,
				`<pubDate>${post.date.toUTCString()}</pubDate>`,
				'</item>',
			].join('');
		})
		.join('');

	return new Response(
		[
			'<?xml version="1.0" encoding="UTF-8"?>',
			'<rss version="2.0"><channel>',
			`<title>${xmlEscape(SITE_TITLE)}</title>`,
			`<link>${xmlEscape(SITE_URL)}</link>`,
			`<description>${xmlEscape(SITE_DESCRIPTION)}</description>`,
			items,
			'</channel></rss>',
		].join(''),
		{
			headers: {
				'content-type': 'application/rss+xml; charset=utf-8',
			},
		},
	);
}
