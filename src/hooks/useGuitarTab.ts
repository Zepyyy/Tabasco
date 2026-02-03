import download from "downloadjs";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    DEFAULT_NOTE,
    MAX_FRET,
    MUTED_STRING,
    NOTES_PER_SECTION,
    OPEN_STRING,
} from "@/constants/guitar-tab";
import { useLock } from "@/contexts/LockContext";
import { exportTabs } from "@/db/crud/Export";
import { ImportTabs } from "@/db/crud/Import";
import {
    switchTwoNotesByPosition,
    updateCurrentTabs,
} from "@/db/crud/UpdateTab";
import type {
    NoteCellPosition,
    Tab,
    TabInfo,
    TabOperations,
    TabState,
} from "@/types/guitar-tab";
import { useCurrentTab } from "./useCurrentTab";

export const useGuitarTab = (): TabState & TabOperations => {
    const navigate = useNavigate();
    const { currentTab, position } = useCurrentTab();
    const tab = useMemo(() => currentTab?.tabs || [], [currentTab]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { locked, triggerLockFeedback } = useLock();

    const handleCellClick = useCallback(
        async (string: number, note: number): Promise<void> => {
            if (locked) {
                triggerLockFeedback();
                return;
            }
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
                await updateCurrentTabs(newTab || [], position || "0");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to update tab"),
                );
            }
        },
        [locked, triggerLockFeedback, tab, position],
    );

    const handleNewLineClick = useCallback(() => {
        if (locked) {
            triggerLockFeedback();
            return;
        }
        try {
            const newTab = tab.map((row: string[]) => [...row]) || [];
            // Add a new DEFAULT_NOTE to each string in the tab
            newTab.forEach((string) => {
                for (let i = 0; i < NOTES_PER_SECTION; i++) {
                    string.push(DEFAULT_NOTE);
                }
            });
            updateCurrentTabs(newTab, position || "0");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error("Failed to add new line"),
            );
            throw new Error("Failed to add new line");
        }
    }, [locked, triggerLockFeedback, tab, position]);

    const incrementNotesNumber = useCallback(
        (string: number, note: number): void => {
            if (locked) {
                triggerLockFeedback();
                return;
            }
            try {
                const newTab = tab.map((row: string[]) => [...row]) || [];
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
                            nextValue > MAX_FRET
                                ? DEFAULT_NOTE
                                : nextValue.toString();
                        break;
                    }
                }
                updateCurrentTabs(newTab, position || "0");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to increment note"),
                );
                throw new Error("Failed to increment note");
            }
        },
        [locked, triggerLockFeedback, tab, position],
    );

    const handleRemoveSection = useCallback(
        (section: { data: Tab; startNoteIndex: number }): void => {
            if (locked) {
                triggerLockFeedback();
                return;
            }
            if (tab.length !== NOTES_PER_SECTION) {
                try {
                    const sectionLength = section.data[0]?.length || 0;
                    const newTab = tab.map((string) => {
                        const newString = [...string];
                        newString.splice(section.startNoteIndex, sectionLength);
                        return newString;
                    });
                    updateCurrentTabs(newTab || [], position || "0");
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error("Failed to remove section"),
                    );
                    throw new Error("Failed to remove section");
                }
            } else {
                console.error(
                    "Cannot remove section: tab has only one section",
                );
                throw new Error(
                    "Cannot remove section: tab has only one section",
                );
            }
        },
        [locked, triggerLockFeedback, tab, position],
    );

    const handleExport = useCallback(
        async (position: string) => {
            setIsLoading(true);
            try {
                const exportedData = await exportTabs(position);
                if (exportedData) {
                    const tabName =
                        exportedData.tabName || `Tab-Unnamed-${position}`;
                    const tabs = exportedData.tabs || [];
                    const capo = exportedData.capo || -1;
                    const jsonData = JSON.stringify(
                        {
                            tabName,
                            tabs,
                            capo,
                        },
                        null,
                        2,
                    );
                    download(
                        jsonData,
                        `Tab-${tabName}.json`,
                        "application/json",
                    );
                } else {
                    throw new Error("Export failed - no data returned");
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("Failed to export tab"),
                );
                throw new Error("Failed to export tab");
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setError],
    );

    const handleImport = useCallback(
        async (jsonData: Partial<TabInfo>) => {
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
                        "capo" in jsonData &&
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
                setError(
                    err instanceof Error ? err : new Error("Failed to import"),
                );
                throw new Error("Failed to import");
            } finally {
                setIsLoading(false);
            }
        },
        [navigate, setIsLoading, setError],
    );

    const handleSwitchNotes = useCallback(
        async (
            NoteOnePosition: NoteCellPosition,
            NoteTwoPosition: NoteCellPosition,
        ) => {
            if (locked) {
                triggerLockFeedback();
                return;
            }
            if (
                NoteOnePosition.position == -1 ||
                NoteOnePosition.string == -1
            ) {
                return;
            }
            if (
                NoteOnePosition.string == NoteTwoPosition.string &&
                NoteOnePosition.position == NoteTwoPosition.position
            ) {
                throw new Error("Invalid data format for import");
            }

            await switchTwoNotesByPosition(
                position || "0",
                NoteOnePosition,
                NoteTwoPosition,
            );
        },
        [locked, triggerLockFeedback, position],
    );

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
        handleSwitchNotes,
    };
};
