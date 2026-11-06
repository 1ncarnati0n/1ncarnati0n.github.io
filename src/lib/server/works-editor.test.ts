import { describe, expect, it } from 'vitest'

import { isSafeSlug, safeImageName } from './works-editor'

describe('safeImageName', () => {
  it('strips directories and normalizes the stem', () => {
    expect(safeImageName('../../etc/My Photo (1).PNG')).toBe('my-photo-1.png')
  })

  it('rejects svg and unknown extensions', () => {
    expect(safeImageName('logo.svg')).toBeNull()
    expect(safeImageName('script.js')).toBeNull()
    expect(safeImageName('noext')).toBeNull()
  })

  it('falls back to "image" when nothing is left of the stem', () => {
    expect(safeImageName('도면.webp')).toBe('image.webp')
  })
})

describe('isSafeSlug', () => {
  it('accepts normalized slugs only', () => {
    expect(isSafeSlug('ifc-viewer')).toBe(true)
    expect(isSafeSlug('../x')).toBe(false)
    expect(isSafeSlug('a/b')).toBe(false)
    expect(isSafeSlug('')).toBe(false)
  })
})
