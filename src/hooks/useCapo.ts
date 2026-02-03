import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router";
import { MAX_FRET } from "@/constants/guitar-tab";
import { useLock } from "@/contexts/LockContext";
import { updateTabCapoByPosition } from "@/db/crud/UpdateTab";
import { db } from "@/db/db";

export const useCapo = () => {
	const { locked, triggerLockFeedback } = useLock();
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();

	// Use useLiveQuery to reactively get the current tab
	const currentTab = useLiveQuery(async () => {
		if (tabPositionFromParam) {
			return await db.TabInfo.where("position")
				.equals(tabPositionFromParam)
				.first();
		}
		return null;
	}, [tabPositionFromParam]);

	const capo = currentTab?.capo || "";

	const HandleSetCapos = (capo: number) => {
		if (locked) {
			triggerLockFeedback();
			return;
		}
		if (tabPositionFromParam && capo && capo >= -1 && capo <= MAX_FRET) {
			updateTabCapoByPosition(tabPositionFromParam, capo);
		}
	};

	return { capo, HandleSetCapos };
};
