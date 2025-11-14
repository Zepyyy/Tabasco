import { LockContext } from "@/contexts/LockContext";
import { useContext } from "react";

export const useLock = () => {
	const { isLocked, setIsLocked, trigger, setTrigger } =
		useContext(LockContext);

	const handleLock = (): void => {
		console.log("ITSLOCKED BRUV");
		setTrigger(true);
		setTimeout(() => {
			setTrigger(false);
		}, 750);
		return;
	};

	return {
		handleLock,
		trigger,
		isLocked,
		setIsLocked,
	};
};
