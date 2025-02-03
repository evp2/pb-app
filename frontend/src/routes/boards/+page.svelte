<script lang="ts">
	import { base } from "$app/paths";
	import DateShow from "$lib/components/DateShow.svelte";
	import Image from "$lib/pocketbase/Image.svelte";
	import Link2Modal from "$lib/components/Link2Modal.svelte";
	import { client } from "$lib/pocketbase";
	import EditPage from "./[id]/edit/+page.svelte";
	import LoginGuard from "$lib/components/LoginGuard.svelte";
	import Paginator from "$lib/pocketbase/Paginator.svelte";
	import { activityStore } from "$lib/components/Spinner.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";

	const { data } = $props();
	const boards = $derived(data.boards);

	$effect(() => {
		data.metadata.title = data.metadata.headline = "Boards";
	});
	const store = activityStore(() =>
		client.send("/api/generate", { method: "post" })
	);
</script>

<LoginGuard>
	<Link2Modal component={EditPage}>
		{#snippet trigger(onclick)}
			<div class="flex place-items-end">
				<Button href="{base}/boards/new/edit" class="button" {onclick}>
					Create New Board
				</Button>
			</div>
		{/snippet}
	</Link2Modal>
	{#snippet otherwise()}
		<p>Please Sign In to create/edit project boards.</p>
	{/snippet}
</LoginGuard>
<Paginator store={boards} showIfSinglePage={false} />
{#each $boards.items as item}
	<a href={`${base}/boards/${item.id}`} class="post">
		<div>
			<Badge>
				<span>{item.title}</span>
				{#if item.expand?.user?.name}
					{"Author: " + item.expand.user.name}
				{/if}
			</Badge>
		</div>
	</a>
{/each}
<Paginator store={boards} showIfSinglePage={false} />
