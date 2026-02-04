import { db } from "../db";

/**
 * Deletes a tab by its numeric id and reassigns sequential positions ("0", "1", ...)
 * to the remaining tabs so there are no duplicated positions.
 *
 * Returns the position (as a string) of the tab that should be navigated to after deletion,
 * or `null` if there are no remaining tabs (or the delete failed).
 */
export default async function deleteTabById(
	id: number,
): Promise<string | null> {
	try {
		// Fetch the tab to delete first so we can know its original position.
		const tabToDelete = await db.TabInfo.where("id").equals(id).first();
		const deletedPosition = tabToDelete?.position;

		// Delete the tab.
		const deletedCount = await db.TabInfo.where("id").equals(id).delete();

		if (deletedCount === 0) {
			// Nothing was deleted
			return null;
		}

		// Get all remaining tabs and sort them by their numeric position.
		const remainingTabs = await db.TabInfo.toArray();

		remainingTabs.sort((a, b) => {
			const aNum = Number.parseInt(a.position || "0");
			const bNum = Number.parseInt(b.position || "0");
			const aVal = Number.isNaN(aNum) ? 0 : aNum;
			const bVal = Number.isNaN(bNum) ? 0 : bNum;
			return aVal - bVal;
		});

		if (remainingTabs.length === 0) {
			// No tabs left after deletion
			return null;
		}

		// Determine which tab we should navigate to after deletion.
		// Prefer the previous tab (the one with the largest position < deletedPosition).
		let targetIndex = 0; // default to first tab

		if (deletedPosition !== undefined) {
			const deletedPosNum = Number.parseInt(deletedPosition);
			const deletedPosValue = Number.isNaN(deletedPosNum) ? -1 : deletedPosNum;

			let previousIndex = -1;
			for (let i = 0; i < remainingTabs.length; i++) {
				const posNum = Number.parseInt(remainingTabs[i].position || "0");
				const posValue = Number.isNaN(posNum) ? 0 : posNum;
				if (posValue < deletedPosValue) {
					previousIndex = i;
				} else {
					// since array is sorted ascending, once we hit >= deletedPosValue we can stop
					break;
				}
			}

			if (previousIndex !== -1) {
				targetIndex = previousIndex;
			} else {
				// No previous tab, keep default (first tab)
				targetIndex = 0;
			}
		}

		// Re-number remaining tabs to sequential string positions ("0", "1", "2", ...)
		await db.transaction("rw", db.TabInfo, async () => {
			for (let i = 0; i < remainingTabs.length; i++) {
				const tab = remainingTabs[i];
				// Only modify if the position would actually change (avoid unnecessary writes)
				const newPos = i.toString();
				if (tab.position !== newPos) {
					await db.TabInfo.where({ id: tab.id }).modify({ position: newPos });
				}
			}
		});

		// After renumbering, the target position is simply the index we computed
		return targetIndex.toString();
	} catch (error) {
		throw new Error("Failed to delete tab with id: " + id + " Error: " + error);
	}
}
