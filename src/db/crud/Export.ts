import { getTabInfoByPosition } from "./GetTab";

export async function exportTabs(position: string) {
	try {
		const fullTabs = await getTabInfoByPosition(position);

		if (!fullTabs) {
			throw new Error("Tab not found at position: " + position);
			return "";
		} else {
			return fullTabs;
		}
	} catch (error) {
		throw new Error(
			"Failed to export tab at position: " + position + " Error: " + error,
		);
	}
}
