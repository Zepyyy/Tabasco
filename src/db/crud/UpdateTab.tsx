import { db } from "../db";

export default async function updateTabById(id: string, newName: string) {
	try {
		const updatedCount = await db.TabInfo.where({ position: id }).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.log(`No tab found at position: ${id}`);
		} else {
			console.log(`Updated tab: ${id}`);
		}
	} catch (error) {
		console.log(`Failed to update tab: ${error}`);
	}
}
