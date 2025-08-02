import { useContext } from "react";
import { TabsContext } from "@/contexts/TabsContext";
import addTab from "@/db/crud/AddTab";
import { updateTabPositionById } from "@/db/crud/UpdateTab";
import deleteTabById from "@/db/crud/DeleteTab";
import { TabInfo } from "@/db/db";
import updateTabNameById from "@/db/crud/UpdateTab";
import { useNavigate } from "react-router";

export const useTabOperations = () => {
	const tabs = useContext(TabsContext);
	const navigate = useNavigate();

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
					parseInt(tab.position) >= parseInt(position)
				) {
					updateTabPositionById(
						(parseInt(tab.position) - 1).toString(),
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

	const handleAddTab = () => {
		addTab({} as TabInfo);
	};

	return {
		handleRename,
		handleMove,
		handleDelete,
		handleAddTab,
	};
};
