// db.ts
import { DEFAULT_NOTE, NOTES_PER_SECTION, STRINGS } from "@/types/guitar-tab";
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
		tabs: Array(STRINGS)
			.fill(null)
			.map(() => Array(NOTES_PER_SECTION).fill(DEFAULT_NOTE)),
		position: "0",
	});
});

export type { TabInfo };
export { db };
