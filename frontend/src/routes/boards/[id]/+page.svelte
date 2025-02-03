<script lang="ts">
	import ImgModal from "$lib/pocketbase/ImgModal.svelte";
	import { client } from "$lib/pocketbase/index.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area";
	const { data } = $props();
	const record = $derived(data.record);

	const columns = [
		{ name: "Ready" },
		{ name: "In Progress" },
		{ name: "Complete" },
	];

	$effect(() => {
		data.metadata.title = data.metadata.headline = record.title;
	});
</script>

<ScrollArea class="rounded-md border" orientation="both" type="always">
	<div class="grid grid-cols-3 p-4" style="height: 800px;">
		{#each columns as column (column.name)}
			<div>
				<h2>{column.name}</h2>
			</div>
		{/each}
	</div>
</ScrollArea>
