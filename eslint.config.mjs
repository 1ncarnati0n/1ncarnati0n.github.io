import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			globals: {
				document: 'readonly',
				fetch: 'readonly',
				HTMLElement: 'readonly',
				IntersectionObserver: 'readonly',
				SVGCircleElement: 'readonly',
				SVGSVGElement: 'readonly',
			},
			parserOptions: {
				parser: ts.parser,
			},
		},
		// 정의되지 않은 식별자는 svelte-check(TS)가 잡는다 — 브라우저 전역을 손으로 나열하지 않는다
		rules: { 'no-undef': 'off' },
	},
	{
		files: ['scripts/**/*.mjs'],
		languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
	},
	{
		ignores: ['.svelte-kit/**', 'out/**', 'build/**'],
	}
);
