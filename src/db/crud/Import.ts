import "dexie-export-import";
import addTab from "./AddTab";
import { TabInfo } from "../db";

export async function ImportTabs(jsonData: unknown) {
	try {
		// Parse the imported JSON data
		let importedData: TabInfo;

		// Handle different possible structures of the imported data
		if (jsonData) {
			const data = jsonData as Record<string, unknown>;

			if (data.data && typeof data.data === "object" && data.data !== null) {
				const nestedData = data.data as Record<string, unknown>;
				if (
					nestedData.data &&
					Array.isArray(nestedData.data) &&
					nestedData.data[0] &&
					nestedData.data[0].rows
				) {
					// Structure from dexie export
					const tabData = nestedData.data[0].rows as Array<TabInfo>;

					importedData = {
						id: 0,
						tabName: (tabData[0]?.tabName as string) || "Imported Tab",
						tabs:
							(tabData[0]?.tabs as string[][]) ||
							Array(6)
								.fill(null)
								.map(() => Array(48).fill("-")),
					};
				} else {
					throw new Error("Invalid dexie export structure");
				}
			} else if (data.tabName && data.tabs) {
				// Direct TabInfo structure
				importedData = {
					id: 0,
					tabName: data.tabName as string,
					tabs: data.tabs as string[][],
				};
			} else {
				throw new Error("Invalid import data format");
			}
		} else {
			throw new Error("Invalid import data format");
		}

		const position = await addTab(importedData);

		if (!position) {
			console.log(
				"%cDEBUG:%c Import failed %c",
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			return "";
		} else {
			console.log(
				"%cDEBUG:%c Successfully imported tab at position: " + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
		}
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
