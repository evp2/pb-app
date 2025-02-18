import type { LayoutLoad } from "./$types";
import { client } from "$lib/pocketbase";
import { alerts } from "$lib/components/Alerts.svelte";

export const ssr = false;
export const prerender = false;
export const trailingSlash = "always";

export const load: LayoutLoad = async ({ fetch }) => {
	type Metadata = {
		title: string;
		headline?: string;
	};
	let config: {
		site: {
			name: string;
			copyright: string;
			year: number;
		};
		signupAllowed: boolean;
	} = {} as any;
	const title = "Personal Backlog App";
	const metadata: Metadata = {
		title,
	};

	try {
		const response = await fetch(client.baseUrl + "/_/");
		if (response.redirected) {
			alerts.add({
				message:
					'Please visit <a href="/_/">/_</a> to finalize installation of PocketBase',
				type: "error",
				html: true,
			});
		}

		config = await client.send("/api/config", { fetch, requestKey: "config" });
	} catch (e: any) {
		if (e.status === 404) {
			alerts.add({
				message:
					'Not found: Please finalize installation of backend',
				type: "error",
				html: true,
			});
		} else {
			alerts.error(e.toString());
		}
	}
	return {
		config,
		metadata,
	};
};
