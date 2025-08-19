import { DEFAULT_NOTE, NOTES_PER_SECTION, STRINGS } from "@/types/guitar-tab";
import { updateCurrentTabs } from "./UpdateTab";

export const clearTab = async (tabId: string = "0") => {
	const newTab = Array(STRINGS)
		.fill(null)
		.map(() => Array(NOTES_PER_SECTION).fill(DEFAULT_NOTE));
	await updateCurrentTabs(newTab, tabId);
	console.log(
		"%c DEBUG: %c Tab Clear Successfully cleared tab content for tab %c%s",
		"background: #2c3e50; color: white;",
		"background: inherit; color: white;",
		"color: #22e66a;",
		tabId,
	);
	return newTab;
};
