import type { BlogPost, BlogTreeFolderNode, BlogTreeNode } from '$lib/types/content'

export function sortTreeNodes(nodes: BlogTreeNode[]) {
  return nodes.sort((left, right) => {
    if (left.type !== right.type) return left.type === 'folder' ? -1 : 1
    return left.name.localeCompare(right.name, 'ko')
  })
}

function getOrCreateFolder(
  nodes: BlogTreeNode[],
  name: string,
  pathParts: string[],
): BlogTreeFolderNode {
  const existing = nodes.find(
    (node): node is BlogTreeFolderNode =>
      node.type === 'folder' && node.pathParts.join('/') === pathParts.join('/'),
  )

  if (existing) return existing

  const folder: BlogTreeFolderNode = {
    type: 'folder',
    name,
    pathParts,
    children: [],
  }
  nodes.push(folder)
  return folder
}

export function buildBlogTree(posts: BlogPost[]): BlogTreeNode[] {
  const tree: BlogTreeNode[] = []

  for (const post of posts) {
    let nodes = tree
    let pathParts: string[] = []

    for (const folder of post.sourcePathParts) {
      pathParts = [...pathParts, folder]
      nodes = getOrCreateFolder(nodes, folder, pathParts).children
    }

    nodes.push({
      type: 'post',
      name: post.sourceFileName,
      slug: post.slug,
      title: post.title,
    })
  }

  function sortNested(nodes: BlogTreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'folder') sortNested(node.children)
    }
    sortTreeNodes(nodes)
  }

  sortNested(tree)
  return tree
}
