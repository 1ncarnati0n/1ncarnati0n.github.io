import { describe, expect, it } from 'vitest'

import { assertValidBlogSlug, normalizeBlogSlug } from './blog-slug'

describe('normalizeBlogSlug', () => {
  it('normalizes spaces, punctuation, and casing', () => {
    expect(normalizeBlogSlug('4. Generic Types')).toBe('4-generic-types')
  })

  it('splits camel case words into readable segments', () => {
    expect(normalizeBlogSlug('RevitShortcut')).toBe('revit-shortcut')
  })

  it('preserves readable Korean characters', () => {
    expect(normalizeBlogSlug('순전파와 역전파 그리고 체인룰')).toBe(
      '순전파와-역전파-그리고-체인룰',
    )
  })
})

describe('assertValidBlogSlug', () => {
  it('accepts normalized slugs', () => {
    expect(assertValidBlogSlug('iterator-closure', 'post.md')).toBe(
      'iterator-closure',
    )
  })

  it('rejects nested path separators', () => {
    expect(() => assertValidBlogSlug('rust/iterator-closure', 'post.md')).toThrow(
      'must not contain "/"',
    )
  })

  it('rejects non-normalized values', () => {
    expect(() => assertValidBlogSlug('Iterator Closure', 'post.md')).toThrow(
      'must already be normalized',
    )
  })
})
