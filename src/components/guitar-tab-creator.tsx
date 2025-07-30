"use client";

// Import necessary hooks and types
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { NoteCellProps, StringRowProps } from "@/types/guitar-tab";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

/**
 * NoteCell component - Renders an individual note cell in the guitar tab
 * @param note - The note value to display
 * @param stringIndex - The index of the string this note belongs to
 * @param noteIndex - The position of this note in the string
 * @param onIncrement - Function to handle incrementing note value
 * @param onToggle - Function to handle toggling note states
 * @param absoluteNoteIndex - The absolute index of the note in the entire tab
 */
const NoteCell = ({
	note,
	stringIndex,
	onIncrement,
	onToggle,
	absoluteNoteIndex,
}: NoteCellProps & { absoluteNoteIndex: number }) => (
	<div
		className="border-r-2 last:border-none w-4 h-4 sm:w-6 sm:h-6 xl:w-8 xl:h-8 flex items-center justify-center cursor-grabbing font-bold text-foreground z-10 sm:text-md xl:text-xl font-serif-text nth-[6n]:border-tab border-tabsubtle data-[value='-']:text-tab/30 data-[value='X']:text-tab/50 select-none"
		onClick={() => onIncrement(stringIndex, absoluteNoteIndex)}
		onContextMenu={(e) => {
			e.preventDefault(); // Prevent default context menu
			onToggle(stringIndex, absoluteNoteIndex);
		}}
		id="note"
		data-value={note}
	>
		{note}
	</div>
);

/**
 * StringRow component - Renders a row of note cells representing a guitar string
 * @param string - Array of notes for this string
 * @param stringIndex - The index of this string in the tab
 * @param onIncrement - Function to handle incrementing note values
 * @param onToggle - Function to handle toggling note states
 * @param startNoteIndex - The starting index for this section of the tab
 */
const StringRow = ({
	string,
	stringIndex,
	onIncrement,
	onToggle,
	startNoteIndex,
}: StringRowProps & { startNoteIndex: number }) => (
	<div id="row" className="flex">
		{string.map((note, noteIndex) => (
			<NoteCell
				key={noteIndex}
				note={note}
				stringIndex={stringIndex}
				absoluteNoteIndex={startNoteIndex + noteIndex}
				onIncrement={onIncrement}
				onToggle={onToggle}
			/>
		))}
	</div>
);

/**
 * LoadingState component - Shows a spinner while data is loading
 */
const LoadingState = () => (
	<div className="flex items-center justify-center p-8">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tab"></div>
	</div>
);

/**
 * ErrorState component - Displays error messages
 * @param error - The error object to display
 */
const ErrorState = ({ error }: { error: Error }) => (
	<div className="flex items-center justify-center p-8 text-destructive">
		<p>Error: {error.message}</p>
	</div>
);

/**
 * GuitarTabCreator - Main component for creating and editing guitar tabs
 * Provides an interactive interface for inputting and visualizing guitar tablature
 */
export default function GuitarTabCreator() {
	// Get tab data and helper functions from custom hook
	const {
		tab,
		isLoading,
		error,
		handleCellClick,
		incrementNotesNumber,
		handleNewLineClick,
	} = useGuitarTab();

	// Constants and state for pagination
	const NOTES_PER_SECTION = 48; // Number of notes to display per section
	const [sectionsCount, setSectionsCount] = useState(1);

	// Calculate number of sections needed based on tab length
	useEffect(() => {
		if (tab.length > 0 && tab[0].length > 0) {
			setSectionsCount(Math.ceil(tab[0].length / NOTES_PER_SECTION));
		}
	}, [tab]);

	// Show loading or error states when appropriate
	if (isLoading) return <LoadingState />;
	if (error) return <ErrorState error={error} />;

	// Divide the tab into manageable sections for display
	const sections = [];
	for (let i = 0; i < sectionsCount; i++) {
		const startIndex = i * NOTES_PER_SECTION;
		const endIndex = Math.min(
			startIndex + NOTES_PER_SECTION,
			tab[0]?.length || 0
		);

		if (startIndex < (tab[0]?.length || 0)) {
			sections.push({
				data: tab.map((string) => string.slice(startIndex, endIndex)),
				startNoteIndex: startIndex,
			});
		}
	}

	return (
		<div className="container p-4 flex flex-col items-center max-w-full">
			{/* Tab sections container with horizontal scroll */}
			<div className="w-full overflow-x-scroll">
				{sections.map((section, index) => (
					<div
						key={`tab-section-${index}`}
						className="mb-4 flex flex-col items-start rounded-md"
					>
						{section.data.map((string, stringIndex) => (
							<StringRow
								key={`string-${stringIndex}-section-${section.startNoteIndex}`}
								string={string}
								stringIndex={stringIndex}
								startNoteIndex={section.startNoteIndex}
								onIncrement={incrementNotesNumber}
								onToggle={handleCellClick}
							/>
						))}
					</div>
				))}
			</div>
			{/* Button to add a new line to the tab */}
			<Button
				variant="shallow"
				className="flex justify-center"
				onClick={() => handleNewLineClick(tab)}
			>
				<span className="text-xl font-serif-text">+</span>
			</Button>
		</div>
	);
}
