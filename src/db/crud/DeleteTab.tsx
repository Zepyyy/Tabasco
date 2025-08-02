import { db } from "../db";

export default async function deleteTabById(id: number) {
	try {
		const updatedCount = await db.TabInfo.where("id").equals(id).delete();
		if (updatedCount === 0) {
			console.log(
				"%c DEBUG: %c Tab Delete No tab found at id: %c",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"%c" + id,
				"color: #22e66a;",
			);
		} else {
			console.log(
				"%c DEBUG: %c Tab Delete Successfully deleted tab at id %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
			);
		}
	} catch (error) {
		console.log(
			"%c DEBUG: %c Tab Delete Failed to delete tab at id %c%s %c Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"%c" + id,
			"color: #2c3e50;",
			"%c" + error,
			"color: #22b5e6;",
		);
	}
}
