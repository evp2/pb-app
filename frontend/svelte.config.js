import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		alias: {
			$lib: "src/lib",
		},
		adapter: adapter({
			prerender: { entries: [] }, // Prerendering turned off
			fallback: "index.html", // enable SPA mode
		}),
	},
};

export default config;
