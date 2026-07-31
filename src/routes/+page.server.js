import { error } from '@sveltejs/kit';
import { document } from '$lib/book.js';

export function load() {
	const doc = document('/');
	if (!doc) error(404, 'The book README is missing from content/.');
	return { doc };
}
