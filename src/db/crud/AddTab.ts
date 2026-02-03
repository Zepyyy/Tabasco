import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import { TabInfo } from "@/types/guitar-tab";
import { db } from "../db";

export async function getLastTabPosition() {
	const count = await db.TabInfo.count();
	return count;
}

export default async function addTab({
	tabName,
	tabs,
	capo,
}: Partial<TabInfo>) {
	try {
		const lastTabPosition = await getLastTabPosition();
		const maxPosition = lastTabPosition ? lastTabPosition : 0;

		await db.TabInfo.add({
			tabName: tabName || "Unnamed",
			tabs:
				tabs ||
				Array.from({ length: STRINGS }, () =>
					Array.from({ length: NOTES_PER_SECTION }, () => DEFAULT_NOTE),
				),
			position: maxPosition.toString(), // Increment the position
			capo: capo || -1,
		});
		return maxPosition;
	} catch (error) {
		throw new Error("Failed to add new tab. Error: " + error);
	}
}
