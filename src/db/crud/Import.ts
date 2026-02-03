import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import { TabInfo } from "@/types/guitar-tab";
import addTab from "./AddTab";

export async function ImportTabs(tabData: Partial<TabInfo>) {
	try {
		// Parse the imported JSON data
		const importedData = {
			tabName: (tabData.tabName as string) || "Imported Tab",
			tabs:
				(tabData.tabs as string[][]) ||
				Array(STRINGS)
					.fill(null)
					.map(() => Array(NOTES_PER_SECTION).fill(DEFAULT_NOTE)),
			capo: (tabData.capo as number) || -1,
		};

		const position = await addTab(importedData as Partial<TabInfo>);
		if (!position) {
			throw new Error("Failed to import tab.");
		}
		return position;
	} catch (error) {
		throw new Error("Failed to import tab. Error: " + error);
	}
}
