import { useCallback, useEffect, useRef, useState } from "react";
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
	const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

	const triggerLockFeedback = useCallback(() => {
		// Clear existing timeouts to prevent multiple overlapping animations
		timeoutRefs.current.forEach(clearTimeout);
		timeoutRefs.current = [];

		setTrigger(true);
		setShowText(true);

		// Store timeout IDs for cleanup
		timeoutRefs.current.push(
			setTimeout(() => setTrigger(false), 750),
			setTimeout(() => setShowText(false), 1500),
		);
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			timeoutRefs.current.forEach(clearTimeout);
		};
	}, []);

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
