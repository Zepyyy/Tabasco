import { db } from "../db";

export default async function getTabNameById(id: string) {
	try {
		const tab = await db.TabInfo.where({ position: id }).first();
		if (!tab) {
			console.log(`No tab found at position: ${id}`);
			return "";
		} else {
			console.log(`Got tab: ${id} by ID`);
			console.log(`+ Tab name: ${tab.tabName}`);
		}
		return tab.tabName;
	} catch (error) {
		console.log(`Failed to get tab: ${error}`);
		return "";
	}
}
export async function getTabsById(id: string) {
	try {
		const tab = await db.TabInfo.where({ position: id }).first();
		if (!tab) {
			console.log(`No tab found at position: ${id}`);
			return "";
		} else {
			console.log(`Got tabs.`);
		}
		return tab.tabs;
	} catch (error) {
		console.log(`Failed to get tab: ${error}`);
		return "";
	}
}
