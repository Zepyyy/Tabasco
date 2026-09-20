// Constants
export const STRINGS = 6;
export const DEFAULT_NOTE = "-";
export const OPEN_STRING = "0";
export const MUTED_STRING = "X";
export const MAX_FRET = 24;

/** Sixteenth notes: the standard tab-paper grid, 4 cells per beat in 4/4. */
export const NOTES_PER_BAR = 16;
/** A section is one printed line of the sheet: two full bars. */
export const BARS_PER_SECTION = 2;
export const NOTES_PER_SECTION = NOTES_PER_BAR * BARS_PER_SECTION;
