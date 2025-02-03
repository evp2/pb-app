import { client, watch } from "$lib/pocketbase";
import type { BoardsResponse } from "$lib/pocketbase/generated-types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, fetch }) => {
	const filter = client.filter("user != ''", {});
	const expand = "user";
	const queryParams = {
		// filter,
		expand,
		fetch,
	};
	const boards = await watch<BoardsResponse<any>>("boards", queryParams);
	const { metadata } = await parent();
	// you could set the title/headline either here or in +page.svelte
	metadata.title = "Boards";
	return {
		metadata,
		boards,
	};
};
