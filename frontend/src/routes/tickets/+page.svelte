<script lang="ts">
	import { base } from "$app/paths";
	import DateShow from "$lib/components/DateShow.svelte";
	import Image from "$lib/pocketbase/Image.svelte";
	import Link2Modal from "$lib/components/Link2Modal.svelte";
	import { GitPullRequestCreateArrow } from 'lucide-svelte';
	import { client } from "$lib/pocketbase";
	import EditPage from "./[id]/edit/+page.svelte";
	import LoginGuard from "$lib/components/LoginGuard.svelte";
	import Paginator from "$lib/pocketbase/Paginator.svelte";
	import Spinner, { activityStore } from "$lib/components/Spinner.svelte";
	import { Button } from "$lib/components/ui/button";

	const { data } = $props();
	const tickets = $derived(data.tickets);
	const boards = $derived(data.boards);

	$effect(() => {
		data.metadata.title = data.metadata.headline = "Tickets";
	});
	const store = activityStore(() =>
		client.send("/api/generate", { method: "post" })
	);
</script>

<LoginGuard>
	<Link2Modal component={EditPage}>
		{#snippet trigger(onclick)}
			<div class="flex place-items-end">
				<Button href="{base}/tickets/new/edit" class="button" {onclick}>
					Create New Ticket
				</Button>
			</div>
		{/snippet}
	</Link2Modal>
	{#snippet otherwise()}
		<p>Please Sign In to create/edit tickets.</p>
	{/snippet}
</LoginGuard>

<Paginator store={tickets} showIfSinglePage={false} />
{#each $tickets.items as item}
	{@const [file] = item.files}
	{@const thumbnail = client.files.getUrl(item, file, { thumb: "100x100" })}
	<a href={`${base}/tickets/${item.id}`} class="post">
		<GitPullRequestCreateArrow></GitPullRequestCreateArrow>
		<div class="ticket">
			<div>
				{item.title}
			</div>
			<div>
				{new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
					new Date(item.updated)
				)}
				{#if item.expand?.user?.name}
					<i class="bx bx-pen" title="author"></i>
					{item.expand.user.name}
				{/if}
			</div>
		</div>
	</a>
{:else}
	<div>No tickets found. Create some.</div>
{/each}
<Paginator store={tickets} showIfSinglePage={false} />

<style>
	.ticket {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}
	.post {
		display: flex;
		gap: 1rem;
		padding-block: 1rem;
		& + .post {
			border-block-start: dashed 1px;
		}
	}
</style>
