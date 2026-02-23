import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DocLayout from "@/components/DocLayout";
import PostItem from "@/components/PostItem";
import { getPublishedPosts } from "@/lib/content";
import { sortPostsByDate, cleanSlug, getAllTags } from "@/lib/content-utils";
import { buildBlogSidebar } from "@/lib/sidebar-config";

export function generateStaticParams() {
  const posts = getPublishedPosts();
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
  const allPosts = getPublishedPosts();
  const taggedPosts = sortPostsByDate(
    allPosts.filter((p) => p.data.tags?.includes(tag))
  );

  if (taggedPosts.length === 0) notFound();

  const sections = buildBlogSidebar(sortPostsByDate(allPosts));

  return (
    <DocLayout sections={sections} sidebarContext="blog">
      <div className="tag-page">
        <h1 className="page-title">#{tag}</h1>
        <p className="page-desc">{taggedPosts.length}개의 글</p>

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
        .tag-page { max-width: 800px; }
        .page-title { font-size: 2rem; margin-bottom: var(--spacing-xs); color: var(--tertiary); }
        .page-desc { color: var(--gray); margin-bottom: var(--spacing-xl); }
      `}</style>
    </DocLayout>
  );
}
