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
          <h1>{displayTitle}</h1>

          <p className="post-meta-line">
            {post.data.date && (
              <time dateTime={post.data.date.toISOString()}>
                {formatDate(post.data.date)}
              </time>
            )}
            <span>&middot;</span>
            <span>{readTime}</span>
            <span>&middot;</span>
            <span>{category}</span>
          </p>

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
          display: grid;
          gap: var(--spacing-sm);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--line);
        }

        .post-header h1 {
          font-size: clamp(1.55rem, 3.1vw, 2.2rem);
          line-height: 1.24;
          letter-spacing: -0.02em;
        }

        .post-meta-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          color: var(--gray);
          font-size: 0.84rem;
        }

        .post-meta-line time {
          color: var(--text);
        }

        .post-meta-line span {
          text-transform: capitalize;
        }

        .post-content-wrap {
          padding-top: var(--spacing-sm);
        }
      `}</style>
    </DocLayout>
  );
}
