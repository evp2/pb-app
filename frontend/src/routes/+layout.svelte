<script lang="ts">
	import "../app.css";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import Alerts from "$lib/components/Alerts.svelte";
	import LoginBadge from "$lib/components/LoginBadge.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/SideBar.svelte";
	import { Badge } from "$lib/components/ui/badge/index.js";

	const { data, children } = $props();
	const metadata = $derived(data.metadata ?? {});
	const config = $derived(data.config ?? {});

	$effect(() => {
		if ($page.error) {
			metadata.title = $page.error.message;
		}
	});
</script>

<svelte:head>
	<title>{metadata.title} | {config.site?.name}</title>
</svelte:head>

<Sidebar.Provider>
	<header class="container">
		<h2 class="title"><Sidebar.Trigger />{metadata.headline ?? metadata.title}</h2>
		<LoginBadge signupAllowed={config.signupAllowed} />
	</header>
	<main class="container pb-5">
		<Alerts />
		{@render children()}
	</main>
	<footer class="container pt-5" style="border-block-start: dashed 1px;">
		<Badge variant="outline">&copy; <a href="https://github.com/evp2/pb-app">{new Date().getFullYear()}</a></Badge>
	</footer>
	<AppSidebar />
</Sidebar.Provider>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	main {
		flex-grow: 1;
	}
	.container {
		max-width: 800px;
		margin: 0 auto;
	}
	.title {
		font-size: 20px;
	}
</style>
