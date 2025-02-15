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
		const updatedCount = await db.TabInfo.where({ position: id }).modify({
			position: position,
		});
		if (updatedCount === 0) {
			console.log(`No tab found at position: ${id}`);
		} else {
			console.log(`Updated tab (Position): ${id}`);
		}
	} catch (error) {
		console.log(`Failed to update tab: ${error}`);
	}
}
