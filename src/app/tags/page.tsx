import type { Metadata } from "next";
import { getSortedPublishedPosts } from "@/lib/content";
import { countTags, getAllTags } from "@/lib/content-utils";

export const metadata: Metadata = {
  title: "Tags",
  description: "전체 태그 목록",
};

export default function TagsPage() {
  const posts = getSortedPublishedPosts();
  const tagCounts = countTags(posts);
  const tags = getAllTags(posts).sort((a, b) => {
    const countDiff = (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0);
    if (countDiff !== 0) return countDiff;
    return a.localeCompare(b);
  });

  return (
    <div className="tags-page container">
      <header className="tags-hero">
        <h1>Tags</h1>
        <p className="tags-desc">
          글을 주제 단위로 빠르게 탐색할 수 있는 인덱스입니다.
        </p>
        <p className="tags-meta">
          {tags.length} tags &middot; {posts.length} posts
        </p>
      </header>

      <div className="tags-list">
        {tags.map((tag) => (
          <a key={tag} href={`/tags/${encodeURIComponent(tag)}/`} className="tag-item">
            #{tag}
            <span>({tagCounts.get(tag) ?? 0})</span>
          </a>
        ))}
      </div>

      <style>{`
        .tags-page {
          max-width: 720px;
          margin: 0 auto;
          display: grid;
          gap: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }

        .tags-hero {
          display: grid;
          gap: var(--spacing-xs);
        }

        .tags-hero h1 {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          letter-spacing: -0.02em;
        }

        .tags-desc {
          color: color-mix(in srgb, var(--text) 70%, transparent);
        }

        .tags-meta {
          color: var(--gray);
          font-size: 0.84rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
        }

        .tag-item {
          color: var(--text);
          font-family: var(--font-header);
          font-size: 0.88rem;
          text-decoration: none;
          transition: color var(--transition);
        }

        .tag-item:hover {
          color: var(--tertiary);
        }

        .tag-item span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.72rem;
          margin-left: 0.15rem;
        }
      `}</style>
    </div>
  );
}
