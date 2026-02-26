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
        <p className="posts-meta">
          {posts.length} posts &middot; {categories.length} categories
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
          gap: var(--space-6);
          padding-top: var(--space-7);
          padding-bottom: var(--space-8);
        }

        .posts-hero {
          display: grid;
          gap: var(--spacing-xs);
        }

        .posts-hero h1 {
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .posts-meta {
          color: var(--gray);
          font-family: var(--font-header);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
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
          padding-bottom: 0.4rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.08em;
        }

        .category-heading span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
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
