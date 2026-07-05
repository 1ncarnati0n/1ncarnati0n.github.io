export const SITE_URL = 'https://1ncarnati0n.github.io'
export const SITE_TITLE = '1ncarnati0n'
export const SITE_DESCRIPTION = 'AI & Software Engineering, Computational Design'

export function absoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString()
}

export function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
