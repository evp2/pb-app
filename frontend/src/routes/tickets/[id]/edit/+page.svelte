<script lang="ts">
	import SuperDebug, {
		type Infer,
		type SuperValidated,
		superForm,
	} from "sveltekit-superforms";
	import { alerts } from "$lib/components/Alerts.svelte";
	import { authModel, client, save } from "$lib/pocketbase";
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
	let kanbanBoards = $state(data.boards);
	let usersArray = $state(data.users);


	let fileInput = $state() as HTMLInputElement;
	let toBeRemoved = $state([]);

	$effect(() => {
		$inspect(record);
		data.metadata.title = data.metadata.headline = `Edit Ticket: ${record.title}`;
	});

	const form = superForm(record, {
		SPA: true,
		validators: zodClient(ticketSchema),
		onUpdated: async ({ form: f }) => {
			console.log(record);
			if (f.valid) {
				const user = client.authStore.isAdmin ? "" : $authModel?.id;
				try {
					await save<TicketsResponse>("tickets", {
						...f.data,
						files: record.files,
						user,
						"files-": toBeRemoved,
					});
					alerts.info("Changes saved.", 5000);
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
		record.board ? record.board : "Select Board"
	)
	const selectedAssignee = $derived(
		record.assignee ? record.assignee : "Select Assignee"
	)
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<Form.Field {form} name="title">
		<Form.Control>
			<Form.Description>This is the title of the ticket</Form.Description>
			<Form.Label>Title</Form.Label>
			<Input bind:value={record.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="board">
		<Form.Control>
			{#snippet children({ props })}
			<Form.Label>Board</Form.Label>
			<Select.Root bind:value={record.board} type="single" name={props.name}>
				<Select.Trigger {...props}>{selectedBoard}</Select.Trigger>
				<Select.Content>
					{#each $kanbanBoards.items as item}
						<Select.Item value={item.id} label={item.title}></Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>This is the Kanban board to attach this ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="assignee">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Assignee</Form.Label>
				<Select.Root bind:value={record.assignee} type="single" name={props.name}>
					<Select.Trigger {...props}>{selectedAssignee}</Select.Trigger>
					<Select.Content>
						{#each $usersArray.items as item}
							<Select.Item label={item.name} value={item.name}></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>This is the person assigned to the ticket</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="body">
		<Form.Control>
			<Form.Label>Body</Form.Label>
			<Textarea placeholder="Body" bind:value={record.body} />
		</Form.Control>
		<Form.Description>This is a description of the ticket</Form.Description>
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
					on:input={(e) => (record.files = Array.from(e.currentTarget.files ?? []))}
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
