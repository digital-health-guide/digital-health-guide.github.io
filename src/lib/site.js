// Constants shared by the client-side components. Keep this free of any
// content imports so it stays cheap to ship to the browser.

export const SITE_URL = 'https://digital-health-guide.github.io';
export const SITE_NAME = 'Digital Health Guide';
export const REPOSITORY = 'https://github.com/digital-health-guide/digital-health-guide';

/** Themes vendored into static/themes/ by bin/sync-lily.mjs. */
export const THEMES = [
	'light',
	'dark',
	'united-kingdom-national-health-service-england-for-patients',
	'united-kingdom-national-health-service-england-for-practitioners',
	'united-kingdom-national-health-service-scotland-for-patients',
	'united-kingdom-national-health-service-scotland-for-practitioners',
	'united-kingdom-national-health-service-wales-for-patients',
	'united-kingdom-national-health-service-wales-for-practitioners',
	'united-kingdom-government-digital-service'
];

export const THEME_LABELS = {
	light: 'Light',
	dark: 'Dark',
	'united-kingdom-national-health-service-england-for-patients': 'NHS England — patients',
	'united-kingdom-national-health-service-england-for-practitioners': 'NHS England — practitioners',
	'united-kingdom-national-health-service-scotland-for-patients': 'NHS Scotland — patients',
	'united-kingdom-national-health-service-scotland-for-practitioners':
		'NHS Scotland — practitioners',
	'united-kingdom-national-health-service-wales-for-patients': 'NHS Wales — patients',
	'united-kingdom-national-health-service-wales-for-practitioners': 'NHS Wales — practitioners',
	'united-kingdom-government-digital-service': 'GOV.UK'
};
