import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTabOperations } from "@/hooks/useTabOperations";

export default function TabName() {
	const { tabName, handleRename } = useTabOperations();
	const [localValue, setLocalValue] = useState(tabName);

	// Sync local value with external changes (e.g., switching tabs)
	useEffect(() => {
		setLocalValue(tabName);
	}, [tabName]);

	// Debounce database updates - wait 500ms after typing stops
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (localValue !== tabName) {
				handleRename(localValue);
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [localValue, tabName, handleRename]);

	return (
		<Input
			type="text"
			value={localValue}
			onChange={(e) => setLocalValue(e.target.value)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-semibold mb-4 border-none shadow-none focus-visible:ring-0 text-xl sm:text-4xl md:text-6xl py-0 h-fit w-full font-serif-title antialiased"
		/>
	);
}
