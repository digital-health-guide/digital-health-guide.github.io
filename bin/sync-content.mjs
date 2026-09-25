#!/usr/bin/env node
// Vendor the book's Markdown into content/ so this site builds standalone.
//
// Source: $BOOK if set, else the sibling checkout ../digital-health-guide.
// Run after the book changes:  npm run sync

import { cp, mkdir, rm, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES } from '../src/lib/locales.js';

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const book = resolve(process.env.BOOK ?? join(siteRoot, '..', 'digital-health-guide'));
const localesDir = join(book, 'locales');

if (!existsSync(join(localesDir, 'en-gb', 'index.md'))) {
	console.error(
		`No book found at ${book} (expected locales/en-gb/index.md). Set BOOK=/path/to/digital-health-guide.`
	);
	process.exit(1);
}

const contentDir = join(siteRoot, 'content');
await rm(contentDir, { recursive: true, force: true });
await mkdir(contentDir, { recursive: true });

let count = 0;

// Reference material lives once, in English, shared by every locale.
const files = ['GLOSSARY.md', 'INDEX.md', 'STYLE_GUIDE.md', 'CITATION.cff'];
const dirs = ['spec'];

for (const file of files) {
	const from = join(book, file);
	if (!existsSync(from)) {
		console.warn(`skip (missing): ${file}`);
		continue;
	}
	await cp(from, join(contentDir, file));
	count += 1;
}

for (const dir of dirs) {
	const from = join(book, dir);
	if (!existsSync(from)) {
		console.warn(`skip (missing): ${dir}/`);
		continue;
	}
	await mkdir(join(contentDir, dir), { recursive: true });
	for (const entry of await readdir(from)) {
		if (!entry.endsWith('.md')) continue;
		await cp(join(from, entry), join(contentDir, dir, entry));
		count += 1;
	}
}

// Each locale: its own index.md (table of contents) and chapters/<slug>/index.md.
for (const { slug } of LOCALES) {
	const localeDir = join(localesDir, slug);
	if (!existsSync(join(localeDir, 'index.md'))) {
		console.warn(`skip (missing): locales/${slug}/index.md`);
		continue;
	}

	await mkdir(join(contentDir, slug), { recursive: true });
	await cp(join(localeDir, 'index.md'), join(contentDir, slug, 'index.md'));
	count += 1;

	const chaptersFrom = join(localeDir, 'chapters');
	if (!existsSync(chaptersFrom)) {
		console.warn(`skip (missing): locales/${slug}/chapters/`);
		continue;
	}
	for (const entry of await readdir(chaptersFrom, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const from = join(chaptersFrom, entry.name, 'index.md');
		if (!existsSync(from)) continue;
		await mkdir(join(contentDir, slug, 'chapters', entry.name), { recursive: true });
		await cp(from, join(contentDir, slug, 'chapters', entry.name, 'index.md'));
		count += 1;
	}
}

// The icon doubles as the favicon and the social-card image.
const icons = [
	['assets/images/icon@600x600.png', 'icon-600.png'],
	['assets/images/icon@1200x1200.png', 'icon-1200.png']
];
for (const [from, to] of icons) {
	const src = join(book, from);
	if (!existsSync(src)) {
		console.warn(`skip (missing): ${from}`);
		continue;
	}
	await cp(src, join(siteRoot, 'static', to));
	count += 1;
}

const { size } = await stat(join(contentDir, 'en-gb', 'index.md'));
console.log(`Synced ${count} files from ${book} (en-gb/index.md ${size} bytes).`);
