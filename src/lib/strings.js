// Site chrome strings — everything around the book's own content: header
// nav, the picker bar's labels, breadcrumbs, pagination, the footer, and the
// error page. The book's content itself is translated per-locale in
// content/<locale>/…; this is the much smaller set of UI strings the site
// itself owns.
//
// The four English locales (en-gb, en-us, en-gb-oxendict, en-001) share one
// table: none of these short UI strings has a US/UK/Oxford spelling
// difference. Only Welsh (cy-gb) needs its own.

const en = {
	skipToMain: 'Skip to main content',
	siteHeader: 'Site header',
	mainNav: 'Main',
	navContents: 'Contents',
	navGlossary: 'Glossary',
	navIndex: 'Index',
	navStyleGuide: 'Style guide',
	navSpecification: 'Specification',
	navGitHub: 'GitHub',
	pickerTheme: 'Theme',
	pickerLocale: 'Language',
	pickerTextSize: 'Text size',
	pickerShare: 'Share',
	pickerShareCopyLink: 'Copy link',
	pickerShareCopied: 'Copied',
	breadcrumb: 'Breadcrumb',
	breadcrumbChapters: 'Chapters',
	breadcrumbReference: 'Reference',
	onThisPage: 'On this page',
	headingAnchorPrefix: 'Link to',
	chapterNavigation: 'Chapter navigation',
	previous: 'Previous',
	next: 'Next',
	editOnGitHub: 'Edit this page on GitHub',
	sourceOfTruth: 'the book is the source of truth; this site renders it.',
	siteFooter: 'Site footer',
	footerDescription:
		'a practical handbook of best practices for delivering digital services in health and social care organizations. Written by Joel Parker Henderson. Built with the',
	footerLilyLink: 'Lily Design System',
	footerGitHub: 'GitHub',
	footerGitLab: 'GitLab',
	footerCodeberg: 'Codeberg',
	footerSpecification: 'Specification',
	notFoundHeading: 'Page not found',
	errorHeading: 'Something went wrong',
	notFoundBody: 'There is no page at',
	notFoundBodyEnd: 'The book may have moved or renamed it.',
	errorBodyFallback: 'The page could not be loaded.',
	tryPrefix: 'Try the',
	tryTableOfContents: 'table of contents',
	tryGlossary: 'glossary',
	tryOr: 'or the',
	tryIndex: 'index'
};

const cyGb = {
	skipToMain: 'Neidio i’r prif gynnwys',
	siteHeader: 'Pennawd y wefan',
	mainNav: 'Prif lywio',
	navContents: 'Cynnwys',
	navGlossary: 'Geirfa',
	navIndex: 'Mynegai',
	navStyleGuide: 'Canllaw arddull',
	navSpecification: 'Manyleb',
	navGitHub: 'GitHub',
	pickerTheme: 'Thema',
	pickerLocale: 'Iaith',
	pickerTextSize: 'Maint testun',
	pickerShare: 'Rhannu',
	pickerShareCopyLink: 'Copïo’r ddolen',
	pickerShareCopied: 'Wedi copïo',
	breadcrumb: 'Briwsion bara',
	breadcrumbChapters: 'Penodau',
	breadcrumbReference: 'Cyfeirnod',
	onThisPage: 'Ar y dudalen hon',
	headingAnchorPrefix: 'Dolen i',
	chapterNavigation: 'Llywio penodau',
	previous: 'Blaenorol',
	next: 'Nesaf',
	editOnGitHub: 'Golygu’r dudalen hon ar GitHub',
	sourceOfTruth: 'y llyfr yw’r ffynhonnell wirionedd; mae’r wefan hon yn ei rendro.',
	siteFooter: 'Troedyn y wefan',
	footerDescription:
		'llawlyfr ymarferol o arferion gorau ar gyfer cyflenwi gwasanaethau digidol mewn sefydliadau iechyd a gofal cymdeithasol. Ysgrifennwyd gan Joel Parker Henderson. Adeiladwyd gyda’r',
	footerLilyLink: 'Lily Design System',
	footerGitHub: 'GitHub',
	footerGitLab: 'GitLab',
	footerCodeberg: 'Codeberg',
	footerSpecification: 'Manyleb',
	notFoundHeading: 'Heb ganfod y dudalen',
	errorHeading: 'Aeth rhywbeth o’i le',
	notFoundBody: 'Nid oes tudalen yn',
	notFoundBodyEnd: 'Mae’n bosibl bod y llyfr wedi symud neu ailenwi hon.',
	errorBodyFallback: 'Ni ellid llwytho’r dudalen.',
	tryPrefix: 'Rhowch gynnig ar y',
	tryTableOfContents: 'cynnwys',
	tryGlossary: 'eirfa',
	tryOr: 'neu’r',
	tryIndex: 'mynegai'
};

/** @type {Record<string, typeof en>} */
const TABLES = {
	'en-gb': en,
	'en-us': en,
	'en-gb-oxendict': en,
	'en-001': en,
	'cy-gb': cyGb
};

/** Site chrome strings for one locale, falling back to English. */
export function stringsFor(locale) {
	return TABLES[locale] ?? en;
}
