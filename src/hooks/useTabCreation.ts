import addTab from "@/db/crud/AddTab";
import { getTabsByPosition } from "@/db/crud/GetTab";
import { TabInfo } from "@/types/guitar-tab";

export const useTabCreation = () => {
	const handleAddTab = () => addTab({} as TabInfo);

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

	return { handleAddTab, handleDuplicate };
};
