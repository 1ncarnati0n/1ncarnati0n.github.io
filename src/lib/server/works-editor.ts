// 로컬 포트폴리오 편집기(/admin/works/)용 파일 입출력. `pnpm dev`에서만 호출된다.
// ponytail: 인증 없음 — localhost 전용. `vite dev --host`로 외부에 열지 말 것.
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { normalizeBlogSlug } from '$lib/content/blog-slug'
import { walkMarkdownFiles, WORKS_DIR } from '$lib/content/filesystem'

export const IMAGE_ROOT = path.join(process.cwd(), 'static', 'images', 'works')
export const IMAGE_URL_ROOT = '/images/works'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
// svg는 스크립트를 담을 수 있어 제외
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif'])

export type EditableWork = {
  slug: string
  file: string // contents/works 기준 상대 경로
  draft: boolean
  data: Record<string, unknown>
  body: string
}

/** slug가 이미 정규화된 안전한 값인지 확인 (경로 조작 차단) */
export function isSafeSlug(slug: string) {
  return slug.length > 0 && slug === normalizeBlogSlug(slug)
}

/** 업로드 파일명을 저장 가능한 이름으로 바꾼다. 허용되지 않는 확장자면 null */
export function safeImageName(name: string): string | null {
  const base = path.basename(name.normalize('NFC')).toLowerCase()
  const ext = path.extname(base)
  if (!IMAGE_EXTENSIONS.has(ext)) return null

  const stem = base
    .slice(0, -ext.length)
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${stem || 'image'}${ext}`
}

function toDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return typeof value === 'string' ? value : ''
}

export async function listEditableWorks(): Promise<EditableWork[]> {
  const works: EditableWork[] = []

  for (const source of await walkMarkdownFiles(WORKS_DIR)) {
    const raw = await fs.readFile(source.filePath, 'utf-8')
    const parsed = matter(raw)
    // gray-matter는 입력 문자열 기준으로 결과를 캐시하므로 복제해서 쓴다
    const data: Record<string, unknown> = structuredClone(parsed.data)
    const fileName = source.sourcePathParts.at(-1) ?? 'untitled'
    data.date = toDateString(data.date)

    works.push({
      slug: typeof data.slug === 'string' ? data.slug : normalizeBlogSlug(fileName),
      file: path.relative(WORKS_DIR, source.filePath),
      draft: data.draft === true,
      data,
      body: parsed.content.replace(/^\n/, ''),
    })
  }

  return works
}

export type WorkInput = {
  slug: string
  isNew: boolean
  data: Record<string, unknown>
  body: string
}

/** 빈 값은 frontmatter에서 뺀다 */
function compact(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) =>
      Array.isArray(v) ? v.length > 0 : v !== '' && v !== undefined && v !== null && v !== false,
    ),
  )
}

export async function saveWork(input: WorkInput) {
  if (!isSafeSlug(input.slug)) throw new Error(`slug 형식이 올바르지 않습니다: ${input.slug}`)

  const existing = (await listEditableWorks()).find((w) => w.slug === input.slug)
  if (input.isNew && existing) throw new Error(`이미 있는 slug입니다: ${input.slug}`)
  if (!input.isNew && !existing) throw new Error(`편집할 작업을 찾을 수 없습니다: ${input.slug}`)

  const filePath = existing
    ? path.join(WORKS_DIR, existing.file)
    : path.join(WORKS_DIR, `${input.slug}.md`)
  const data = compact({ ...input.data, slug: input.slug })

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, matter.stringify(`\n${input.body.trim()}\n`, data), 'utf-8')
  return path.relative(process.cwd(), filePath)
}

/** 이미지를 static/images/works/<slug>/에 저장하고 공개 URL을 돌려준다. 같은 이름은 덮어쓰지 않고 번호를 붙인다 */
export async function saveImage(slug: string, file: File) {
  if (!isSafeSlug(slug)) throw new Error(`slug 형식이 올바르지 않습니다: ${slug}`)
  if (file.size > MAX_IMAGE_BYTES) throw new Error(`이미지가 너무 큽니다 (최대 5MB): ${file.name}`)

  const name = safeImageName(file.name)
  if (!name) throw new Error(`png/jpg/webp/gif만 올릴 수 있습니다: ${file.name}`)

  const dir = path.join(IMAGE_ROOT, slug)
  await fs.mkdir(dir, { recursive: true })

  const ext = path.extname(name)
  const stem = name.slice(0, -ext.length)
  let candidate = name
  for (let i = 1; await fs.stat(path.join(dir, candidate)).then(() => true, () => false); i++) {
    candidate = `${stem}-${i}${ext}`
  }

  await fs.writeFile(path.join(dir, candidate), Buffer.from(await file.arrayBuffer()))
  return `${IMAGE_URL_ROOT}/${slug}/${candidate}`
}
