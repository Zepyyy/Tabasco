/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const CapoContext = createContext({
	capo: -1,
	setCapo: (_capo: number) => {},
});
