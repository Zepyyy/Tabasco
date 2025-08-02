import { useContext } from "react";
import { TabsContext } from "@/contexts/TabsContext";
import addTab from "@/db/crud/AddTab";
import { updateTabPositionById } from "@/db/crud/UpdateTab";
import deleteTabById from "@/db/crud/DeleteTab";
import { TabInfo } from "@/db/db";
import updateTabNameById from "@/db/crud/UpdateTab";

export const useTabOperations = () => {
	const tabs = useContext(TabsContext);

	const handleRename = (id: number, newName: string) => {
		updateTabNameById(id, newName);
	};

	const handleMove = (currentId: number, currentPosition: string) => {
		console.log(
			"Starting the move function with id: ",
			currentId,
			"at: ",
			currentPosition,
		);
		const newPosition = parseInt(currentPosition) + 1;
		if (newPosition >= tabs.length) {
			console.log("oups, last tab I hope");
			return;
		}

		tabs.forEach((tab: TabInfo) => {
			console.log("tabid: ", tab.id);
			console.log("tabposition :", tab.position);
			// If a tab is present at the position, use this tab's position
			if (tab.position === newPosition.toString()) {
				updateTabPositionById(currentId, newPosition.toString());
			}
		});
	};

	const handleDelete = async (id?: number, position?: string) => {
		if (position && id) {
			await deleteTabById(id);
			tabs.forEach((tab: TabInfo) => {
				if (tab.position >= position) {
					updateTabPositionById(
						tab.id,
						(parseInt(tab.position) - 1).toString(),
					);
				}
			});
		}
	};

	const handleAddTab = () => {
		addTab({});
	};

	return {
		handleRename,
		handleMove,
		handleDelete,
		handleAddTab,
	};
};
