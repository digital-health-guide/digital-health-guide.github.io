// `/` is a page, not a redirect(): `/?<target>` is a search, and a server-side
// redirect would drop the query. The page redirects on the client instead.
export function load() {
	return {};
}
