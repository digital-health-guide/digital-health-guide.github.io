import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// The vendored Lily components are written in TypeScript.
	preprocess: vitePreprocess(),
	kit: {
		// GitHub Pages serves plain files: prerender everything, no SPA fallback.
		adapter: adapter({ pages: 'build', assets: 'build', fallback: null, strict: true }),
		prerender: {
			handleHttpError: 'fail',
			// The book links to headings by anchor across many files; a stale
			// anchor is worth a warning, not a failed publish.
			handleMissingId: 'warn'
		}
	}
};
