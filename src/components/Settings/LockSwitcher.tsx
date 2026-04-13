import { LockIcon, LockOpen } from "lucide-react";
import { useLock } from "@/contexts/LockContext";

export default function LockSwitcher({ rounded }: { rounded?: boolean }) {
	const { locked, trigger, toggleLock } = useLock();

	return (
		<div
			className={`w-full h-full cursor-pointer flex relative ${rounded ? "rounded-lg p-2" : "rounded-none p-2"} flex items-center justify-center ${
				locked ? "bg-primary text-primary-foreground" : ""
			}`}
		>
			<button
				className={`w-full h-full flex items-center justify-center`}
				onClick={() => toggleLock()}
			>
				<div className="cursor-pointer duration-75 transition-opacity relative">
					<div
						className={`w-6 h-6 flex items-center justify-center ${
							trigger ? "animate-wiggle-once" : ""
						}`}
					>
						<LockIcon
							className={`absolute top-0 left-0 transition-opacity duration-200 ${
								locked ? "opacity-100" : "opacity-0 pointer-events-none"
							}`}
						/>
						<LockOpen
							className={`absolute top-0 left-0 transition-opacity duration-200 ${
								locked ? "opacity-0 pointer-events-none" : "opacity-100"
							}`}
						/>
					</div>
				</div>
			</button>
		</div>
	);
}
