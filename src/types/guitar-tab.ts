import { TabInfo } from "@/db/db";

// Constants
export const STRINGS = 6;
export const DEFAULT_NOTE = "-";
export const OPEN_STRING = "0";
export const MUTED_STRING = "X";
export const MAX_FRET = 24;
export const NOTES_PER_SECTION = 54;
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
	handleImport: (jsonData: Partial<TabInfo>) => Promise<number | null>;
	handleSwitchNotes: (
		NoteOnePosition: NoteCellPosition,
		NoteTwoPosition: NoteCellPosition,
	) => void;
}

export interface NoteCellPosition {
	string: number;
	position: number;
}

export interface NoteCellState {
	note: NoteValue;
	stringIndex: number;
	absoluteNoteIndex: number;
	onIncrement: (stringIndex: number, noteIndex: number) => void;
	onToggle: (string: number, note: number) => void;
}

export interface NoteCellOperations {
	handleSwitchNotes: (
		noteOnePosition: NoteCellPosition,
		noteTwoPosition: NoteCellPosition,
	) => void;
	setNoteOnePosition: React.Dispatch<React.SetStateAction<NoteCellPosition>>;
	noteOnePosition: NoteCellPosition;
}

export type NoteCellProps = NoteCellState & NoteCellOperations;

export interface StringRowState {
	string: TabString;
	stringIndex: number;
	startNoteIndex: number;
	onIncrement: (stringIndex: number, noteIndex: number) => void;
	onToggle: (string: number, note: number) => void;
}
export interface StringRowPosition {
	handleSwitchNotes: (
		noteOnePosition: NoteCellPosition,
		noteTwoPosition: NoteCellPosition,
	) => void;
	noteOnePosition: NoteCellPosition;
	setNoteOnePosition: React.Dispatch<React.SetStateAction<NoteCellPosition>>;
}

export type StringRowProps = StringRowState & StringRowPosition;
