import { getBlogGraphData } from '@/lib/content/graph'
import { RelationGraph } from './RelationGraph'

export async function RightPanel({ children }: { children?: React.ReactNode }) {
  const graphData = await getBlogGraphData()

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        <RelationGraph data={graphData} />
        {children}
      </div>
    </aside>
  )
}
