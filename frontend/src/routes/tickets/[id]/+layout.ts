import { client, watch } from "$lib/pocketbase";
import type {
	BoardsResponse,
	TicketsRecord,
	TicketsResponse,
	UsersResponse,
} from "$lib/pocketbase/generated-types";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
	const { id } = params;
	const filter = client.filter("id = {:id}", { id });
	const tickets = client.collection("tickets");
	const options = { fetch };
	let record: TicketsRecord = {
		title: "",
		body: "",
		user: "",
		assignee: "",
		board: "",
		files: [],
	};
	const boards = await watch<BoardsResponse<any>>("boards", options);
	const users = await watch<UsersResponse<any>>("users", options);
	if (id !== "new") {
		// load record if existing
		record = await tickets.getFirstListItem<TicketsResponse>(filter, options);
	}
	return {
		record: record as TicketsResponse,
		boards,
		users,
	};
};
