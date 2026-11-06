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

// Quartz 표기: "Apr 01, 2026". UTC로 고정해 SSR/브라우저 결과가 같도록
export function formatQuartzDate(date: Date | string): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		timeZone: 'UTC',
	});
}
