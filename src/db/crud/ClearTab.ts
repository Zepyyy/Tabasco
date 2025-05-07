import { updateCurrentTabs } from "./UpdateTab";

const DEFAULT_NOTE = "-";
const STRINGS = 6;
const NOTES = 48;

export const clearTab = async (tabId: string = "0") => {
	const newTab = Array(STRINGS)
		.fill(null)
		.map(() => Array(NOTES).fill(DEFAULT_NOTE));
	await updateCurrentTabs(newTab, tabId);
	return newTab;
};
