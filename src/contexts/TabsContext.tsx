/* eslint-disable @typescript-eslint/no-unused-vars */
import { TabInfo } from "@/db/db";
import { createContext } from "react";

export const TabsContext = createContext<TabInfo[]>([]);
