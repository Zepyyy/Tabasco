import { db } from "../db";

export default async function deleteTabById(id: string) {
	try {
		const updatedCount = await db.TabInfo.where("position").equals(id).delete();
		if (updatedCount === 0) {
			console.log(
				"%c DEBUG: %c Tab Delete No tab found at position: ",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"%c" + id,
				"color: #2c3e50;",
			);
		} else {
			console.log(
				"%c DEBUG: %c Tab Delete Successfully deleted tab at position %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
			);
		}
	} catch (error) {
		console.log(
			"%c DEBUG: %c Tab Delete Failed to delete tab %c%s %c Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"%c" + id,
			"color: #2c3e50;",
			"%c" + error,
			"color: #22b5e6;",
		);
	}
}
