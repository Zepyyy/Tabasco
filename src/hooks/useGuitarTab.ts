import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { getTabsById } from "@/db/crud/GetTab";
import { updateCurrentTabs } from "@/db/crud/UpdateTab";
import {
	STRINGS,
	DEFAULT_NOTE,
	OPEN_STRING,
	MUTED_STRING,
	MAX_FRET,
	type Tab,
	type TabState,
	type TabOperations,
} from "@/types/guitar-tab";

export const useGuitarTab = (): TabState & TabOperations => {
	const { tabId } = useParams<{ tabId: string }>();
	const location = useLocation();
	const [NOTES] = useState(48);
	const [tab, setTab] = useState<Tab>(
		Array(STRINGS)
			.fill(null)
			.map(() => Array(NOTES).fill(DEFAULT_NOTE)),
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleCellClick = async (
		string: number,
		note: number,
	): Promise<void> => {
		try {
			const newTab = tab.map((row: string[], i: number) =>
				row.map((cell: string, j: number) =>
					i === string && j === note
						? cell === DEFAULT_NOTE
							? OPEN_STRING
							: cell === OPEN_STRING
								? MUTED_STRING
								: DEFAULT_NOTE
						: cell,
				),
			);
			setTab(newTab);
			await updateCurrentTabs(newTab, tabId || "0");
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to update tab"));
		}
	};

	const handleNewLineClick = () => {
		try {
			const newTab = [...tab];
			// Add a new DEFAULT_NOTE to each string in the tab
			newTab.forEach((string) => {
				for (let i = 0; i < NOTES; i++) {
					string.push(DEFAULT_NOTE);
				}
			});
			setTab(newTab);
			updateCurrentTabs(newTab, tabId || "0");
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to add new line"),
			);
		}
	};

	const incrementNotesNumber = (string: number, note: number): void => {
		try {
			console.log("string: ", string, "note: ", note);
			const newTab = [...tab];
			const currentValue = newTab[string][note];
			switch (true) {
				case currentValue === DEFAULT_NOTE:
					newTab[string][note] = "1";
					break;
				case currentValue === MUTED_STRING:
					newTab[string][note] = DEFAULT_NOTE;
					break;
				default: {
					const nextValue = Number.parseInt(currentValue) + 1;
					newTab[string][note] =
						nextValue > MAX_FRET ? DEFAULT_NOTE : nextValue.toString();
					break;
				}
			}
			setTab(newTab);
			updateCurrentTabs(newTab, tabId || "0");
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to increment note"),
			);
		}
	};

	useEffect(() => {
		const fetchTab = async () => {
			if (!tabId) return;

			setIsLoading(true);
			setError(null);

			try {
				const tabs = await getTabsById(tabId);
				if (tabs) {
					setTab(tabs);
				}
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Failed to fetch tab"));
			} finally {
				setIsLoading(false);
			}
		};

		fetchTab();
	}, [tabId, location.key]);

	return {
		tab,
		handleNewLineClick,
		isLoading,
		error,
		handleCellClick,
		incrementNotesNumber,
	};
};
