import { db } from "../db";

export default async function updateTabNameById(id: string, newName: string) {
	try {
		const updatedCount = await db.TabInfo.where({ position: id }).modify({
			tabName: newName,
		});
		if (updatedCount === 0) {
			console.log(
				"%c DEBUG: %c Tab Rename No tab found at position: ",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"%c" + id,
				"color: #2c3e50;",
			);
		} else {
			console.log(
				"%c DEBUG: %c Tab Rename Successfully renamed tab %c%s%c to %c%s",
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

export async function updateTabPositionById(id: string, position: string) {
	try {
		await db.transaction("rw", db.TabInfo, async () => {
			const tab1 = await db.TabInfo.where({ position: id }).first();
			const tab2 = await db.TabInfo.where({ position: position }).first();

			if (!tab1) {
				console.log(
					"%c DEBUG: Tab Position %c No tab found at position %c%s%c",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					id,
				);
				return; // Exit the transaction if a tab is not found
			}

			if (!tab2) {
				console.log(
					"%c DEBUG: %c Tab Position No tab found at position %c%s%c ",
					"background: #2c3e50; color: white;",
					"background: inherit; color: white;",
					"color: #22e66a;",
					position,
				);
				return; // Exit the transaction if a tab is not found
			}

			await db.TabInfo.where({ id: tab1.id }).modify({
				position: position,
			});
			await db.TabInfo.where({ id: tab2.id }).modify({ position: id });

			console.log(
				"%c DEBUG: %c Tab Position Successfully swapped positions between tabs: %c%s%c and %c%s",
				"background: #2c3e50; color: white;",
				"background: inherit; color: white;",
				"color: #22e66a;",
				id,
				"color: white;",
				"color: #22e66a;",
				position,
			);
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
