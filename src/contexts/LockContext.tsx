/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const LockContext = createContext({
	isLocked: true,
	setIsLocked: (_isLocked: boolean) => {},
});
