<script lang="ts">
	import { client } from "$lib/pocketbase";
	// credit: https://css-tricks.com/lodge/svg/09-svg-data-uris/
	const internal_fallback_img =
		"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXRhZyI+PHBhdGggZD0iTTEyLjU4NiAyLjU4NkEyIDIgMCAwIDAgMTEuMTcyIDJINGEyIDIgMCAwIDAtMiAydjcuMTcyYTIgMiAwIDAgMCAuNTg2IDEuNDE0bDguNzA0IDguNzA0YTIuNDI2IDIuNDI2IDAgMCAwIDMuNDIgMGw2LjU4LTYuNThhMi40MjYgMi40MjYgMCAwIDAgMC0zLjQyeiIvPjxjaXJjbGUgY3g9IjcuNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==";
	const {
		record,
		file,
		thumb = "100x100",
		fallback = "internal",
		...rest
	}: {
		record: any;
		file: string;
		thumb?: string;
		fallback?: "internal" | "external";
	} = $props();
	const src = $derived(
		file
			? client.getFileUrl(record, file, { thumb })
			: fallback === "external"
				? `https://via.placeholder.com/${thumb}`
				: internal_fallback_img
	);
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<img {...rest} {src} rel="noreferrer" />
