// db.ts
import Dexie, { type EntityTable } from "dexie";

interface TabInfo {
	id?: number;
	tabName: string;
	tabs: string[][];
	position: string;
	current: boolean;
}

const db = new Dexie("TabInfo") as Dexie & {
	TabInfo: EntityTable<
		TabInfo,
		"id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(2).stores({
	TabInfo: "++id, tabName, tabs, position, current", // primary key "id" (for the runtime!)
});

export type { TabInfo };
export { db };
