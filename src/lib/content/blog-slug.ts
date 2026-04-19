const SEPARATOR_PATTERN = /[\s._]+/g
const DISALLOWED_PATTERN = /[^\p{L}\p{N}-]+/gu
const REPEATED_DASH_PATTERN = /-{2,}/g
const EDGE_DASH_PATTERN = /^-+|-+$/g
const LOWER_TO_UPPER_PATTERN = /([\p{Ll}\p{N}])([\p{Lu}])/gu
const UPPER_TO_WORD_PATTERN = /([\p{Lu}])([\p{Lu}][\p{Ll}])/gu
const REFERENCE_SEPARATOR_PATTERN = /[\\/]+/g

export function normalizeBlogSlug(input: string): string {
  return input
    .normalize('NFKC')
    .trim()
    .replace(UPPER_TO_WORD_PATTERN, '$1-$2')
    .replace(LOWER_TO_UPPER_PATTERN, '$1-$2')
    .toLowerCase()
    .replace(SEPARATOR_PATTERN, '-')
    .replace(DISALLOWED_PATTERN, '')
    .replace(REPEATED_DASH_PATTERN, '-')
    .replace(EDGE_DASH_PATTERN, '')
}

export function assertValidBlogSlug(slug: string, filePath: string): string {
  if (slug.includes('/')) {
    throw new Error(`Blog slug must not contain "/": ${filePath}`)
  }

  const normalized = normalizeBlogSlug(slug)

  if (!normalized) {
    throw new Error(`Blog slug is empty after normalization: ${filePath}`)
  }

  if (slug !== normalized) {
    throw new Error(
      `Blog slug must already be normalized. Use "${normalized}" in ${filePath}`,
    )
  }

  return normalized
}

export function normalizeBlogReference(input: string): string {
  return normalizeBlogSlug(input.replace(REFERENCE_SEPARATOR_PATTERN, ' '))
}
