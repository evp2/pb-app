<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import { client, providerLogin } from "../pocketbase";
	import TabGroup from "./TabGroup.svelte";
	import Tab from "./Tab.svelte";
	import TabContent from "./TabContent.svelte";

	const {
		authCollection = "users",
		passwordLogin = true,
		signupAllowed = true,
	} = $props();


	const coll = client.collection(authCollection);

	const form = $state({
		email: "",
		name: "",
		password: "",
		passwordConfirm: "",
		admin: false,
	});
	let signup = false;

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (signup) {
			await coll.create({ ...form });
		}
		// signin
		if (form.admin) {
			await client.admins.authWithPassword(form.email, form.password);
		} else {
			await coll.authWithPassword(form.email, form.password);
		}
	}
	let active = $state("SignIn");
</script>

{#snippet signin()}
	<div class="flex justify-between">
		<Input bind:value={form.email} class="mt-2" required type="text" placeholder="email" />
		<Input bind:value={form.password} class="mt-2" required type="password" placeholder="password" />
		<div class="grid justify-items-end mt-2">
			<Label for="admin">
				<Checkbox id="admin" bind:checked={form.admin} />Admin
			</Label>
		</div>
		<Button type="submit" class="mt-2" onclick={() => (signup = false)}>Sign In</Button>
	</div>
{/snippet}

<form onsubmit={submit} class="p-3">
	{#if passwordLogin}
		{#if signupAllowed}
			<TabGroup bind:active>
				{#snippet tabs()}
					<Tab key="SignIn">Sign In</Tab>
					<Tab key="SignUp">Sign Up</Tab>
				{/snippet}
				<TabContent key="SignIn">
					{@render signin()}
				</TabContent>
				<TabContent key="SignUp">
					<input
						bind:value={form.email}
						required
						type="text"
						placeholder="email"
					/>
					<input
						bind:value={form.password}
						required
						type="password"
						placeholder="password"
					/>
					<input
						bind:value={form.passwordConfirm}
						required
						type="password"
						placeholder="confirm password"
					/>
					<input
						bind:value={form.name}
						required
						type="text"
						placeholder="name / label"
					/>
					<input type="hidden" name="register" value={true} />
					<button type="submit" onclick={() => (signup = true)}>Sign Up</button>
				</TabContent>
			</TabGroup>
		{:else}
			<h2>Sign In</h2>
			{@render signin()}
		{/if}
	{/if}
	{#await coll.listAuthMethods({ $autoCancel: false }) then methods}
		{#each methods.authProviders as p}
			<br />
			<div class="flex justify-between">
				<Button type="submit" onclick={() => providerLogin(p, coll)}>
					Sign-in with {p.name.substring(0, 1).toUpperCase() + p.name.substring(1)}
				</Button>
			</div>
		{/each}
	{:catch}
		<!-- pocketbase not working -->
	{/await}
</form>
