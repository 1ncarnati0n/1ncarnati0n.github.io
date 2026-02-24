import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import TagList from "@/components/TagList";
import TableOfContents from "@/components/TableOfContents";
import { getAllPosts, getPostBySlug, getSortedPublishedPosts } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import {
  cleanSlug,
  deriveTitle,
  formatDate,
  getReadingTime,
  getPostCategory,
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
  const post = getPostBySlug(slugStr);
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
  const post = getPostBySlug(slugStr);
  if (!post) notFound();

  const { html, headings } = await renderMarkdown(post.body);
  const displayTitle = deriveTitle(post.id, post.data.title);
  const category = getPostCategory(post.id);
  const readTime = getReadingTime(post.body);
  const sections = buildBlogSidebar(getSortedPublishedPosts());

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
          <p className="post-kicker">{category}</p>
          <h1>{displayTitle}</h1>

          <div className="post-meta">
            {post.data.date && (
              <div>
                <span>Date</span>
                <time dateTime={post.data.date.toISOString()}>
                  {formatDate(post.data.date)}
                </time>
              </div>
            )}
            <div>
              <span>Reading</span>
              <strong>{readTime}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{category}</strong>
            </div>
          </div>

          <TagList tags={post.data.tags ?? []} />
        </header>

        <div className="post-content-wrap">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>

      <style>{`
        .post-page {
          max-width: 860px;
          display: grid;
          gap: var(--spacing-md);
        }

        .post-header {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          gap: var(--spacing-sm);
        }

        .post-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .post-header h1 {
          font-size: clamp(1.55rem, 3.1vw, 2.4rem);
          line-height: 1.24;
          letter-spacing: -0.02em;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .post-meta div {
          min-width: 112px;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.45rem 0.56rem;
          display: grid;
          gap: 0.06rem;
        }

        .post-meta span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .post-meta time,
        .post-meta strong {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.82rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .post-content-wrap {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: clamp(1rem, 2.6vw, 1.95rem);
        }
      `}</style>
    </DocLayout>
  );
}
