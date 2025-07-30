import { useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { NameContext } from "@/contexts/NameContext";
import updateTabNameById from "@/db/crud/UpdateTab";
import { useParams } from "react-router";
import getTabNameById from "@/db/crud/GetTab";

export default function TabName() {
	const { tabName, setTabName } = useContext(NameContext);
	const { tabId } = useParams<{ tabId: string }>();
	function HandleSetTabName(tabName: string) {
		if (tabId) {
			updateTabNameById(tabId, tabName);
		}
		setTabName(tabName);
	}

	useEffect(() => {
		if (tabId) {
			getTabNameById(tabId).then((tabName) => {
				if (tabName) {
					setTabName(tabName);
				}
			});
		}
	}, [setTabName, tabId]);

	return (
		<Input
			type="text"
			value={tabName}
			onChange={(e) => HandleSetTabName(e.target.value)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-normal mb-4 border-none shadow-none focus-visible:ring-0 text-xl sm:text-2xl md:text-4xl py-0 h-fit w-full font-serif-title antialiased"
		/>
	);
}
