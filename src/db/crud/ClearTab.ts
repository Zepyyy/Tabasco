import { updateCurrentTabs } from "./UpdateTab";

const DEFAULT_NOTE = "-";
const STRINGS = 6;
const NOTES = 48;

export const clearTab = async (tabId: string = "0") => {
	const newTab = Array(STRINGS)
		.fill(null)
		.map(() => Array(NOTES).fill(DEFAULT_NOTE));
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
