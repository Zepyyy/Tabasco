import { db } from "../db";

export default async function getTabNameByPosition(position: string) {
	try {
		const tab = await db.TabInfo.where({ position: position }).first();
		if (!tab) {
			console.log(
				"%cDEBUG:%c No tab found at id: %c" + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			return "";
		} else {
			console.log(
				"%cDEBUG:%c Got tab at id: %c" + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			console.log(
				"%cDEBUG:%c Tab name: %c" + tab.tabName,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22dce6;",
			);
		}

		return tab.tabName;
	} catch (error) {
		console.log(
			"%cDEBUG:%c Failed to get tab Error: ",
			"background: #2c3e50; color: white; padding: 2px 5px;",
			"background: inherit; color: white;",
			"color: #22dce6;",
			error,
		);
		return "";
	}
}
export async function getTabsByPosition(position: string) {
	try {
		const tab = await db.TabInfo.where({ position: position }).first();
		console.log(tab);
		if (!tab) {
			console.log(
				"%cDEBUG:%c No tab found at id: %c" + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			return "";
		} else {
			console.log(
				"%cDEBUG:%c Got tabs.",
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
			);
		}
		return tab.tabs;
	} catch (error) {
		console.log(
			"%cDEBUG:%c Failed to get tab Error: ",
			"background: #2c3e50; color: white; padding: 2px 5px;",
			"background: inherit; color: white;",
			"color: #22dce6;",
			error,
		);
		return "";
	}
}
