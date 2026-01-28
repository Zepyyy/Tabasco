import { useContext } from "react";
import { useNavigate } from "react-router";
import { TabsContext } from "@/contexts/TabsContext";
import addTab from "@/db/crud/AddTab";
import deleteTabById from "@/db/crud/DeleteTab";
import { getTabsByPosition } from "@/db/crud/GetTab";
import updateTabNameById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import { TabInfo } from "@/db/db";

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
		const newPosition = Number.parseInt(currentPosition) + 1;
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

	const handleAddTab = () => {
		addTab({} as TabInfo);
	};

	const handleDuplicate = async (props: {
		name: string;
		position: string;
		capo: number;
	}) => {
		const tabs = await getTabsByPosition(props.position);

		addTab({
			tabName: `${props.name} (copy)`,
			tabs: tabs || [],
			capo: props.capo,
		});
	};

	return {
		handleRename,
		handleMove,
		handleDelete,
		handleAddTab,
		handleDuplicate,
	};
};
