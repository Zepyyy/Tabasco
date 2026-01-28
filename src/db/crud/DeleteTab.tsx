import { db } from "../db";

export default async function deleteTabById(id: number) {
	try {
		// Get the tab being deleted to know its position
		const tabToDelete = await db.TabInfo.where("id").equals(id).first();
		const deletedPosition = tabToDelete?.position;

		const updatedCount = await db.TabInfo.where("id").equals(id).delete();

		if (updatedCount === 0) {
			console.log(
				"%c DEBUG: %c Tab Delete No tab found at id: %c",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"%c" + id,
				"color: #22e66a;",
			);
			return null;
		} else {
			console.log(
				"%c DEBUG: %c Tab Delete Successfully deleted tab at id %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
			);
		}

		// Get the remaining tabs to find the best position to navigate to
		const remainingTabs = await db.TabInfo.orderBy("position").toArray();

		if (remainingTabs.length === 0) {
			// No tabs left, return null to indicate no navigation needed
			return null;
		}

		// Find the best position to navigate to
		let targetPosition = "0"; // Default to first tab

		if (deletedPosition) {
			const deletedPosNum = Number.parseInt(deletedPosition);

			// Try to find a tab with position less than the deleted one
			const previousTab = remainingTabs
				.filter(
					(tab) =>
						tab.position && Number.parseInt(tab.position) < deletedPosNum,
				)
				.sort((a, b) => {
					const posA = a.position ? Number.parseInt(a.position) : 0;
					const posB = b.position ? Number.parseInt(b.position) : 0;
					return posB - posA;
				})[0];

			if (previousTab?.position) {
				targetPosition = previousTab.position;
			} else {
				// No previous tab, go to the first remaining tab
				targetPosition = remainingTabs[0]?.position || "0";
			}
		}

		return targetPosition;
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
		return null;
	}
}
