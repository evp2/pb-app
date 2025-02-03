<script lang="ts">
	import type { PageData } from "./$types";
	import Changes from "./Changes.svelte";
	import * as Table from "$lib/components/ui/table/index.js";

	const { data }: { data: PageData } = $props();
	$effect(() => {
		data.metadata.title = data.metadata.headline = "Auditlog";
	});
</script>

<div>
	<Table.Root>
		<Table.Header>
			<Table.Head class="w-[150px]">when</Table.Head>
			<Table.Head class="w-[150px]">what</Table.Head>
			<Table.Head>who</Table.Head>
		</Table.Header>
		<Table.Body>
			{#each data.logs as item}
				<Table.Row>
					<Table.Cell class="w-[150px]">{item.updated}</Table.Cell>
					<Table.Cell class="w-[150px]">{item.event}</Table.Cell>
					<Table.Cell
						>{item.admin || item.expand?.user?.name || item.user}</Table.Cell
					>
				</Table.Row>
				<Changes auditlog={item} />
			{:else}
				<Table.Row>
					<Table.Cell>No records found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
