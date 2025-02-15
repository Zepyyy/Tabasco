import { db } from "../db";

// function getTabs() {
// 	return db.TabInfo.toArray();
// }

function getLastTabPosition() {
	return db.TabInfo.orderBy("position").last();
}

export default async function addTab(
	tabName?: string,
	tabs?: string[][],
	position?: string
) {
	try {
		// Get the current tabs, so we can determine the position of the new tab
		// const currentTabs = await getTabs();
		const lastTab = await getLastTabPosition();
		const maxPosition = lastTab ? parseInt(lastTab.position) + 1 : 0;

		// Add the new value!
		await db.TabInfo.add({
			tabName: tabName || "Unnamed",
			tabs:
				tabs ||
				Array(6)
					.fill(null)
					.map(() => Array(48).fill("-")),
			position: position ? position : maxPosition.toString(), // Increment the position
		});

		console.log(tabs);
	} catch (error) {
		console.log(error);
	}
}
