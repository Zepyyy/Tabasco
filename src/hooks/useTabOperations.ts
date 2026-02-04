import { useNavigate } from "react-router";
import { useLock } from "@/contexts/LockContext";
import deleteTabById from "@/db/crud/DeleteTab";
import updateTabNameById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import { TabInfo } from "@/types/guitar-tab";
import { useCurrentTab } from "./useCurrentTab";

export const useTabOperations = (tabs: TabInfo[] = []) => {
	const { locked, triggerLockFeedback } = useLock();
	const navigate = useNavigate();
	const { currentTab, position } = useCurrentTab();

	const tabName = currentTab?.tabName || "";

	const handleRename = (newName: string) => {
		if (locked) {
			triggerLockFeedback();
			return;
		}
		if (position && currentTab?.id) {
			updateTabNameById(currentTab.id, newName);
		}
	};

	const handleMove = (currentId: number, currentPosition: string) => {
		const newPosition = Number.parseInt(currentPosition) + 1;
		if (newPosition >= tabs.length) return;

		tabs?.forEach((tab: TabInfo) => {
			// If a tab is present at the position, use this tab's position
			if (tab.position === newPosition.toString()) {
				updateTabPositionById(newPosition.toString(), currentId);
			}
		});
	};

	const handleDelete = async (id?: number, position?: string) => {
		if (position && id) {
			const newPosition = await deleteTabById(id);

			tabs.forEach((tab: TabInfo) => {
				if (
					tab.position !== undefined &&
					position !== undefined &&
					Number.parseInt(tab.position) >= Number.parseInt(position)
				) {
					updateTabPositionById(
						(Number.parseInt(tab.position) - 1).toString(),
						tab.id,
					);
				}
			});

			if (newPosition) {
				navigate(`/sheet/${newPosition}`);
			}
			return;
		}
	};

	return {
		tabName,
		handleRename,
		handleMove,
		handleDelete,
	};
};
