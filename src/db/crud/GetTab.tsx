import { db } from "../db";

export default async function getTabNameById(id: string) {
	console.log("get anem by id: ", id);
	try {
		const tab = await db.TabInfo.where({ position: id }).first();
		if (!tab) {
			console.log(`No tab found at position: ${id}`);
			return "";
		}
		return tab.tabName;
	} catch (error) {
		console.log(`Failed to get tab: ${error}`);
		return "";
	}
}
