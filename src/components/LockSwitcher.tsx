import { ArrowRight, LockIcon, LockOpen } from "lucide-react";
import { useLock } from "@/contexts/LockContext";

// Lock.tsx
export default function LockSwitcher({ rounded }: { rounded?: boolean }) {
	const { locked, trigger, toggleLock, showText } = useLock();

	return (
		<div
			className={`w-full h-full cursor-pointer flex z-50 relative ${rounded ? "rounded-lg p-2" : "rounded-none p-2"} flex items-center justify-center ${
				locked
					? "bg-primary text-primary-foreground"
					: "bg-background text-foreground"
			}`}
		>
			<div className={`relative flex items-center gap-2 whitespace-nowrap `}>
				<div
					className={`absolute right-2 flex items-center gap-1 font-bold text-foreground whitespace-nowrap transition-opacity duration-200 ${showText ? "opacity-100" : "opacity-0 pointer-events-none"}`}
				>
					Unlock to modify
					<ArrowRight size={18} strokeWidth={2.5} />
				</div>
			</div>
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
