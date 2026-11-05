// 빌드 산출물(out/) 검사: 미해결 wikilink/embed, draft 글 제목 노출을 찾으면 실패한다.
// 사용: pnpm build && pnpm check:out
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const OUT = 'out'
const TEXT_EXT = new Set(['.html', '.xml', '.json', '.txt'])

function listFiles(dir) {
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.join(e.parentPath ?? e.path, e.name))
}

const draftTitles = listFiles('contents')
  .filter((f) => f.endsWith('.md'))
  .map((f) => matter(fs.readFileSync(f, 'utf-8')).data)
  .filter((fm) => fm.draft === true && typeof fm.title === 'string' && fm.title.trim())
  .map((fm) => fm.title.trim())

const problems = []

for (const file of listFiles(OUT)) {
  if (!TEXT_EXT.has(path.extname(file))) continue
  const text = fs.readFileSync(file, 'utf-8')

  if (/class="[^"]*obsidian-(wikilink|embed)-unresolved/.test(text)) {
    problems.push(`${file}: 미해결 wikilink/embed`)
  }
  for (const title of draftTitles) {
    if (text.includes(title)) problems.push(`${file}: draft 글 제목 노출 "${title}"`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log(`check:out OK (draft ${draftTitles.length}개 검사)`)
