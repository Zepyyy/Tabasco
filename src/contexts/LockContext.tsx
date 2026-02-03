import { createContext, useContext } from "react";
import { LockContextType } from "@/types/guitar-tab";

export const LockContext = createContext<LockContextType | undefined>(
	undefined,
);

export function useLock() {
	const context = useContext(LockContext);
	if (!context) throw new Error("useLock must be used within LockProvider");
	return context;
}
