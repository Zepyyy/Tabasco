import { Input } from "@/components/ui/input";
import { useTabOperations } from "@/hooks/useTabOperations";

export default function TabName() {
	const { tabName, handleRename } = useTabOperations();

	return (
		<Input
			type="text"
			value={tabName}
			onChange={(e) => handleRename(e.target.value)}
			maxLength={60}
			placeholder="Enter tab name"
			className="font-semibold mb-4 border-none shadow-none focus-visible:ring-0 text-xl sm:text-4xl md:text-6xl py-0 h-fit w-full font-serif-title antialiased"
		/>
	);
}
