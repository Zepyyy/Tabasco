import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import { updateCurrentTabs } from "./UpdateTab";

export const clearTab = async (tabId = "0") => {
	const newTab = Array.from({ length: STRINGS }, () =>
		Array.from({ length: NOTES_PER_SECTION }, () => DEFAULT_NOTE),
	);
	await updateCurrentTabs(newTab, tabId);
	return newTab;
};
