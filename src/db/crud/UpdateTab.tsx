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
	activeTab = activeTab ? activeTab : "0";
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
