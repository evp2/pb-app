<script lang="ts">
	import type { PageStore } from ".";
	import { Button } from "$lib/components/ui/button/index.js";

	const {
		store,
		showIfSinglePage = false,
	}: {
		store: PageStore;
		showIfSinglePage?: boolean;
	} = $props();
</script>

{#if showIfSinglePage || $store.totalPages > 1}
	<div class="paginator">
		<Button
			type="button"
			onclick={() => store.prev()}
			disabled={$store.page <= 1}>&laquo;
		</Button>
		<div>page {$store.page} of {$store.totalPages}</div>
		<Button
			type="button"
			onclick={() => store.next()}
			disabled={$store.page >= $store.totalPages}>&raquo;
		</Button>
	</div>
{/if}

<style>
	.paginator {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: auto;
	}
</style>
