<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import SkipLink from '$lib/lily/components/SkipLink.svelte';
	import Header from '$lib/lily/components/Header.svelte';
	import Footer from '$lib/lily/components/Footer.svelte';
	import PickerBar from '$lib/lily/helpers/picker-bar/index.ts';
	import { REPOSITORY, THEMES, THEME_LABELS } from '$lib/site.js';
	import { LOCALES, LOCALE_LABELS, DEFAULT_LOCALE, localePrefix } from '$lib/locales.js';
	import { stringsFor } from '$lib/strings.js';
	import '../styles/site.css';

	let { children } = $props();

	const currentLocale = $derived(page.data?.doc?.locale ?? DEFAULT_LOCALE);
	const alternates = $derived(page.data?.alternates ?? []);
	const t = $derived(stringsFor(currentLocale));
	const home = $derived(`${localePrefix(currentLocale)}/`);

	// "Contents" is the current locale's own home page; the reference pages
	// (glossary, index, style guide, spec) are not translated, so they have
	// exactly one route shared by every locale.
	const links = $derived([
		{ href: home, label: t.navContents },
		{ href: '/glossary/', label: t.navGlossary },
		{ href: '/subject-index/', label: t.navIndex },
		{ href: '/style-guide/', label: t.navStyleGuide },
		{ href: '/spec/', label: t.navSpecification }
	]);

	const current = (href) => (page.url.pathname === href ? 'page' : undefined);

	/** Navigate to the equivalent page in the newly-chosen locale. */
	function handleLocaleChange(locale) {
		if (locale === currentLocale) return;
		const alternate = alternates.find((a) => a.locale === locale);
		goto(alternate?.route ?? `${localePrefix(locale)}/`);
	}
</script>

<SkipLink href="#main" label={t.skipToMain} />

<Header label={t.siteHeader} class="site-header">
	<div class="site-header-inner">
		<a class="site-brand" href={home}>
			<img src="/icon-600.png" alt="" aria-hidden="true" width="32" height="32" />
			<span>Digital Health Guide</span>
		</a>
		<nav class="site-nav" aria-label={t.mainNav}>
			{#each links as link (link.href)}
				<a href={link.href} aria-current={current(link.href)}>{link.label}</a>
			{/each}
			<a href={REPOSITORY}>{t.navGitHub}</a>
		</nav>
		<div class="site-tools">
			<PickerBar
				labels={{
					theme: t.pickerTheme,
					locale: t.pickerLocale,
					textSize: t.pickerTextSize,
					share: t.pickerShare
				}}
				themesUrl="/themes/"
				themes={THEMES}
				themeProps={{ themeLabels: THEME_LABELS, storageKey: 'digital-health-guide-theme', detectFromSystem: true }}
				locales={LOCALES.map((l) => l.slug)}
				localeProps={{
					localeLabels: LOCALE_LABELS,
					value: currentLocale,
					onChange: handleLocaleChange
				}}
				sizes={['small', 'medium', 'large', 'x-large']}
				textSizeProps={{ storageKey: 'digital-health-guide-text-size', defaultValue: 'medium' }}
				shareProps={{ copyLabel: t.pickerShareCopyLink, copiedLabel: t.pickerShareCopied }}
			/>
		</div>
	</div>
</Header>

<main id="main" class="site-main">
	{@render children()}
</main>

<Footer label={t.siteFooter} class="site-footer">
	<div class="site-footer-inner">
		<p>
			<em>Digital Health Guide</em> — {t.footerDescription}
			<a href="https://github.com/LilyDesignSystem">{t.footerLilyLink}</a>.
		</p>
		<div class="site-footer-links">
			<a href={REPOSITORY}>{t.footerGitHub}</a>
			<a href="https://gitlab.com/digital-health-guide/digital-health-guide">{t.footerGitLab}</a>
			<a href="https://codeberg.org/digital-health-guide/digital-health-guide">{t.footerCodeberg}</a>
			<a href="/spec/">{t.footerSpecification}</a>
		</div>
	</div>
</Footer>
