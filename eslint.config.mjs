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
	},
	{
		ignores: ['.svelte-kit/**', 'out/**', 'build/**'],
	}
);
