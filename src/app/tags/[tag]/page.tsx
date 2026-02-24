import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts } from "@/lib/content";
import { cleanSlug, getAllTags } from "@/lib/content-utils";

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

  return (
    <div className="tag-page container">
      <header className="tag-hero">
        <h1>#{tag}</h1>
        <p className="tag-desc">이 태그로 분류된 글 {taggedPosts.length}개</p>
        <a href="/tags/" className="tag-back-link">
          전체 태그 보기
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

      <style>{`
        .tag-page {
          max-width: 720px;
          margin: 0 auto;
          display: grid;
          gap: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }

        .tag-hero {
          display: grid;
          gap: var(--spacing-xs);
        }

        .tag-hero h1 {
          color: var(--text-heading);
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          letter-spacing: -0.02em;
        }

        .tag-desc {
          color: color-mix(in srgb, var(--text) 70%, transparent);
        }

        .tag-back-link {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.82rem;
          width: fit-content;
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }

        .tag-back-link:hover {
          color: var(--text-heading);
        }

        .post-list {
          display: grid;
          gap: 0;
        }
      `}</style>
    </div>
  );
}
