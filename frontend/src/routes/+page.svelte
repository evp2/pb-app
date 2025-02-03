<script lang="ts">
	import { base } from "$app/paths";
	import { Badge } from "$lib/components/ui/badge";

	const { data } = $props();
	$effect(() => {
		data.metadata.title = "Home";
		data.metadata.headline = `Welcome to ${data.config.site?.name}`;
	});
</script>
<br>
<div>
	<h6>Credits</h6>
	<ol class="pt-5">
		<li>
			Modern UI system based on <a href="https://www.shadcn-svelte.com/"
										 class="font-bold underline">Shadcn</a>
		</li>
		<li>
			Svelte 5 & SvelteKit routing, PageData loading, CSR with <code>adapter-static</code>
		</li>
		<li>PocketBase: CRUD, typegen, realtime data updates</li>
	</ol>
</div>

<div class="pt-5">
	Now <a href="{base}/tickets"><Badge>browse/edit/create</Badge> tickets</a>.
</div>
