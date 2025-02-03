<script lang="ts">
	import { goto } from "$app/navigation";
	import { client } from "$lib/pocketbase";
	import { alertOnFailure } from "$lib/pocketbase/ui";

	const {
		id,
		table,
		return_path = "back",
	}: { id: string; table: string; return_path?: string } = $props();
	async function back() {
		if (return_path === "back") {
			history.back();
		} else {
			await goto(return_path);
		}
	}
	async function submit(e: SubmitEvent) {
		e.preventDefault();
		alertOnFailure(async () => {
			await client.collection(table).delete(id);
			await back();
		});
	}
</script>

<form onsubmit={submit}>
	<article>
		<aside>Are you sure you want to delete the following record?</aside>
	</article>
	<button
		class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		type="submit">Yes - Proceed</button
	>
	<button
		class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
		type="reset"
		onclick={back}>No - Cancel</button
	>
</form>
