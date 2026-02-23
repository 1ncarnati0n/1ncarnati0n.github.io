import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import PostItem from "@/components/PostItem";
import { getPublishedPosts } from "@/lib/content";
import { sortPostsByDate, cleanSlug, groupPostsByCategory } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export const metadata: Metadata = {
  title: "Blog",
  description: "블로그 글 목록",
};

export default function PostsPage() {
  const allPosts = getPublishedPosts();
  const posts = sortPostsByDate(allPosts);
  const sections = buildBlogSidebar(posts);

  const grouped = groupPostsByCategory(posts);
  const categories = [...grouped.keys()].sort();

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="posts-page">
        <h1 className="page-title">Blog</h1>
        <p className="page-desc">기술 노트와 블로그 글 모음 &middot; {posts.length}개의 글</p>

        {categories.map((cat) => (
          <section key={cat} className="category-section" id={cat}>
            <h2 className="category-heading">
              {cat}
              <span className="category-count">{grouped.get(cat)!.length}</span>
            </h2>
            <div className="post-list">
              {grouped.get(cat)!.map((post) => (
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
        .posts-page { max-width: 800px; }
        .page-title { font-size: 2rem; margin-bottom: var(--spacing-xs); }
        .page-desc { color: var(--gray); margin-bottom: var(--spacing-xl); }
        .category-section { margin-bottom: var(--spacing-xl); }
        .category-heading {
          font-size: 1.2rem; text-transform: capitalize;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid color-mix(in srgb, var(--gray) 15%, transparent);
          margin-bottom: var(--spacing-md);
          display: flex; align-items: center; gap: var(--spacing-sm);
        }
        .category-count {
          font-size: 0.75rem; font-weight: 500; color: var(--gray);
          background: color-mix(in srgb, var(--gray) 12%, transparent);
          padding: 1px 8px; border-radius: 10px;
        }
      `}</style>
    </DocLayout>
  );
}
