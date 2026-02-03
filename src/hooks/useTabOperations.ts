import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate, useParams } from "react-router";
import { useLock } from "@/contexts/LockContext";
import deleteTabById from "@/db/crud/DeleteTab";
import updateTabNameById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import { db } from "@/db/db";
import { TabInfo } from "@/types/guitar-tab";

export const useTabOperations = (tabs: TabInfo[] = []) => {
	const { locked, triggerLockFeedback } = useLock();
	const navigate = useNavigate();
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

	const tabName = currentTab?.tabName || "";

	const handleRename = (newName: string) => {
		if (locked) {
			triggerLockFeedback();
			return;
		}
		if (tabPositionFromParam && currentTab?.id) {
			updateTabNameById(currentTab.id, newName);
		}
	};

	const handleMove = (currentId: number, currentPosition: string) => {
		console.log(
			"Starting the move function with id: ",
			currentId,
			"at: ",
			currentPosition,
		);
		const newPosition = Number.parseInt(currentPosition) + 1;
		if (newPosition >= tabs.length) {
			console.log("oups, last tab I hope");
			return;
		}

		tabs?.forEach((tab: TabInfo) => {
			console.log("tabid: ", tab.id);
			console.log("tabposition :", tab.position);
			// If a tab is present at the position, use this tab's position
			if (tab.position === newPosition.toString()) {
				updateTabPositionById(newPosition.toString(), currentId);
			}
		});
	};

	const handleDelete = async (id?: number, position?: string) => {
		if (position && id) {
			const newPosition = await deleteTabById(id);

			console.log("Delete operation returned position:", newPosition);

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
				console.log("Navigating to position:", newPosition);
				navigate(`/sheet/${newPosition}`);
			} else {
				console.log("No valid position returned, staying on current page");
			}
		}
	};

	return {
		tabName,
		handleRename,
		handleMove,
		handleDelete,
	};
};
