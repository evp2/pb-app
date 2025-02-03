<script lang="ts">
	import { base } from "$app/paths";
	import Tabs from "$lib/components/TabGroup.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import type { Snippet } from "svelte";
	import LoginGuard from "$lib/components/LoginGuard.svelte";
	import { preloadData } from "$app/navigation";
	import AuditPage from "../../auditlog/[coll]/[id]/+page.svelte";
	import type { PageData } from "../../auditlog/[coll]/[id]/$types";
	import Delete from "$lib/components/Delete.svelte";
	import { authModel, client } from "$lib/pocketbase";

	const { data, children }: { data: any; children: Snippet } = $props();
	const record = $derived(data.record);
	let active = $state("");
	$effect(() => {
		if (active === "auditlog")
			data.metadata.title =
				data.metadata.headline = `Auditlog: ${record.collectionName}/${record.id}`;
		if (active === "delete")
			data.metadata.title =
				data.metadata.headline = `Delete: ${record.collectionName}/${record.id}`;
	});
</script>

<LoginGuard>
	<Tabs bind:active>
		{#snippet tabs()}
			<a href="{base}/tickets/{record.id}/">
				<Tab key="view" pathname="/tickets/{record.id}/">View</Tab>
			</a>
			{#if $authModel?.id === record.user || client.authStore.isAdmin}
				<a href="{base}/tickets/{record.id}/edit/">
					<Tab key="edit" pathname="/tickets/{record.id}/edit/">Edit</Tab>
				</a>
				<a href="{base}/tickets/{record.id}/delete/">
					<Tab key="delete" pathname="/tickets/{record.id}/delete/">Delete</Tab>
				</a>
			{/if}
			<a href="{base}/tickets/{record.id}/auditlog/">
				<Tab key="auditlog" pathname="{base}/tickets/{record.id}/auditlog/">
					Audit Log
				</Tab>
			</a>
		{/snippet}
		<!-- tab content -->
		{#if active === "auditlog"}
			{#await preloadData(`${base}/auditlog/tickets/${record.id}/`) then result}
				{#if result.type === "loaded" && result.status === 200}
					<AuditPage data={result.data as PageData} />
				{:else}
					something went wrong!
				{/if}
			{/await}
		{:else if active === "delete"}
			<Delete
				id={record.id}
				table={record.collectionName}
				return_path="../.."
			/>
		{:else}
			<!-- default: just render the page we're on -->
			{@render children()}
		{/if}
	</Tabs>
	{#snippet otherwise()}
		<!-- otherwise: just render the page we're on -->
		{@render children()}
	{/snippet}
</LoginGuard>

<style>
	a {
		/* don't color links */
		color: inherit;
	}
</style>
