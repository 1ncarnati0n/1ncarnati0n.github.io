import { BlogSidebar } from '@/components/blog/BlogSidebar'
import { getBlogTree } from '@/lib/content/posts'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = await getBlogTree()

  return (
    <div>
      <BlogSidebar tree={tree} title="contents" />
      {children}
    </div>
  )
}
