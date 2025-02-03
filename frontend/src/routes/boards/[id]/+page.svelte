<script lang="ts">
	import ImgModal from "$lib/pocketbase/ImgModal.svelte";
	import { client } from "$lib/pocketbase/index.js";
	import {Footer} from "$lib/components/ui/sheet";
	import TabMenu from "$lib/components/TabMenu.svelte";
	import TabItem from "$lib/components/TabItem.svelte";

	const { data } = $props();
	const record = $derived(data.record);
	$effect(() => {
		data.metadata.title = data.metadata.headline = record.title;
	});
</script>

<article>
	<pre class="body">{record.title}</pre>
	{#each record.files ?? [] as file, index}
		{@const src = client.files.getUrl(record, file)}
		{@const title = `image ${index + 1} for: ${record.title}`}
		<!-- <img {src} alt={title} {title} /> -->
		<ImgModal {record} filename={file} />
	{/each}
</article>
