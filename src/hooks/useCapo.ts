import { MAX_FRET } from "@/constants/guitar-tab";
import { useLock } from "@/contexts/LockContext";
import { updateTabCapoByPosition } from "@/db/crud/UpdateTab";
import { useCurrentTab } from "./useCurrentTab";

export const useCapo = () => {
	const { locked, triggerLockFeedback } = useLock();
	const { currentTab, position } = useCurrentTab();

	const capo = currentTab?.capo ?? -1;

	const HandleSetCapos = (capo: number) => {
		if (locked) {
			triggerLockFeedback();
			return;
		}
		if (position && capo >= -1 && capo <= MAX_FRET) {
			updateTabCapoByPosition(position, capo);
		}
	};

	return { capo, HandleSetCapos };
};
