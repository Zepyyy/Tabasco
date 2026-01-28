import { ArrowRight, LockIcon, LockOpen } from "lucide-react";
import { useEffect } from "react";
import { useLock } from "@/hooks/useLock";
import { Button } from "./ui/button";

export default function Lock() {
	const { isLocked, setIsLocked, trigger } = useLock();

	const handleLockSwitch = () => {
		setIsLocked(!isLocked);
	};

	useEffect(() => {
		localStorage.setItem("isLocked", isLocked.toString());
	}, [isLocked]);

	return (
		<div className="flex flex-row rounded-lg justify-center items-center gap-2">
			{trigger && (
				<div className="flex font-serif-text text-2xl rounded-lg p-3 items-center gap-2">
					Unlock to modify <ArrowRight />
				</div>
			)}

			<Button
				variant={isLocked ? "shallow" : "transparent"}
				size={"bigIcon"}
				className="h-12 w-12 p-2 [&_svg]:size-6 cursor-pointer duration-75 transition-opacity active:scale-90"
				onMouseDown={handleLockSwitch}
			>
				<div
					className={`relative w-6 h-6 flex items-center justify-center ${
						trigger ? "animate-wiggle-once" : ""
					}`}
				>
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
