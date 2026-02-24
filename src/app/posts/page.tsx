import type { Metadata } from "next";
import PostItem from "@/components/PostItem";
import { getSortedPublishedPosts } from "@/lib/content";
import { cleanSlug, groupPostsByCategory } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "블로그 글 목록",
};

export default function PostsPage() {
  const posts = getSortedPublishedPosts();
  const grouped = groupPostsByCategory(posts);
  const categories = [...grouped.keys()].sort();

  return (
    <div className="posts-page container">
      <header className="posts-hero">
        <h1>Posts</h1>
        <p className="posts-desc">
          구현 과정, 학습 노트, 운영 경험을 카테고리별로 정리한 기록입니다.
        </p>
        <p className="posts-meta">
          {posts.length} posts across {categories.length} categories
        </p>
      </header>

      {categories.map((category) => (
        <section key={category} className="category-section" id={category}>
          <h2 className="category-heading">
            {category}
            <span>{grouped.get(category)!.length}</span>
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

      <style>{`
        .posts-page {
          max-width: 720px;
          margin: 0 auto;
          display: grid;
          gap: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }

        .posts-hero {
          display: grid;
          gap: var(--spacing-xs);
        }

        .posts-hero h1 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          letter-spacing: -0.02em;
        }

        .posts-desc {
          color: color-mix(in srgb, var(--text) 70%, transparent);
          max-width: 52ch;
        }

        .posts-meta {
          color: var(--gray);
          font-size: 0.84rem;
        }

        .category-section {
          display: grid;
          gap: var(--spacing-sm);
        }

        .category-heading {
          display: flex;
          align-items: baseline;
          gap: var(--spacing-sm);
          border-bottom: 1px solid var(--line);
          padding-bottom: 0.45rem;
          text-transform: capitalize;
          font-size: 1.05rem;
        }

        .category-heading span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.72rem;
          font-weight: 400;
        }

        .post-list {
          display: grid;
          gap: 0;
        }
      `}</style>
    </div>
  );
}
