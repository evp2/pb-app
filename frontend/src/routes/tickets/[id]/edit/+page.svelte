<script lang="ts">
	import SuperDebug, {
		type Infer,
		type SuperValidated,
		superForm,
	} from "sveltekit-superforms";
	import { alerts } from "$lib/components/Alerts.svelte";
	import {authModel, client, getItemById, save} from "$lib/pocketbase";
	import * as Select from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Trash2 } from 'lucide-svelte';
	import { Button } from "$lib/components/ui/button";
	import type {
		BoardsResponse,
		TicketsResponse,
	} from "$lib/pocketbase/generated-types.js";
	import * as Form from "$lib/components/ui/form/index.js";
	import { ticketSchema, type TicketSchema } from "$lib/schema";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { browser } from "$app/environment";
	import { Input } from "$lib/components/ui/input";
	import { base } from "$app/paths";
	import ImgModal from "$lib/pocketbase/ImgModal.svelte";

	let { data }: { data: SuperValidated<Infer<TicketSchema>> } = $props();

	let record = $state(data.record);
	let boardsArray = $state(data.boards);
	let usersArray = $state(data.users);

	let fileInput = $state() as HTMLInputElement;
	let toBeRemoved = $state([]);

	$effect(() => {
		$inspect(data.record);
		data.metadata.title = data.metadata.headline = `Edit Ticket: ${record.title}`;
	});

	const form = superForm(data.record, {
		SPA: true,
		validators: zodClient(ticketSchema),
		onUpdated: async ({ form: f }) => {
			if (f.valid) {
				const user = client.authStore.isAdmin ? "" : $authModel?.id;
				try {
					await save<TicketsResponse>("tickets", {
						...f.data,
						files: data.record?.files,
						user,
						"files-": toBeRemoved,
					});
					alerts.info("Changes saved.", 5000);
					$formData = f.data;
				} catch (error) {
					alerts.info("Error saving changes.");
				}
			} else {
				alerts.info("Please fix the errors in the form.");
			}
		},
	});

	const { form: formData, enhance } = form;
	const selectedBoard = $derived(
		$formData.board ? getItemById($boardsArray, $formData.board).title : "Select Board"
	)

	const selectedAssignee = $derived(
		$formData.assignee ? getItemById($usersArray, $formData.assignee).name : "Select Assignee"
	)
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<Form.Field {form} name="title">
		<Form.Control>
			<Form.Label>Title</Form.Label>
			<Input bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>The title of the ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="board">
		<Form.Control>
			{#snippet children({ props })}
			<Form.Label>Board</Form.Label>
			<Select.Root bind:value={$formData.board} type="single" name={props.name}>
				<Select.Trigger {...props}>{selectedBoard}</Select.Trigger>
				<Select.Content>
					{#each $boardsArray.items as item}
						<Select.Item value={item.id} label={item.title}></Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>The board to attach this ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="assignee">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Assignee</Form.Label>
				<Select.Root bind:value={$formData.assignee} type="single" name={props.name}>
					<Select.Trigger {...props}>{selectedAssignee}</Select.Trigger>
					<Select.Content>
						{#each $usersArray.items as item}
							<Select.Item label={item.name} value={item.id}></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>The person assigned to the ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="body">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Body</Form.Label>
				<Textarea placeholder="Body" bind:value={$formData.body} />
			{/snippet}
		</Form.Control>
		<Form.Description>A description of the ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="files">
		<Form.Control>
			<Form.Label>Files</Form.Label>
			<input
					type="file"
					multiple
					name="files"
					accept="image/png, image/jpeg"
					on:input={(e) => ($formData.files = Array.from(e.currentTarget.files ?? []))}
			/>
		</Form.Control>
		<Form.Description>Files to upload with the ticket</Form.Description>
		{@const [file] = record.files}
		{@const thumbnail = client.files.getUrl(record, file, { thumb: "100x100" })}
		{#each record.files ?? [] as file, index}
			{@const title = `image ${index + 1} for: ${record.title}`}
			<img src={thumbnail} alt={title} />
			<Button on:click={() => {
						toBeRemoved.push(file);
						record.files = record.files.filter((f) => f !== file);
					}}>
				<Trash2 />
			</Button>
		{/each}
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
