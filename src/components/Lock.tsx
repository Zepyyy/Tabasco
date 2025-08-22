import { LockIcon, LockOpen } from "lucide-react";
import { Button } from "./ui/button";
import { LockContext } from "@/contexts/LockContext";
import { useContext } from "react";

export default function Lock() {
	const { isLocked, setIsLocked } = useContext(LockContext);
	return (
		<div className="flex flex-col rounded-lg justify-center">
			<Button
				variant={isLocked ? "shallow" : "transparent"}
				size={"icon-resize"}
				className="text-xl font-medium [&_svg]:size-6 p-2 aspect-square"
				onClick={() => setIsLocked(!isLocked)}
			>
				{isLocked ? <LockIcon /> : <LockOpen />}
			</Button>
		</div>
	);
}
