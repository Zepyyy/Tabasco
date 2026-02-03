import { useState } from "react";
import { LockContext } from "@/contexts/LockContext";

export default function LockProvider({
	children,
	locked,
	toggleLock,
}: {
	children: React.ReactNode;
	locked: boolean;
	toggleLock: () => void;
}) {
	const [trigger, setTrigger] = useState(false);
	const [showText, setShowText] = useState(false);

	const triggerLockFeedback = () => {
		console.log("ITSLOCKED BRUV");
		setTrigger(true);
		setShowText(true);
		setTimeout(() => setTrigger(false), 750);
		setTimeout(() => setShowText(false), 1500);
	};

	return (
		<LockContext.Provider
			value={{
				locked,
				toggleLock,
				triggerLockFeedback,
				trigger,
				showText,
			}}
		>
			{children}
		</LockContext.Provider>
	);
}
