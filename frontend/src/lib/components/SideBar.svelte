<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { House, Tag, SquareKanban, ScrollText } from "lucide-svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { authModel, client } from "../pocketbase";
    import Alerts, { alerts } from "./Alerts.svelte";
    import { onDestroy } from "svelte";
    import { User } from 'lucide-svelte';
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";

    const sidebar = useSidebar();
    const items = [
        {
            title: "Home",
            url: "/",
            icon: House,
        },
        {
            title: "Tickets",
            url: "/tickets/",
            icon: Tag,
        },
        {
            title: "Projects",
            url: "/boards/",
            icon: SquareKanban,
        },
    ]

    async function logout() {
        client.authStore.clear();
    }
    const unsubscribe = client.authStore.onChange((token, model) => {
        if (model) {
            const { name, username } = model;
            alerts.success(`Signed in as ${name || username || "Admin"}`, 5000);
        } else {
            alerts.success(`Signed out`, 5000);
        }
    }, false);
    onDestroy(() => {
        unsubscribe();
    });

</script>

<Sidebar.Root collapsible="icon">
    <Sidebar.Content>
        <Sidebar.Group>
            <Sidebar.Header>
                <a href={`${base}/`} class="logo">
                    <img src={`${base}/favicon.png`} alt="application logo" />
                </a>
            </Sidebar.Header>
            <Sidebar.GroupContent>
                    <Sidebar.Menu>
                        {#each items as item}
                            <Sidebar.MenuItem>
                                <Sidebar.MenuButton isActive={$page.url.pathname === item.url}>
                                    {#snippet child({ props })}
                                        <a href={item.url} {...props}>
                                            <item.icon />
                                            <span class="menu-item">{item.title}</span>
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
        <Sidebar.Menu>
            <Sidebar.MenuItem>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Sidebar.MenuButton
                                    {...props}
                                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                {#if $authModel && sidebar.open}
                                    <samp>
                                        {$authModel?.name || $authModel?.username || $authModel?.email}
                                    </samp>
                                {:else}
                                    {#if sidebar.open}
                                        <samp>Sign in</samp>
                                    {:else}
                                        <button onclick={() => sidebar.toggle()}>
                                            <a><User /></a>
                                        </button>
                                    {/if}
                                {/if}
                            </Sidebar.MenuButton>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content
                            side="top"
                            class="w-[--bits-dropdown-menu-anchor-width]"
                    >
                        <DropdownMenu.Item>
                            <button onclick={() => sidebar.toggle()}>Toggle Sidebar</button>
                        </DropdownMenu.Item>
                        {#if $authModel}
                            <DropdownMenu.Item>
                                <span>User</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item onclick={logout}>
                                <span>Sign out</span>
                            </DropdownMenu.Item>
                        {:else}
                            <DropdownMenu.Item>
                                <span>Sign in</span>
                            </DropdownMenu.Item>
                        {/if}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Sidebar.MenuItem>
        </Sidebar.Menu>
    </Sidebar.Footer>
</Sidebar.Root>
<style>
    a {
        flex-direction: row;
    }
    .logo {
        width: 1.25rem;
        height: 1.25rem;
    }
    .menu-item {
        font-size: 18px;
    }
</style>