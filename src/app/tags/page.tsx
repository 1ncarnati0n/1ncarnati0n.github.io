import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import { getPublishedPosts } from "@/lib/content";
import { getAllTags, sortPostsByDate } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Tags",
  description: "전체 태그 목록",
};

export default function TagsPage() {
  const allPosts = getPublishedPosts();
  const tags = getAllTags(allPosts);
  const sections = buildBlogSidebar(sortPostsByDate(allPosts));

  // Count posts per tag
  const tagCounts = new Map<string, number>();
  allPosts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="tags-page">
        <h1 className="page-title">Tags</h1>
        <p className="page-desc">전체 태그 ({tags.length}개)</p>

        <div className="tag-cloud">
          {tags.map((tag) => (
            <a key={tag} href={`/tags/${tag}/`} className="tag-chip">
              #{tag}
              <span className="tag-count">{tagCounts.get(tag)}</span>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .tags-page { max-width: 800px; }
        .page-title { font-size: 2rem; margin-bottom: var(--spacing-xs); }
        .page-desc { color: var(--gray); margin-bottom: var(--spacing-xl); }
        .tag-cloud { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
        .tag-chip {
          display: inline-flex; align-items: center; gap: var(--spacing-xs);
          padding: 6px 14px; border-radius: var(--radius-md);
          background: color-mix(in srgb, var(--gray) 10%, transparent);
          font-family: var(--font-header); font-size: 0.9rem;
          color: var(--text); text-decoration: none;
          transition: background var(--transition);
        }
        .tag-chip:hover {
          background: color-mix(in srgb, var(--tertiary) 25%, transparent);
          opacity: 1;
        }
        .tag-count { font-size: 0.75rem; color: var(--gray); }
      `}</style>
    </DocLayout>
  );
}
