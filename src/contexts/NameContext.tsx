/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const NameContext = createContext({
	tabName: "",
	setTabName: (_tabName: string) => {},
});
