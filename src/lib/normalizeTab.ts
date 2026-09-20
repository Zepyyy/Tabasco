import {
	DEFAULT_NOTE,
	NOTES_PER_SECTION,
	STRINGS,
} from "@/constants/guitar-tab";
import type { Tab } from "@/types/guitar-tab";

/**
 * Enforce the one invariant the sheet relies on: every string is the same
 * length, that length is a whole number of sections, and there are exactly
 * STRINGS strings. Ragged imports and pre-grid data are padded with empty
 * notes (never truncated), so nothing a user wrote is ever lost.
 */
export function normalizeTab(tab: Tab): Tab {
	if (!Array.isArray(tab) || tab.length === 0) return [];

	const width = Math.max(
		0,
		...tab.map((row) => (Array.isArray(row) ? row.length : 0)),
	);
	if (width === 0) return [];

	const sections = Math.max(1, Math.ceil(width / NOTES_PER_SECTION));
	const target = sections * NOTES_PER_SECTION;

	return Array.from({ length: STRINGS }, (_, i) => {
		const row = Array.isArray(tab[i]) ? tab[i] : [];
		const padded = row.slice(0, target);
		while (padded.length < target) {
			padded.push(DEFAULT_NOTE);
		}
		return padded;
	});
}
