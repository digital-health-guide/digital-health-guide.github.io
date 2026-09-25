import { error } from '@sveltejs/kit';
import { loadDoc } from '$lib/pageData.js';

export function load() {
	const data = loadDoc('/');
	if (!data) error(404, 'The en-gb book index is missing from content/.');
	return data;
}
