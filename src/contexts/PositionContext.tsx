/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const PositionContext = createContext({
	position: "",
	setPosition: (_position: string) => {},
});
