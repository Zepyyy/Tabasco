import { createContext } from "react";
import { TabInfo } from "@/db/db";

export const TabsContext = createContext<TabInfo[]>([]);
