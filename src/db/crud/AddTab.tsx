import { db } from "../db";

async function getLastTabPosition() {
	const tab = await db.TabInfo.orderBy("position").last();
	return tab;
}

export default async function addTab({
	tabName,
	tabs,
	position,
}: {
	tabName?: string;
	tabs?: string[][];
	position?: string;
}) {
	try {
		console.log("this is triggered");
		// Get the current tabs, so we can determine the position of the new tab
		// const currentTabs = await getTabs();
		const lastTab = await getLastTabPosition();
		console.log(lastTab);
		const maxPosition = lastTab ? parseInt(lastTab.position) + 1 : 0;
		console.log(maxPosition);

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
		console.log("this is added");
	} catch (error) {
		console.log(error);
	}
}
