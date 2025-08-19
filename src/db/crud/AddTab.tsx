import { TabInfo } from "@/db/db";
import { db } from "../db";
import { NOTES_PER_SECTION } from "@/types/guitar-tab";

export async function getLastTabPosition() {
	const tab = await db.TabInfo.orderBy("position").last();
	return tab?.position;
}

export default async function addTab({ tabName, tabs }: Partial<TabInfo>) {
	try {
		const lastTabPosition = await getLastTabPosition();
		const maxPosition =
			lastTabPosition && lastTabPosition !== undefined
				? (parseInt(lastTabPosition as string) + 1).toString()
				: "0";

		await db.TabInfo.add({
			tabName: tabName || "Unnamed",
			tabs:
				tabs ||
				Array(6)
					.fill(null)
					.map(() => Array(NOTES_PER_SECTION).fill("-")),
			position: maxPosition.toString(), // Increment the position
		});
		console.log(
			"%c DEBUG: %c Tab Add Successfully added tab at position %c%s",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"color: #22e66a;",
			maxPosition,
		);
		return maxPosition;
	} catch (error) {
		console.log(
			"%c DEBUG: %c Tab Delete Failed to delete tab Error at position: %c%s %c Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"color: #22e66a;",
			error,
		);
	}
}
