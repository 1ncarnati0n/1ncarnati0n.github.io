import { getAllBlogPosts, getAllSeries, getAllTags } from '$lib/content/posts';
import { getAllWorks } from '$lib/content/works';
import { absoluteUrl, xmlEscape } from '$lib/content/site';

export const prerender = true;

function urlEntry(pathname: string, lastmod?: Date | string) {
	return [
		'<url>',
		`<loc>${xmlEscape(absoluteUrl(pathname))}</loc>`,
		lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
		'</url>',
	].join('');
}

export async function GET() {
	const [posts, tags, series, works] = await Promise.all([
		getAllBlogPosts(),
		getAllTags(),
		getAllSeries(),
		getAllWorks(),
	]);
	const urls = [
		urlEntry('/'),
		urlEntry('/blog/'),
		urlEntry('/tags/'),
		urlEntry('/series/'),
		urlEntry('/search/'),
		urlEntry('/works/'),
		urlEntry('/about/'),
		...posts.map((post) => urlEntry(`/blog/${post.slug}/`, post.updated ?? post.date)),
		...tags.map((tag) => urlEntry(`/tags/${encodeURIComponent(tag.name)}/`)),
		...series.map((item) => urlEntry(`/series/${encodeURIComponent(item.name)}/`)),
		...works.map((work) => urlEntry(`/works/${work.slug}/`, work.date)),
	].join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8',
			},
		},
	);
}
