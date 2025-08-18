import { TabInfo } from "@/db/db";

// Constants
export const STRINGS = 6;
export const DEFAULT_NOTE = "-";
export const OPEN_STRING = "0";
export const MUTED_STRING = "X";
export const MAX_FRET = 24;

// Types
export type NoteValue =
	| typeof DEFAULT_NOTE
	| typeof OPEN_STRING
	| typeof MUTED_STRING
	| string;
export type TabString = NoteValue[];
export type Tab = TabString[];

// Interfaces
export interface TabState {
	tab: Tab;
	isLoading: boolean;
	error: Error | null;
}

export interface TabOperations {
	handleCellClick: (string: number, note: number) => Promise<void>;
	incrementNotesNumber: (string: number, note: number) => void;
	handleNewLineClick: (newTab: Tab) => void;
	handleRemoveSection: (section: { data: Tab; startNoteIndex: number }) => void;
	handleExport: (id: string) => Promise<void>;
	handleImport: (jsonData: Partial<TabInfo>) => Promise<string | null>;
}

export interface NoteCellProps {
	note: NoteValue;
	stringIndex: number;
	onIncrement: (stringIndex: number, noteIndex: number) => void;
	onToggle: (string: number, note: number) => void;
}

export interface StringRowProps {
	string: TabString;
	stringIndex: number;
	onIncrement: (stringIndex: number, noteIndex: number) => void;
	onToggle: (string: number, note: number) => void;
}
