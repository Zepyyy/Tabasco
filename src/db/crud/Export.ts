import { getTabInfoByPosition } from "./GetTab";

export async function exportTabs(position: string) {
	try {
		const fullTabs = await getTabInfoByPosition(position);

		if (!fullTabs) {
			console.log(
				"%cDEBUG:%c No tab found at position: %c" + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			return "";
		} else {
			console.log(
				"%cDEBUG:%c Successfully exported tab at position: %c" + position,
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"background: inherit; color: white;",
				"color: #22e66a;",
			);
			return fullTabs;
		}
	} catch (error) {
		console.log(
			"%cDEBUG:%c Failed to export tab Error: ",
			"background: #2c3e50; color: white; padding: 2px 5px;",
			"background: inherit; color: white;",
			"color: #22dce6;",
			error,
		);
		return "";
	}
}
