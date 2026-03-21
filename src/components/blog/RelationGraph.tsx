'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { GraphData } from '@/lib/content/graph'

type SimNode = GraphData['nodes'][number] & {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type SimLink = {
  source: SimNode | string
  target: SimNode | string
}

export function RelationGraph({ data }: { data: GraphData }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const router = useRouter()

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || data.nodes.length === 0) return

    // d3를 동적 import (Client Component에서만 로드)
    let cleanup: (() => void) | undefined

    import('d3').then((d3) => {
      const width = svg.clientWidth || 200
      const height = svg.clientHeight || 200

      // 기존 내용 제거
      d3.select(svg).selectAll('*').remove()

      const nodes: SimNode[] = data.nodes.map((n) => ({ ...n }))
      const links: SimLink[] = data.links.map((l) => ({ ...l }))

      // Force simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3.forceLink<SimNode, SimLink>(links)
            .id((d) => d.id)
            .distance(40),
        )
        .force('charge', d3.forceManyBody().strength(-60))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(12))

      const g = d3.select(svg).append('g')

      // 줌
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })
      d3.select(svg).call(zoom)

      // 링크 그리기
      const link = g
        .append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', 'var(--color-border)')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', 1)

      // 노드 그리기
      const node = g
        .append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', (d) => Math.max(3, Math.min(8, 3 + d.linkCount)))
        .attr('fill', 'var(--color-primary)')
        .attr('fill-opacity', 0.8)
        .attr('stroke', 'var(--color-bg)')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .on('click', (_event, d) => {
          router.push(`/blog/${d.slug}`)
        })

      // 호버 시 제목 표시
      node.append('title').text((d) => d.title)

      // 라벨 (연결 2개 이상만)
      const label = g
        .append('g')
        .selectAll('text')
        .data(nodes.filter((n) => n.linkCount >= 2))
        .join('text')
        .text((d) => d.title.length > 12 ? d.title.slice(0, 12) + '…' : d.title)
        .attr('font-size', '7px')
        .attr('fill', 'var(--color-secondary)')
        .attr('text-anchor', 'middle')
        .attr('dy', -10)
        .attr('pointer-events', 'none')

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => (d.source as SimNode).x ?? 0)
          .attr('y1', (d) => (d.source as SimNode).y ?? 0)
          .attr('x2', (d) => (d.target as SimNode).x ?? 0)
          .attr('y2', (d) => (d.target as SimNode).y ?? 0)

        node.attr('cx', (d) => d.x ?? 0).attr('cy', (d) => d.y ?? 0)
        label.attr('x', (d) => d.x ?? 0).attr('y', (d) => d.y ?? 0)
      })

      // 드래그
      const drag = d3
        .drag<SVGCircleElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      node.call(drag as never)

      cleanup = () => simulation.stop()
    })

    return () => cleanup?.()
  }, [data, router])

  return (
    <div>
      <p
        className="text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-secondary)' }}
      >
        Graph
      </p>
      <svg
        ref={svgRef}
        className="w-full aspect-square rounded-xl border"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      />
    </div>
  )
}
