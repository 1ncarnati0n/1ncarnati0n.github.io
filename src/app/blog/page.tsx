import Link from 'next/link'
import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { getAllBlogPosts, getBlogTree } from '@/lib/content/posts'

export default async function BlogPage() {
  const [tree, posts] = await Promise.all([
    getBlogTree(),
    getAllBlogPosts(),
  ])

  return (
    <div className="flex w-full gap-12 px-7 py-16">
      <BlogSidebar tree={tree} title="Blog" />

      <section className="min-w-0 flex-1">
        <div className="mb-10">
          <h2 className="text-xl font-medium">Recent Posts</h2>
          <p className="mt-2">
            왼쪽 메뉴에서 주제별로 탐색하거나 최근 글부터 읽어보세요.
          </p>
        </div>

        <div className="space-y-8">
          {posts.slice(0, 12).map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="block group no-underline">
                <h3 className="text-md font-medium group-hover:opacity-70 transition-opacity">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm">
                  {post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
