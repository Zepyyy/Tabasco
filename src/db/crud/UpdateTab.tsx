import type { NoteCellPosition } from "@/types/guitar-tab";
import { DEFAULT_NOTE } from "@/types/guitar-tab";
import { db } from "../db";

export default async function updateTabNameById(id: number, newName: string) {
	try {
		const updatedCount = await db.TabInfo.where({
			id: id,
		}).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.log(
				"%c DEBUG: %c Tab Rename No tab found at id: %c",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
			);
		} else {
			console.log(
				"%c DEBUG: %c Tab Rename Successfully renamed tab at id: %c%s%c to %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
				"color: white;",
				"color: #22b5e6;",
				newName,
			);
		}
	} catch (error) {
		console.log(
			"%c DEBUG: Tab Rename %c Failed to rename tab Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"%c" + id,
			"color: #2c3e50;",
			error,
		);
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
			console.log(
				"%c DEBUG: %c Tab Rename No tab found at position: %c",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				position,
			);
		} else {
			console.log(
				"%c DEBUG: %c Tab Rename Successfully renamed tab at position: %c%s%c to %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				position,
				"color: white;",
				"color: #22b5e6;",
				newName,
			);
		}
	} catch (error) {
		console.log(
			"%c DEBUG: Tab Rename %c Failed to rename tab Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"%c" + position,
			"color: #2c3e50;",
			error,
		);
	}
}
export async function updateCurrentTabs(tabs: string[][], activeTab: string) {
	activeTab = activeTab || "0";
	try {
		await db.TabInfo.where("position").equals(activeTab).modify({ tabs: tabs });
		console.log(
			"%c DEBUG: %c Tab Update Successfully updated tab content for tab %c%s",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"color: #22e66a;",
			activeTab,
		);
	} catch (error) {
		console.log(
			"%c DEBUG: Tab Update %c Failed to update tab content Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"%c" + activeTab,
			"color: #22e66a;",
			error,
		);
	}
}

export async function updateTabCapoByPosition(position: string, capo: number) {
	await db.TabInfo.where({ position: position }).modify({ capo: capo });
	console.log(
		"%c DEBUG: %c Tab Capo Update Successfully updated tab capo at position: %c%s to %c%s",
		"background: #2c3e50; color: white;",
		"background: inherit; color: white;",
		"color: #22e66a;",
		position,
		"color: white;",
		"color: #22b5e6;",
		capo,
	);
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
				console.log(
					"%c DEBUG: %c Tab Position No tab found with id %c%s%c",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					tabPosition,
				);
				result = undefined;
				return;
			}

			const noteOneValue =
				tab.tabs[NoteOnePosition.string][NoteOnePosition.position];
			const noteTwoValue =
				tab.tabs[NoteTwoPosition.string][NoteTwoPosition.position];

			if (noteOneValue === DEFAULT_NOTE && noteTwoValue === DEFAULT_NOTE) {
				// Throw to abort the transaction on a useless switch
				throw "useless switch";
			} else {
				// Making a deep copy of the tabs array to avoid mutating the original
				const newTab = tab.tabs.map((row) => [...row]);
				const temp = newTab[NoteOnePosition.string][NoteOnePosition.position];

				// Swap the values
				newTab[NoteOnePosition.string][NoteOnePosition.position] =
					newTab[NoteTwoPosition.string][NoteTwoPosition.position];
				newTab[NoteTwoPosition.string][NoteTwoPosition.position] = temp;

				console.log(
					"Swapped:",
					`[${NoteOnePosition.string}][${NoteOnePosition.position}] <-> [${NoteTwoPosition.string}][${NoteTwoPosition.position}]`,
				);
				console.log("Resulting tab:", newTab);

				await db.TabInfo.where({ position: tabPosition }).modify({
					tabs: newTab,
				});

				console.log(
					"%c DEBUG: %c Tab Update Successfully switched notes at positions %c %s - %s %c , %c %s - %s",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					NoteOnePosition.string,
					NoteOnePosition.position,
					"color: white;",
					"color: #22e66a;",
					NoteTwoPosition.string,
					NoteTwoPosition.position,
				);
				result = "worked";
			}
		});
		// If we get here, either the swap happened or nothing was thrown
		if (result === undefined) {
			console.log(
				"%c DEBUG: %c Tab Update Successfully switched notes at positions %c %s - %s %c , %c %s - %s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				NoteOnePosition.string,
				NoteOnePosition.position,
				"color: white;",
				"color: #22e66a;",
				NoteTwoPosition.string,
				NoteTwoPosition.position,
			);
			return "worked";
		} else {
			return result;
		}
	} catch (error) {
		console.log(
			"%cDEBUG:%c Tab Update and Failed to update tab content Error: %c %s %s",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			"color: #22e66a;",
			NoteOnePosition.position,
			NoteTwoPosition.position,
			error,
		);
		return "oh fuck";
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
				console.log(
					"%c DEBUG: %c Tab Position No tab found with id %c%s%c",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					currentId,
				);
				return; // Exit the transaction if a tab is not found
			} else if (tab1 && !tab2) {
				await db.TabInfo.where({ id: currentId }).modify({
					position: newPosition,
				});
				console.log(
					"%c DEBUG: %c Tab Position No tab found at position %c%s%c, setting the position wihtout swap necessary",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					newPosition,
				);
				return;
			} else {
				await db.TabInfo.where({ id: currentId }).modify({
					position: newPosition,
				});
				await db.TabInfo.where({ id: tab2?.id }).modify({
					position: tab1.position,
				});
				console.log(
					"%c DEBUG: %c Tab Position Successfully swapped positions between tabs: %c%s%c and %c%s",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					currentId,
					"color: white;",
					"color: #22e66a;",
					tab2?.id,
				);
				return;
			}
		});
	} catch (error) {
		console.log(
			"%c DEBUG: Tab Position %c Failed to update tab positions Error: ",
			"background: #2c3e50; color: white;",
			"background: inherit; color: white;",
			error,
		);
	}
}
