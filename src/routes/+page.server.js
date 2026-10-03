// The unprefixed home page is the old URL of the default locale. It is a page
// rather than a redirect() so that the script below can carry the query string
// (old search links look like `/?<target>`) over to /en-gb/.
export function load() {
	return {};
}
