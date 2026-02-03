import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import { updateCurrentTabs } from "./UpdateTab";

export const clearTab = async (tabId = "0") => {
	const newTab = Array(STRINGS)
		.fill(null)
		.map(() => Array(NOTES_PER_SECTION).fill(DEFAULT_NOTE));
	await updateCurrentTabs(newTab, tabId);
	return newTab;
};
