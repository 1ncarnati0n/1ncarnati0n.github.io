import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
	let initial: Theme = 'light';

	if (browser) {
		try {
			const stored = localStorage.getItem('theme-storage');
			if (stored) {
				const { state } = JSON.parse(stored);
				initial = state?.theme ?? 'light';
			} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				initial = 'dark';
			}
		} catch {
			// ignore
		}
	}

	const { subscribe, update } = writable<Theme>(initial);

	return {
		subscribe,
		toggle: () =>
			update((current) => {
				const next = current === 'light' ? 'dark' : 'light';
				if (browser) {
					document.documentElement.classList.toggle('dark', next === 'dark');
					localStorage.setItem(
						'theme-storage',
						JSON.stringify({ state: { theme: next } })
					);
				}
				return next;
			}),
	};
}

export const theme = createThemeStore();
