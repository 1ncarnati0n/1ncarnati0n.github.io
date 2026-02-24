import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts } from "@/lib/content";
import { cleanSlug, groupPostsByCategory } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Blog",
  description: "블로그 글 목록",
};

export default function PostsPage() {
  const posts = getSortedPublishedPosts();
  const sections = buildBlogSidebar(posts);
  const grouped = groupPostsByCategory(posts);
  const categories = [...grouped.keys()].sort();

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="posts-page">
        <header className="posts-hero">
          <p className="posts-kicker">Technical Archive</p>
          <h1>Posts</h1>
          <p className="posts-desc">
            구현 과정, 학습 노트, 운영 경험을 카테고리별로 정리한 기록입니다.
            빠르게 훑을 수 있도록 구조화된 카드 리스트로 구성했습니다.
          </p>

          <div className="posts-meta">
            <div>
              <span>Total</span>
              <strong>{posts.length}</strong>
            </div>
            <div>
              <span>Categories</span>
              <strong>{categories.length}</strong>
            </div>
          </div>
        </header>

        {categories.map((category) => (
          <section key={category} className="category-section" id={category}>
            <h2 className="category-heading">
              <span>{category}</span>
              <em>{grouped.get(category)!.length}</em>
            </h2>
            <div className="post-list">
              {grouped.get(category)!.map((post) => (
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
          </section>
        ))}
      </div>

      <style>{`
        .posts-page {
          max-width: 900px;
          display: grid;
          gap: var(--spacing-md);
        }

        .posts-hero {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          gap: var(--spacing-sm);
        }

        .posts-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .posts-hero h1 {
          font-size: clamp(1.6rem, 3vw, 2.45rem);
          letter-spacing: -0.02em;
        }

        .posts-desc {
          color: color-mix(in srgb, var(--text) 82%, transparent);
          max-width: 64ch;
        }

        .posts-meta {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .posts-meta div {
          min-width: 108px;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.44rem 0.56rem;
          display: grid;
          gap: 0.08rem;
        }

        .posts-meta span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .posts-meta strong {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .category-section {
          display: grid;
          gap: var(--spacing-sm);
        }

        .category-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
          border-bottom: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          padding-bottom: 0.45rem;
          text-transform: capitalize;
          font-size: 1.05rem;
        }

        .category-heading em {
          font-style: normal;
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.72rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          padding: 0.16rem 0.42rem;
          background: color-mix(in srgb, var(--surface-raised) 90%, transparent);
        }

        .post-list {
          display: grid;
          gap: var(--spacing-sm);
        }
      `}</style>
    </DocLayout>
  );
}
