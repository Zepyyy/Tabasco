import { DEFAULT_NOTE } from "@/constants/guitar-tab";
import type { NoteCellPosition } from "@/types/guitar-tab";
import { db } from "../db";

export default async function updateTabNameById(id: number, newName: string) {
	try {
		const updatedCount = await db.TabInfo.where({
			id: id,
		}).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.log("no tab found with id:", id);
			return;
		}
	} catch (error) {
		throw new Error("Failed to rename tab with id: " + id + " Error: " + error);
	}
}
export async function updateTabNameByPosition(
	position: string,
	newName: string,
) {
	try {
		const updatedCount = await db.TabInfo.where({
			position: position,
		}).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.error("no tab found at position:", position);
			return;
		}
	} catch (error) {
		throw new Error(
			"Failed to rename tab at position: " + position + " Error: " + error,
		);
	}
}
export async function updateCurrentTabs(tabs: string[][], activeTab: string) {
	activeTab = activeTab || "0";
	try {
		await db.TabInfo.where("position").equals(activeTab).modify({ tabs: tabs });
	} catch (error) {
		throw new Error(
			"Failed to update tabs at position: " + activeTab + " Error: " + error,
		);
	}
}

export async function updateTabCapoByPosition(position: string, capo: number) {
	await db.TabInfo.where({ position: position }).modify({ capo: capo });
}

export async function switchTwoNotesByPosition(
	tabPosition: string,
	NoteOnePosition: NoteCellPosition,
	NoteTwoPosition: NoteCellPosition,
) {
	try {
		let result = undefined;
		await db.transaction("rw", db.TabInfo, async () => {
			const tab = await db.TabInfo.where({
				position: tabPosition,
			}).first();

			if (!tab) {
				console.error("No tab found at position:", tabPosition);
				result = undefined;
				return;
			}

			const noteOneValue =
				tab.tabs[NoteOnePosition.string][NoteOnePosition.position];
			const noteTwoValue =
				tab.tabs[NoteTwoPosition.string][NoteTwoPosition.position];

			if (noteOneValue === DEFAULT_NOTE && noteTwoValue === DEFAULT_NOTE) {
				// Throw to abort the transaction on a useless switch
				return;
			} else {
				// Making a deep copy of the tabs array to avoid mutating the original
				const newTab = tab.tabs.map((row) => [...row]);
				const temp = newTab[NoteOnePosition.string][NoteOnePosition.position];

				// Swap the values
				newTab[NoteOnePosition.string][NoteOnePosition.position] =
					newTab[NoteTwoPosition.string][NoteTwoPosition.position];
				newTab[NoteTwoPosition.string][NoteTwoPosition.position] = temp;

				await db.TabInfo.where({ position: tabPosition }).modify({
					tabs: newTab,
				});
				result = "worked";
			}
		});
		// If we get here, either the swap happened or nothing was thrown
		if (result === undefined) {
			return "worked";
		} else {
			return result;
		}
	} catch (error) {
		throw new Error("Failed to switch notes. Error: " + error);
	}
}

export async function updateTabPositionById(
	newPosition: string,
	currentId?: number,
) {
	try {
		await db.transaction("rw", db.TabInfo, async () => {
			const tab1 = await db.TabInfo.where({ id: currentId }).first();
			const tab2 = await db.TabInfo.where({
				position: newPosition,
			}).first();

			if (!tab1) {
				console.error("No tab found with id:", currentId);
				return;
			} else if (tab1 && !tab2) {
				await db.TabInfo.where({ id: currentId }).modify({
					position: newPosition,
				});
				console.error("No tab found at position:", newPosition);
				return;
			} else {
				await db.TabInfo.where({ id: currentId }).modify({
					position: newPosition,
				});
				await db.TabInfo.where({ id: tab2?.id }).modify({
					position: tab1.position,
				});

				return;
			}
		});
	} catch (error) {
		throw new Error("Failed to update tab position. Error: " + error);
	}
}
