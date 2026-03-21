import { getBlogTree } from '@/lib/content/posts'
import { BlogSideMenu } from '@/components/blog/BlogSideMenu'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = await getBlogTree()

  return (
    <div className="
    grid grid-cols-1 lg:grid-cols-[200px_1fr] 
    xl:grid-cols-[250px_1fr_200px] gap-12"
    >
      {/* 좌측: 트리 사이드메뉴 */}
      <aside className="hidden lg:block">
        <BlogSideMenu tree={tree} />
      </aside>

      {/* 중앙 + 우측: 각 page가 RightPanel로 구성 */}
      {children}
    </div>
  )
}
