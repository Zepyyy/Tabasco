import { useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { NameContext } from "@/contexts/NameContext";
import { updateTabNameByPosition } from "@/db/crud/UpdateTab";
import { useParams } from "react-router";
import getTabNameById from "@/db/crud/GetTab";

export default function TabName() {
	const { tabName, setTabName } = useContext(NameContext);
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();
	function HandleSetTabName(tabName: string) {
		if (tabPositionFromParam) {
			updateTabNameByPosition(tabPositionFromParam, tabName);
		}
		setTabName(tabName);
	}

	useEffect(() => {
		if (tabPositionFromParam) {
			getTabNameById(tabPositionFromParam).then((tabName) => {
				setTabName(tabName);
			});
		}
	}, [setTabName, tabPositionFromParam]);

	return (
		<Input
			type="text"
			value={tabName}
			onChange={(e) => HandleSetTabName(e.target.value)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-semibold mb-4 border-none shadow-none focus-visible:ring-0 text-xl sm:text-4xl md:text-6xl py-0 h-fit w-full font-serif-title antialiased"
		/>
	);
}
