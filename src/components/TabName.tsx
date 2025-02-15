import { useContext } from "react";
import { Input } from "@/components/ui/input";
import { NameContext } from "@/contexts/NameContext";

export default function TabName() {
	const { tabName, setTabName } = useContext(NameContext);

	return (
		<Input
			type="text"
			value={tabName}
			onChange={(e) => setTabName(e.target.value)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-normal mt-12 mb-4 border-none shadow-none focus-visible:ring-0 md:text-4xl py-0 h-fit w-full text-4xl font-serifText antialiased"
		/>
	);
}
