import { useContext } from "react";
import { TabsContext } from "@/contexts/TabsContext";
import addTab from "@/db/crud/AddTab";
import UpdateTabById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import deleteTabById from "@/db/crud/DeleteTab";
import { TabInfo } from "@/db/db";

export const useTabOperations = () => {
	const tabs = useContext(TabsContext);

	const handleRename = (newName: string) => {
		UpdateTabById(tabs[0]?.position || "0", newName);
	};

	const handleMove = (oldPosition: string) => {
		const newPosition = parseInt(oldPosition) + 1;
		if (newPosition >= tabs.length) return;

		tabs.forEach((tab: TabInfo) => {
			if (tab.position === oldPosition) {
				updateTabPositionById(oldPosition, newPosition.toString());
			}
		});
	};

	const handleDelete = (position: string) => {
		deleteTabById(position);
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
