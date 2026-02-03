// db.ts

import Dexie, { type EntityTable } from "dexie";
import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import { TabInfo } from "@/types/guitar-tab";

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

// Schema declaration:
db.version(3).stores({
	TabInfo: "++id, tabName, position, capo", // primary key "id" (for the runtime!)
});

db.on("populate", function () {
	// Init your DB with some default statuses:
	db.TabInfo.add({
		tabName: "Default",
		tabs: Array.from({ length: STRINGS }, () =>
			Array.from({ length: NOTES_PER_SECTION }, () => DEFAULT_NOTE),
		),
		position: "0",
		capo: -1,
	});
});

export { db };
