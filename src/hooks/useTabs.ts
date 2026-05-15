import { useLiveQuery } from "dexie-react-hooks";
import { getAllTabs } from "@/lib/useTabs";

export const useTabs = () => {
	const tabs = useLiveQuery(() => getAllTabs()) || [];

	return { tabs };
};
