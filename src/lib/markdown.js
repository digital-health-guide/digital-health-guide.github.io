import { Marked } from 'marked';
import GithubSlugger from 'github-slugger';
import { rewriteHref } from './paths.js';
import { stringsFor } from './strings.js';

const escapeAttribute = (value) =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const plainText = (html) =>
	html
		.replace(/<[^>]*>/g, '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.trim();

// "see Chapter 3.4 — Discovery Phases" and "See Chapters 1.9, 3.0" are the book's
// house style for cross-references. Link the numbers to the chapter pages.
function chapterReferences(chapterHref) {
	return {
		name: 'chapterRef',
		level: 'inline',
		start(src) {
			const match = /Chapters? \d/.exec(src);
			return match ? match.index : undefined;
		},
		tokenizer(src) {
			const match = /^(Chapters?) (\d{1,2}\.\d{1,2}(?:\s*,\s*\d{1,2}\.\d{1,2})*)/.exec(src);
			if (!match) return undefined;
			// Never nest a link inside a link.
			if (this.lexer.state.inLink) return undefined;
			const numbers = match[2].split(',').map((n) => n.trim());
			if (!numbers.some((n) => chapterHref(n))) return undefined;
			return { type: 'chapterRef', raw: match[0], word: match[1], numbers };
		},
		renderer(token) {
			if (token.numbers.length === 1) {
				const href = chapterHref(token.numbers[0]);
				return href
					? `<a href="${href}">${token.word} ${token.numbers[0]}</a>`
					: `${token.word} ${token.numbers[0]}`;
			}
			const linked = token.numbers.map((n) => {
				const href = chapterHref(n);
				return href ? `<a href="${href}">${n}</a>` : n;
			});
			return `${token.word} ${linked.join(', ')}`;
		}
	};
}

/**
 * Render one content file.
 *
 * @param {string} markdown raw file contents
 * @param {object} options
 * @param {string} options.file content path, used to resolve relative links
 * @param {string} [options.route] the page's own route, so it never links to itself
 * @param {(number: string) => string | null} options.chapterHref chapter number to route
 * @returns {{ html: string, title: string, headings: Array<{depth: number, id: string, text: string}>, summary: string }}
 */
export function renderMarkdown(markdown, { file, route, locale, chapterHref = () => null }) {
	// A chapter that mentions its own number links nowhere useful.
	const href = (number) => {
		const target = chapterHref(number);
		return target && target !== route ? target : null;
	};
	const t = stringsFor(locale);

	const slugger = new GithubSlugger();
	const headings = [];
	let title = '';
	// The book's own one-line tagline: the first H3, immediately after the H1
	// on the home page of every locale ("### A practical handbook of…" /
	// "### Llawlyfr ymarferol o…"). Used for a short <title>, since the H1 is
	// just the brand name "Digital Health Guide" in every locale.
	let subtitle = '';

	const marked = new Marked({ gfm: true });
	marked.use({
		extensions: [chapterReferences(href)],
		renderer: {
			heading({ tokens, depth }) {
				const html = this.parser.parseInline(tokens);
				const text = plainText(html);
				const id = slugger.slug(text);
				if (depth === 1 && !title) title = text;
				if (depth === 3 && !subtitle) subtitle = text;
				if (depth === 2 || depth === 3) headings.push({ depth, id, text });
				// The page title needs no self-anchor.
				const anchor =
					depth === 1
						? ''
						: `<a class="heading-anchor" href="#${id}" aria-label="${t.headingAnchorPrefix} “${escapeAttribute(text)}”">#</a>`;
				return `<h${depth} id="${id}">${html}${anchor}</h${depth}>\n`;
			},
			link({ href, title: linkTitle, tokens }) {
				const html = this.parser.parseInline(tokens);
				const resolved = rewriteHref(href, file);
				const external = /^[a-z][a-z0-9+.-]*:/i.test(resolved) || resolved.startsWith('//');
				const attributes = [
					`href="${escapeAttribute(resolved)}"`,
					linkTitle ? `title="${escapeAttribute(linkTitle)}"` : '',
					external ? 'rel="noopener noreferrer"' : ''
				].filter(Boolean);
				return `<a ${attributes.join(' ')}>${html}</a>`;
			}
		}
	});

	const html = marked.parse(markdown);
	return { html, title, subtitle, headings, summary: summarize(markdown) };
}

/** A one-line description for <meta name="description">. */
function summarize(markdown) {
	const lines = markdown.split('\n');
	for (const line of lines) {
		const text = line.trim();
		if (!text || text.startsWith('#') || text.startsWith('---') || text.startsWith('>')) continue;
		const plain = text
			.replace(/\*\*In one sentence:\*\*\s*/i, '')
			.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
			.replace(/[*_`]/g, '')
			.trim();
		if (plain.length < 20) continue;
		return plain.length > 300 ? `${plain.slice(0, 297).trimEnd()}…` : plain;
	}
	return '';
}
