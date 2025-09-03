/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const LockContext = createContext({
	isLocked: JSON.parse(localStorage.getItem("isLocked") ?? "false"),
	setIsLocked: (_isLocked: boolean) => {},
});
