// db.ts
import Dexie, { type EntityTable } from "dexie";

interface TabInfo {
	id: number;
	tabName: string;
	tabs: string[][];
	position: string;
}

const db = new Dexie("TabInfo") as Dexie & {
	TabInfo: EntityTable<
		TabInfo,
		"id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(2).stores({
	TabInfo: "++id, tabName, position", // primary key "id" (for the runtime!)
});

db.on("populate", function () {
	// Init your DB with some default statuses:
	db.TabInfo.add({
		tabName: "Default",
		tabs: Array(6)
			.fill(null)
			.map(() => Array(48).fill("-")),
		position: "0",
	});
});

export type { TabInfo };
export { db };
