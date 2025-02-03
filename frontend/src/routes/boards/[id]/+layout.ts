import { client } from "$lib/pocketbase";
import type {
	BoardsRecord,
	BoardsResponse,
} from "$lib/pocketbase/generated-types";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params, fetch }) => {
	const { id } = params;
	const filter = client.filter("id = {:id}", { id });
	const coll = client.collection("boards");
	const options = { fetch };
	let record: BoardsRecord = {
		title: "",
		slug: "",
		public: false,
		user: "",
	};
	if (id !== "new") {
		// load record if existing
		record = await coll.getFirstListItem<BoardsResponse>(filter, options);
	}
	return {
		record: record as BoardsResponse,
	};
};
