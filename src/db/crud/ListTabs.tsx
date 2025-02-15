import { db } from "../db";
import { useLiveQuery } from "dexie-react-hooks";

// TODO: Make this work
export default function useTabs() {
	const tabs = useLiveQuery(async () => {
		await db.TabInfo.toArray();
	});

	return tabs;
}
