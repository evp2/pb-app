<script lang="ts">
	import type { Snippet } from "svelte";
	import { Input } from "$lib/components/ui/input/index.js";

	let {
		fileInput = $bindable<HTMLInputElement>(),
		pasteFile = false, // this component captures the paste event and data
		children = _children,
		...props // any other props or attributes will be passed to the file input
	}: {
		fileInput?: HTMLInputElement;
		pasteFile?: boolean;
		children?: Snippet<[]>;
		[key: string]: any;
	} = $props();
	function onpaste(e: ClipboardEvent) {
		if (pasteFile && e.clipboardData?.files) {
			fileInput.files = e.clipboardData.files;
		}
	}
	$effect(() => {
		console.log(fileInput);
		// listen for changes to the file input files
		if (fileInput) {
			fileInput.addEventListener("change", () => (files = fileInput.files));
		}
	});
	let files: FileList | null = $state(null);
</script>

{#snippet _children()}
	<div class="files">
		{#each files || [] as file}
			<span>{file.name}</span>
		{:else}
			drag/drop files here
		{/each}
	</div>
{/snippet}

<!-- When someone pastes a file anywhere on body, send it to this component -->
<svelte:body {onpaste} />

<label class="file">
	{@render children()}
	<input bind:value={fileInput} type="file" />
</label>

<style lang="scss">
	label {
		cursor: pointer;
		border: dashed 2px gray;
		padding: 1em;
		position: relative;
		display: flex;
		justify-content: center;
	}
	.files > span {
		display: inline-block;
		margin-right: 0.5em;
		margin-bottom: 0.25em;
		padding: 0 0.5em;
		border: dotted 1px;
	}
</style>
