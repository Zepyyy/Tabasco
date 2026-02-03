import {
	DEFAULT_NOTE,
	MUTED_STRING,
	OPEN_STRING,
} from "@/constants/guitar-tab";

// Types
export type NoteValue =
	| typeof DEFAULT_NOTE
	| typeof OPEN_STRING
	| typeof MUTED_STRING
	| string;
export type TabString = NoteValue[];
export type Tab = TabString[];

// Contexts
export type LockContextType = {
	locked: boolean;
	toggleLock: () => void;
	triggerLockFeedback: () => void;
	trigger: boolean;
	showText: boolean;
};

export type NameContextType = {
	tabName: string;
	setTabName: (tabName: string) => void;
};

export type ThemeContextType = {
	theme: string;
	toggleTheme: () => void;
};

// Interfaces
export interface TabState {
	tab: Tab;
	isLoading: boolean;
	error: Error | null;
}

export interface TabInfo {
	id: number;
	tabName: string;
	tabs: string[][];
	position: string;
	capo: number;
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
