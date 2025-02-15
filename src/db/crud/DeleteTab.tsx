import { db } from "../db";

export default async function deleteTabById(id: string) {
	try {
		const updatedCount = await db.TabInfo.where("position").equals(id).delete();
		if (updatedCount === 0) {
			console.log(`No tab found at position: ${id}`);
		} else {
			console.log(`Deleted tab: ${id}`);
		}
	} catch (error) {
		console.log(`Failed to delete tab: ${error}`);
	}
}
