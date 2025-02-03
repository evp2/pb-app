import { client, watch } from "$lib/pocketbase";
import type { TicketsResponse } from "$lib/pocketbase/generated-types";
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
	const tickets = await watch<TicketsResponse<any>>("tickets", queryParams);
	const boards = await watch<BoardsResponse<any>>("boards", queryParams);
	const { metadata } = await parent();

	return {
		metadata,
		tickets,
		boards,
	};
};
