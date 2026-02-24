import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts } from "@/lib/content";
import { cleanSlug, getAllTags } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export function generateStaticParams() {
  const posts = getSortedPublishedPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag}`,
    description: `태그: ${tag}`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const allPosts = getSortedPublishedPosts();
  const taggedPosts = allPosts.filter((post) => post.data.tags?.includes(tag));
  if (taggedPosts.length === 0) notFound();

  const sections = buildBlogSidebar(allPosts);

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="tag-page">
        <header className="tag-hero">
          <p className="tag-kicker">Tag Archive</p>
          <h1>#{tag}</h1>
          <p className="tag-desc">이 태그로 분류된 글 {taggedPosts.length}개를 정리했습니다.</p>
          <a href="/tags/" className="tag-back-link">
            전체 태그 보기 &rarr;
          </a>
        </header>

        <div className="post-list">
          {taggedPosts.map((post) => (
            <PostItem
              key={post.id}
              title={post.data.title}
              slug={cleanSlug(post.id)}
              date={post.data.date}
              description={post.data.description}
              tags={post.data.tags}
            />
          ))}
        </div>
      </div>

      <style>{`
        .tag-page {
          max-width: 900px;
          display: grid;
          gap: var(--spacing-md);
        }

        .tag-hero {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          gap: var(--spacing-sm);
        }

        .tag-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .tag-hero h1 {
          color: var(--text-heading);
          font-size: clamp(1.6rem, 3vw, 2.45rem);
          letter-spacing: -0.02em;
        }

        .tag-desc {
          color: color-mix(in srgb, var(--text) 82%, transparent);
        }

        .tag-back-link {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.82rem;
          width: fit-content;
        }

        .tag-back-link:hover {
          color: var(--text-heading);
        }

        .post-list {
          display: grid;
          gap: var(--spacing-sm);
        }
      `}</style>
    </DocLayout>
  );
}
