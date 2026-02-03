import { db } from "../db";

export default async function getTabNameByPosition(position: string) {
	try {
		const tab = await db.TabInfo.where({ position: position }).first();
		if (!tab) {
			return "";
		}
		return tab.tabName;
	} catch (error) {
		throw new Error(
			"Failed to get tab name at position: " + position + " Error: " + error,
		);
	}
}

export async function getCapoByPosition(position: string) {
	try {
		const tabs = await db.TabInfo.where({ position: position }).first();
		if (!tabs) {
			return -1;
		} else {
			return tabs.capo;
		}
	} catch (error) {
		throw new Error(
			"Failed to get capo at position: " + position + " Error: " + error,
		);
	}
}

export async function getTabsByPosition(position: string) {
	try {
		const tab = await db.TabInfo.where({ position: position }).first();
		if (!tab) {
			return "";
		}
		return tab.tabs;
	} catch (error) {
		throw new Error(
			"Failed to get tabs at position: " + position + " Error: " + error,
		);
	}
}
export async function getTabInfoByPosition(position: string) {
	try {
		const tab = await db.TabInfo.where({ position: position }).first();
		if (!tab) {
			return "";
		}
		return tab;
	} catch (error) {
		throw new Error(
			"Failed to get tab info at position: " + position + " Error: " + error,
		);
	}
}
