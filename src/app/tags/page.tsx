import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import { getSortedPublishedPosts } from "@/lib/content";
import { countTags, getAllTags } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Tags",
  description: "전체 태그 목록",
};

export default function TagsPage() {
  const posts = getSortedPublishedPosts();
  const sections = buildBlogSidebar(posts);
  const tagCounts = countTags(posts);
  const tags = getAllTags(posts).sort((a, b) => {
    const countDiff = (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0);
    if (countDiff !== 0) return countDiff;
    return a.localeCompare(b);
  });

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="tags-page">
        <header className="tags-hero">
          <p className="tags-kicker">Tag Index</p>
          <h1>Tags</h1>
          <p className="tags-desc">
            글을 주제 단위로 빠르게 탐색할 수 있는 인덱스입니다.
            가장 많이 다룬 태그가 상단에 먼저 배치됩니다.
          </p>

          <div className="tags-meta">
            <div>
              <span>Tags</span>
              <strong>{tags.length}</strong>
            </div>
            <div>
              <span>Posts</span>
              <strong>{posts.length}</strong>
            </div>
          </div>
        </header>

        <div className="tags-grid">
          {tags.map((tag) => (
            <a key={tag} href={`/tags/${encodeURIComponent(tag)}/`} className="tag-card">
              <div className="tag-card-top">
                <span className="tag-name">#{tag}</span>
                <em>{tagCounts.get(tag) ?? 0}</em>
              </div>
              <p>{`"${tag}" 관련 글 보기`}</p>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .tags-page {
          max-width: 940px;
          display: grid;
          gap: var(--spacing-md);
        }

        .tags-hero {
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          background: color-mix(in srgb, var(--surface) 96%, transparent);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          padding: clamp(1rem, 2.4vw, 1.8rem);
          display: grid;
          gap: var(--spacing-sm);
        }

        .tags-kicker {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .tags-hero h1 {
          font-size: clamp(1.6rem, 3vw, 2.45rem);
          letter-spacing: -0.02em;
        }

        .tags-desc {
          color: color-mix(in srgb, var(--text) 82%, transparent);
          max-width: 62ch;
        }

        .tags-meta {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .tags-meta div {
          min-width: 104px;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.45rem 0.56rem;
          display: grid;
          gap: 0.08rem;
        }

        .tags-meta span {
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tags-meta strong {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .tags-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing-sm);
        }

        .tag-card {
          display: grid;
          gap: 0.45rem;
          border: 1px solid color-mix(in srgb, var(--line) 90%, transparent);
          border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--surface-raised) 95%, transparent);
          padding: 0.8rem 0.9rem;
          color: var(--text);
          text-decoration: none;
          transition: transform 0.17s ease, border-color var(--transition), box-shadow var(--transition);
        }

        .tag-card:hover {
          color: var(--text);
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--accent) 42%, transparent);
          box-shadow: var(--shadow-sm);
        }

        .tag-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-xs);
        }

        .tag-name {
          color: var(--text-heading);
          font-family: var(--font-header);
          font-size: 0.92rem;
          letter-spacing: -0.01em;
        }

        .tag-card-top em {
          font-style: normal;
          color: var(--gray);
          font-family: var(--font-code);
          font-size: 0.67rem;
          border: 1px solid color-mix(in srgb, var(--line) 88%, transparent);
          border-radius: 999px;
          padding: 0.14rem 0.42rem;
          background: color-mix(in srgb, var(--surface) 92%, transparent);
        }

        .tag-card p {
          color: color-mix(in srgb, var(--text) 74%, transparent);
          font-size: 0.8rem;
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .tags-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .tags-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DocLayout>
  );
}
