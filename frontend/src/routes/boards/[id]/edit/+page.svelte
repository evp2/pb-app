<script lang="ts">
	import SuperDebug, {
		type Infer,
		type SuperValidated,
		superForm,
	} from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { browser } from "$app/environment";
	import { alerts } from "$lib/components/Alerts.svelte";
	import { authModel, client, save } from "$lib/pocketbase";
	import type { BoardsResponse } from "$lib/pocketbase/generated-types.js";
	import { boardSchema, type BoardSchema } from "$lib/schema";
	import * as Form from "$lib/components/ui/form/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import {base} from "$app/paths";

	let { data }: { data: SuperValidated<Infer<BoardSchema>> } = $props();

	$effect(() => {
		data.metadata.title =
			data.metadata.headline = `Edit board: ${data.record.title}`;
	});

	const form = superForm(data.record, {
		SPA: true,
		validators: zodClient(boardSchema),
		onUpdated: async ({ form: f }) => {
			if (f.valid) {
				const user = client.authStore.isAdmin ? "" : $authModel?.id;
				try {
					await save<BoardsResponse>("boards", {
						...f.data,
						user,
					});
					alerts.info("Changes saved.", 5000);
					window.location.href = `${base}/boards`;
				} catch (error) {
					alerts.info("Error saving changes.");
				}
			} else {
				alerts.info("Please fix the errors in the form.");
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="title">
		<Form.Control>
			<Form.Label>Title</Form.Label>
			<Input bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>This is the title of the board.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="slug">
		<Form.Control>
			<Form.Label>Slug</Form.Label>
			<Input bind:value={$formData.slug} />
		</Form.Control>
		<Form.Description
			>This is the URL slug to access this board.</Form.Description
		>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="public">
		<Form.Control>
			<Form.Label>Public</Form.Label>
			<Switch bind:checked={$formData.public} />
		</Form.Control>
		<Form.Description>Controls who can view this board.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
