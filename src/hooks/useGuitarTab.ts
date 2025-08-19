import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { getTabsByPosition } from "@/db/crud/GetTab";
import { updateCurrentTabs } from "@/db/crud/UpdateTab";
import { exportTabs } from "@/db/crud/Export";
import download from "downloadjs";

import {
	STRINGS,
	DEFAULT_NOTE,
	OPEN_STRING,
	MUTED_STRING,
	MAX_FRET,
	type Tab,
	type TabState,
	type TabOperations,
	NOTES_PER_SECTION,
} from "@/types/guitar-tab";
import { ImportTabs } from "@/db/crud/Import";
import { TabInfo } from "@/db/db";

export const useGuitarTab = (): TabState & TabOperations => {
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();
	const location = useLocation();
	const navigate = useNavigate();
	const [tab, setTab] = useState<Tab>(
		Array(STRINGS)
			.fill(null)
			.map(() => Array(NOTES_PER_SECTION).fill(DEFAULT_NOTE)),
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
			await updateCurrentTabs(newTab, tabPositionFromParam || "0");
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to update tab"));
		}
	};

	const handleNewLineClick = () => {
		try {
			const newTab = [...tab];
			// Add a new DEFAULT_NOTE to each string in the tab
			newTab.forEach((string) => {
				for (let i = 0; i < NOTES_PER_SECTION; i++) {
					string.push(DEFAULT_NOTE);
				}
			});
			setTab(newTab);
			updateCurrentTabs(newTab, tabPositionFromParam || "0");
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to add new line"),
			);
		}
	};

	const incrementNotesNumber = (string: number, note: number): void => {
		try {
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
			updateCurrentTabs(newTab, tabPositionFromParam || "0");
		} catch (err) {
			setError(
				err instanceof Error ? err : new Error("Failed to increment note"),
			);
		}
	};

	const handleRemoveSection = (section: {
		data: Tab;
		startNoteIndex: number;
	}): void => {
		if (tab[0].length !== NOTES_PER_SECTION) {
			try {
				const sectionLength = section.data[0]?.length || 0;
				const newTab = tab.map((string) => {
					const newString = [...string];
					newString.splice(section.startNoteIndex, sectionLength);
					return newString;
				});
				setTab(newTab);
				updateCurrentTabs(newTab, tabPositionFromParam || "0");
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to remove section"),
				);
			}
		} else {
			console.log(
				"%cDEBUG:%c You can't delete a section if it's the only one %c",
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"color: #22dce6;",
			);
		}
	};

	useEffect(() => {
		const fetchTab = async () => {
			if (!tabPositionFromParam) return;

			setIsLoading(true);
			setError(null);

			try {
				const tabs = await getTabsByPosition(tabPositionFromParam);
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
	}, [tabPositionFromParam, location.key]);

	const handleExport = async (position: string) => {
		setIsLoading(true);
		try {
			const exportedData = await exportTabs(position);
			if (exportedData) {
				const tabName = exportedData.tabName || `Tab-Unnamed-${position}`;
				const tabs = exportedData.tabs || [];
				const jsonData = JSON.stringify(
					{
						tabName,
						tabs,
					},
					null,
					2,
				);
				download(jsonData, `Tab-${tabName}.json`, "application/json");
			} else {
				throw new Error("Export failed - no data returned");
			}
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Failed to export tab"));
		} finally {
			setIsLoading(false);
		}
	};

	const handleImport = async (jsonData: Partial<TabInfo>) => {
		console.log("%cDEBUG:%c Importing tab data", "color: #22e66a;", jsonData);
		setError(null);

		try {
			if (!jsonData) {
				throw new Error("No data provided for import");
			}

			setIsLoading(true);

			if (Object.keys(jsonData).length === 0) {
				throw new Error("No data to import");
			}

			// Check if the JSON data has the expected type (Partial<TabInfo>)
			if (
				!(
					"tabName" in jsonData &&
					"tabs" in jsonData &&
					Array.isArray(jsonData.tabs) &&
					jsonData.tabs.every((row) => Array.isArray(row))
				)
			) {
				throw new Error("Invalid data format for import");
			}

			const importedTabPosition = await ImportTabs(jsonData);
			navigate(`/sheet/${importedTabPosition}`);
			return importedTabPosition;
		} catch (err) {
			console.error(
				"%cDEBUG:%c Import error:",
				"background: #2c3e50; color: white; padding: 2px 5px;",
				"color: #22dce6;",
				err,
			);
			setError(err instanceof Error ? err : new Error("Failed to import"));
			return null;
		} finally {
			setIsLoading(false);
		}
	};
	return {
		tab,
		handleNewLineClick,
		isLoading,
		error,
		handleCellClick,
		incrementNotesNumber,
		handleRemoveSection,
		handleImport,
		handleExport,
	};
};
