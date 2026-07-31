<script>
	import { page } from '$app/state';
	import SkipLink from '$lib/lily/components/SkipLink.svelte';
	import Header from '$lib/lily/components/Header.svelte';
	import Footer from '$lib/lily/components/Footer.svelte';
	import Sidebar from '$lib/lily/components/Sidebar.svelte';
	import SectionNav from '$lib/lily/components/SectionNav.svelte';
	import SectionList from '$lib/lily/components/SectionList.svelte';
	import SectionListItem from '$lib/lily/components/SectionListItem.svelte';
	import ThemePicker from '$lib/lily/helpers/ThemePicker.svelte';
	import TextSizePicker from '$lib/lily/helpers/TextSizePicker.svelte';
	import { REPOSITORY, THEMES, THEME_LABELS } from '$lib/site.js';
	import '../styles/site.css';

	let { data, children } = $props();

	// The 404.html fallback renders without layout data, so there is no book
	// navigation to show on it.
	const contents = $derived(data?.contents ?? []);

	const links = [
		{ href: '/', label: 'Contents' },
		{ href: '/glossary/', label: 'Glossary' },
		{ href: '/subject-index/', label: 'Index' },
		{ href: '/style-guide/', label: 'Style guide' },
		{ href: '/spec/', label: 'Specification' }
	];

	const current = (href) => (page.url.pathname === href ? 'page' : undefined);

	// The book navigation is a disclosure on small screens and always open on
	// wide ones. Tracking the media query keeps one copy of the markup.
	let wide = $state(false);
	$effect(() => {
		const query = window.matchMedia('(min-width: 64rem)');
		const sync = () => (wide = query.matches);
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});

	const partOpen = (section) =>
		wide || section.items.some((item) => item.route === page.url.pathname);
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

<div class="site-shell" class:site-shell-wide={contents.length === 0}>
	{#if contents.length}
		<details class="book-nav" open={wide || undefined}>
			<summary>Book navigation</summary>
			<Sidebar label="Book navigation" class="book-sidebar">
				<SectionNav label="Contents">
						{#each contents as section (section.title)}
							<details class="book-part" open={partOpen(section)}>
								<summary>{section.title}</summary>
								<SectionList>
									{#each section.items as item (item.route)}
										<SectionListItem current={item.route === page.url.pathname}>
											<a href={item.route}>{item.short}</a>
										</SectionListItem>
									{/each}
								</SectionList>
							</details>
						{/each}
					</SectionNav>
				</Sidebar>
			</details>
	{/if}

	<main id="main" class="site-main">
		{@render children()}
	</main>
</div>

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
