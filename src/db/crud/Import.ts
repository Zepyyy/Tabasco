import addTab from "./AddTab";
import { TabInfo } from "../db";

export async function ImportTabs(tabData: Partial<TabInfo>) {
	try {
		// Parse the imported JSON data
		const importedData = {
			tabName: (tabData.tabName as string) || "Imported Tab",
			tabs:
				(tabData.tabs as string[][]) ||
				Array(6)
					.fill(null)
					.map(() => Array(48).fill("-")),
		};

		const position = await addTab(importedData as Partial<TabInfo>);

		if (!position) {
			const errorMsg = "Import failed - no position returned";
			console.log(
				"%cDEBUG:%c " + errorMsg,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			throw new Error(errorMsg);
		}

		console.log(
			"%cDEBUG:%c Successfully imported tab at position: " + position,
			"background: #2c3e50; color: white; padding: 2px 5px;",
			"background: inherit; color: white;",
			"color: #22e66a;",
		);
		return position;
	} catch (error) {
		console.log(
			"%cDEBUG:%c Failed to import tab Error: ",
			"background: #2c3e50; color: white; padding: 2px 5px;",
			"background: inherit; color: white;",
			"color: #22dce6;",
			error,
		);
		throw error;
	}
}
