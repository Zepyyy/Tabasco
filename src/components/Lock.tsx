import { LockIcon, LockOpen } from "lucide-react";
import { Button } from "./ui/button";
import { LockContext } from "@/contexts/LockContext";
import { useContext, useEffect } from "react";

export default function Lock() {
	const { isLocked, setIsLocked } = useContext(LockContext);

	const handleLock = () => {
		setIsLocked(!isLocked);
	};

	useEffect(() => {
		localStorage.setItem("isLocked", isLocked.toString());
	}, [isLocked]);

	return (
		<div className="flex flex-col rounded-lg justify-center">
			<Button
				variant={isLocked ? "shallow" : "transparent"}
				size={"bigIcon"}
				className="p-2 [&_svg]:size-6 cursor-pointer duration-75 transition-opacity active:scale-90"
				onMouseDown={handleLock}
			>
				<div className="relative w-6 h-6 flex items-center justify-center">
					<LockIcon
						className={`absolute left-0 top-0 transition-opacity duration-200 ${
							isLocked ? "opacity-100" : "opacity-0 pointer-events-none"
						}`}
					/>
					<LockOpen
						className={`absolute left-0 top-0 transition-opacity duration-200 ${
							isLocked ? "opacity-90 pointer-events-none" : "opacity-100"
						}`}
					/>
				</div>
			</Button>
		</div>
	);
}
