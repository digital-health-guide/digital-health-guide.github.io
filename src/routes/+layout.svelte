<script>
	import { page } from '$app/state';
	import SkipLink from '$lib/lily/components/SkipLink.svelte';
	import Header from '$lib/lily/components/Header.svelte';
	import Footer from '$lib/lily/components/Footer.svelte';
	import ThemePicker from '$lib/lily/helpers/ThemePicker.svelte';
	import TextSizePicker from '$lib/lily/helpers/TextSizePicker.svelte';
	import { REPOSITORY, THEMES, THEME_LABELS } from '$lib/site.js';
	import '../styles/site.css';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Contents' },
		{ href: '/glossary/', label: 'Glossary' },
		{ href: '/subject-index/', label: 'Index' },
		{ href: '/style-guide/', label: 'Style guide' },
		{ href: '/spec/', label: 'Specification' }
	];

	const current = (href) => (page.url.pathname === href ? 'page' : undefined);
</script>

<SkipLink href="#main" label="Skip to main content" />

<Header label="Site header" class="site-header">
	<div class="site-header-inner">
		<a class="site-brand" href="/">
			<img src="/icon-600.png" alt="" aria-hidden="true" width="32" height="32" />
			<span>Digital Health Guide</span>
		</a>
		<nav class="site-nav" aria-label="Main">
			{#each links as link (link.href)}
				<a href={link.href} aria-current={current(link.href)}>{link.label}</a>
			{/each}
			<a href={REPOSITORY}>GitHub</a>
		</nav>
		<div class="site-tools">
			<TextSizePicker
				label="Text size"
				sizes={['small', 'medium', 'large', 'x-large']}
				storageKey="digital-health-guide-text-size"
			/>
			<ThemePicker
				label="Theme"
				themesUrl="/themes/"
				themes={THEMES}
				themeLabels={THEME_LABELS}
				storageKey="digital-health-guide-theme"
				detectFromSystem
			/>
		</div>
	</div>
</Header>

<main id="main" class="site-main">
	{@render children()}
</main>

<Footer label="Site footer" class="site-footer">
	<div class="site-footer-inner">
		<p>
			<em>Digital Health Guide</em> — a practical handbook of best practices for delivering digital
			services in health and social care organizations. Written by Joel Parker Henderson. Built with the
			<a href="https://github.com/LilyDesignSystem">Lily Design System</a>.
		</p>
		<div class="site-footer-links">
			<a href={REPOSITORY}>GitHub</a>
			<a href="https://gitlab.com/digital-health-guide/digital-health-guide">GitLab</a>
			<a href="https://codeberg.org/digital-health-guide/digital-health-guide">Codeberg</a>
			<a href="/spec/">Specification</a>
		</div>
	</div>
</Footer>
