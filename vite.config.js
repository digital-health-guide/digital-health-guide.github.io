import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const helper = (name) => resolve(here, `src/lib/lily/helpers/${name}/index.ts`);

export default defineConfig({
	plugins: [
		sveltekit({
			// The vendored Lily components are written in TypeScript.
			preprocess: vitePreprocess(),

			// GitHub Pages serves plain files: prerender everything.
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				strict: true
			}),

			prerender: {
				handleHttpError: 'fail',
				// The book links to headings by anchor across many files; a stale
				// anchor is worth a warning, not a failed publish.
				handleMissingId: 'warn'
			}
		})
	],
	resolve: {
		alias: {
			// PickerBar.svelte (vendored verbatim in src/lib/lily/helpers/picker-bar/)
			// imports its five wrapped pickers as real npm package specifiers, since
			// that is how the real @lilydesignsystem/svelte-picker-bar package is
			// built. This site vendors from the sibling Lily checkout rather than
			// installing those packages for real (see src/lib/lily/VENDOR.md), so
			// point the bare specifiers at the matching vendored barrels instead.
			'@lilydesignsystem/svelte-theme-picker': helper('theme-picker'),
			'@lilydesignsystem/svelte-locale-picker': helper('locale-picker'),
			'@lilydesignsystem/svelte-text-size-picker': helper('text-size-picker'),
			'@lilydesignsystem/svelte-search-picker': helper('search-picker'),
			'@lilydesignsystem/svelte-share-picker': helper('share-picker'),
			// theme-picker/locale-picker/text-size-picker/share-picker/search-picker each import
			// IconButton/Listbox from this package too.
			'@lilydesignsystem/svelte-headless': resolve(here, 'src/lib/lily/headless-for-helpers.js')
		}
	}
});
