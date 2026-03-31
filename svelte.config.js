import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'out',
			assets: 'out',
			fallback: '404.html',
		}),
		prerender: {
			handleMissingId: 'warn',
		},
	},
};

export default config;
