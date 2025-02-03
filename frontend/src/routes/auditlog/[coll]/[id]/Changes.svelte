<script lang="ts">
	import type { AuditlogResponse } from "$lib/pocketbase/generated-types";
	import * as Table from "$lib/components/ui/table/index.js";

	const { auditlog }: { auditlog: AuditlogResponse } = $props();
	const keys = $derived(Object.keys(auditlog.original || {}));
</script>

{#each keys as key}
	<Table.Row>
		<Table.Cell>{key}</Table.Cell>
		<Table.Cell class="w-[150px]"
			><pre>{auditlog.original[key]}</pre></Table.Cell
		>
		<Table.Cell class="w-[150px]"><pre>{auditlog.data[key]}</pre></Table.Cell>
	</Table.Row>
{/each}

<style>
	pre {
		margin: 0;
		padding: 0;
	}
</style>
