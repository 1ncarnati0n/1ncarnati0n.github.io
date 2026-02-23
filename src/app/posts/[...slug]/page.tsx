import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagList from "@/components/TagList";
import TableOfContents from "@/components/TableOfContents";
import { getAllPosts, getPublishedPosts } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import {
  cleanSlug,
  deriveTitle,
  formatDate,
  getReadingTime,
  getPostCategory,
  sortPostsByDate,
} from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: cleanSlug(post.id).split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const post = getAllPosts().find((p) => cleanSlug(p.id) === slugStr);
  if (!post) return {};

  const title = deriveTitle(post.id, post.data.title);
  return {
    title,
    description: post.data.description || undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugStr = slug.join("/");
  const post = getAllPosts().find((p) => cleanSlug(p.id) === slugStr);
  if (!post) notFound();

  const { html, headings } = await renderMarkdown(post.body);
  const displayTitle = deriveTitle(post.id, post.data.title);
  const category = getPostCategory(post.id);
  const readTime = getReadingTime(post.body);

  // Build sidebar
  const allPosts = getPublishedPosts();
  const sortedPosts = sortPostsByDate(allPosts);
  const sections = buildBlogSidebar(sortedPosts);

  return (
    <DocLayout
      sections={sections}
      sidebarContext="blog"
      showRightSidebar={true}
      toc={<TableOfContents headings={headings} />}
    >
      <article className="post-page">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/posts/" },
            { label: category, href: `/posts/#${category}` },
            { label: displayTitle },
          ]}
        />

        <header className="post-header">
          <h1>{displayTitle}</h1>
          <div className="post-meta">
            {post.data.date && (
              <time dateTime={post.data.date.toISOString()}>
                {formatDate(post.data.date)}
              </time>
            )}
            <span className="meta-sep">&middot;</span>
            <span>{readTime} 읽기</span>
            <span className="meta-sep">&middot;</span>
            <span className="meta-category">{category}</span>
          </div>
          <TagList tags={post.data.tags ?? []} />
        </header>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      <style>{`
        .post-page { max-width: var(--content-width); }
        .post-header { margin-bottom: var(--spacing-xl); }
        .post-header h1 { font-size: 2rem; margin-bottom: var(--spacing-sm); line-height: 1.3; }
        .post-meta {
          display: flex; align-items: center; gap: var(--spacing-sm);
          font-size: 0.85rem; color: var(--gray);
          font-family: var(--font-header); margin-bottom: var(--spacing-md);
        }
        .meta-sep { opacity: 0.3; }
        .meta-category { text-transform: capitalize; }
      `}</style>
    </DocLayout>
  );
}
