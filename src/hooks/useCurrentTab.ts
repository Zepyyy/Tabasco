import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import { db } from "@/db/db";

export const useCurrentTab = () => {
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();

	const currentTab = useLiveQuery(async () => {
		if (tabPositionFromParam) {
			return await db.TabInfo.where("position")
				.equals(tabPositionFromParam)
				.first();
		}
		return null;
	}, [tabPositionFromParam]);

	return { currentTab, position: tabPositionFromParam };
};
