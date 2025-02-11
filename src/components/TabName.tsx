import { useContext } from "react";
import { Input } from "@/components/ui/input";
import { NameContext } from "@/contexts/NameContext";

export default function TabName() {
	const { tabName, setTabName } = useContext(NameContext);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTabName(e.target.value);
		localStorage.setItem("tabName", e.target.value);
		console.log(tabName);
	};
	return (
		<Input
			type="text"
			value={tabName}
			onChange={(e) => handleInputChange(e)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-normal mt-12 mb-4 border-none shadow-none focus-visible:ring-0 md:text-4xl py-0 h-fit w-full text-4xl font-serifTitle antialiased"
		/>
	);
}
