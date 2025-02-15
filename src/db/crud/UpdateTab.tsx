import { db } from "../db";

export default async function updateTabNameById(id: string, newName: string) {
	try {
		const updatedCount = await db.TabInfo.where({ position: id }).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.log(`No tab found at position: ${id}`);
		} else {
			console.log(`Updated tab (Renamed): ${id}`);
		}
	} catch (error) {
		console.log(`Failed to update tab: ${error}`);
	}
}

export async function updateTabPositionById(id: string, position: string) {
	try {
		await db.transaction("rw", db.TabInfo, async () => {
			const tab1 = await db.TabInfo.where({ position: id }).first();
			const tab2 = await db.TabInfo.where({ position: position }).first();

			if (!tab1) {
				console.log(`No tab found at position: ${id}`);
				return; // Exit the transaction if a tab is not found
			}

			if (!tab2) {
				console.log(`No tab found at position: ${position}`);
				return; // Exit the transaction if a tab is not found
			}

			await db.TabInfo.where({ id: tab1.id }).modify({ position: position });
			await db.TabInfo.where({ id: tab2.id }).modify({ position: id });

			console.log(`Updated tabs (Positions): ${id} and ${position}`);
		});
	} catch (error) {
		console.log(`Failed to update tab: ${error}`);
	}
}
