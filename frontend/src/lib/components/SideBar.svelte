<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { House, Tag, SquareKanban, ScrollText } from "lucide-svelte";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { useSidebar } from "$lib/components/ui/sidebar/index.js";

    let sidebar = useSidebar();

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
            title: "Boards",
            url: "/boards/",
            icon: SquareKanban,
        },
    ]
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
                                            <span>{item.title}</span>
                                        </a>
                                    {/snippet}
                                </Sidebar.MenuButton>
                            </Sidebar.MenuItem>
                        {/each}
                    </Sidebar.Menu>
                </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>
</Sidebar.Root>
<style>
    a {
        flex-direction: row;
    }
    .logo {
        width: 1.25rem;
        height: 1.25rem;
    }
</style>