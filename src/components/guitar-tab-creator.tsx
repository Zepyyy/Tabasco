"use client";

import { Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { NOTES_PER_SECTION } from "@/constants/guitar-tab";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { NoteCellProps, StringRowProps } from "@/types/guitar-tab";
import { Button } from "./ui/button";

/**
 * NoteCell component - Renders an individual note cell in the guitar tab
 * @param note - The note value to display
 * @param stringIndex - The index of the string this note belongs to
 * @param noteIndex - The position of this note in the string
 * @param onIncrement - Function to handle incrementing note value
 * @param onToggle - Function to handle toggling note states
 * @param absoluteNoteIndex - The absolute index of the note in the entire tab
 */

const NoteCell = React.memo(
	({
		note,
		stringIndex,
		onIncrement,
		onToggle,
		absoluteNoteIndex,
		handleSwitchNotes,
		noteOnePosition,
		setNoteOnePosition,
	}: NoteCellProps) => (
		<div
			className="border-r-2 last:border-none w-4 h-4 sm:w-6 sm:h-6 xl:w-8 xl:h-8 flex items-center justify-center cursor-grabbing font-bold text-foreground z-10 sm:text-md xl:text-xl font-serif-text nth-[6n]:border-tab border-tabsubtle data-[value='-']:text-tab/30 data-[value='X']:text-tab/50 select-none"
			onClick={() => onIncrement(stringIndex, absoluteNoteIndex)}
			onContextMenu={(e) => {
				e.preventDefault(); // Prevent default context menu
				onToggle(stringIndex, absoluteNoteIndex);
			}}
			onMouseDownCapture={() => {
				setNoteOnePosition({
					string: stringIndex,
					position: absoluteNoteIndex,
				});
			}}
			onMouseUpCapture={() => {
				handleSwitchNotes(noteOnePosition, {
					string: stringIndex,
					position: absoluteNoteIndex,
				});
				setNoteOnePosition({ string: -1, position: -1 });
			}}
			id="note"
			data-value={note}
		>
			{note}
		</div>
	),
);

/**
 * StringRow component - Renders a row of note cells representing a guitar string
 * @param string - Array of notes for this string
 * @param stringIndex - The index of this string in the tab
 * @param onIncrement - Function to handle incrementing note values
 * @param onToggle - Function to handle toggling note states
 * @param startNoteIndex - The starting index for this section of the tab
 */
const StringRow = React.memo(
	({
		string,
		stringIndex,
		onIncrement,
		onToggle,
		startNoteIndex,
		handleSwitchNotes,
		noteOnePosition,
		setNoteOnePosition,
	}: StringRowProps) => (
		<div id="row" className="flex">
			{string.map((note, noteIndex) => (
				<NoteCell
					key={`${stringIndex}-${noteIndex}`}
					note={note}
					stringIndex={stringIndex}
					absoluteNoteIndex={startNoteIndex + noteIndex}
					onIncrement={onIncrement}
					onToggle={onToggle}
					handleSwitchNotes={handleSwitchNotes}
					noteOnePosition={noteOnePosition}
					setNoteOnePosition={setNoteOnePosition}
				/>
			))}
		</div>
	),
);

const LoadingState = () => (
	<div className="flex items-center justify-center p-8">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tab"></div>
	</div>
);

export default function GuitarTabCreator() {
	const {
		tab,
		isLoading,
		handleCellClick,
		incrementNotesNumber,
		handleNewLineClick,
		handleRemoveSection,
		handleSwitchNotes,
	} = useGuitarTab();

	const [sectionsCount, setSectionsCount] = useState(1);
	const [noteOnePositon, setNoteOnePosition] = useState({
		position: -1,
		string: -1,
	});

	useEffect(() => {
		if (tab.length > 0 && tab[0].length > 0) {
			setSectionsCount(Math.ceil(tab[0].length / NOTES_PER_SECTION || 1));
		}
	}, [tab]);

	const sections = useMemo(() => {
		const result = [];
		for (let i = 0; i < sectionsCount; i++) {
			const startIndex = i * NOTES_PER_SECTION;
			const endIndex = Math.min(
				startIndex + NOTES_PER_SECTION,
				tab[0]?.length || 0,
			);

			if (startIndex < (tab[0]?.length || 0)) {
				result.push({
					data: tab.map((string) => string.slice(startIndex, endIndex)),
					startNoteIndex: startIndex,
				});
			}
		}
		return result;
	}, [tab, sectionsCount]);

	if (isLoading) return <LoadingState />;

	return (
		<div className="container p-4 flex flex-col items-center max-w-full">
			<div className="w-full overflow-x-scroll">
				{sections.map((section, index) => (
					<div className="flex" key={index}>
						<div
							className="flex justify-center items-center mr-6"
							key={`div-${index}`}
						>
							<div>
								<Button
									variant="destructive"
									onClick={() => handleRemoveSection(section)}
									key={`delete-section-${index}`}
								>
									<Trash />
								</Button>
							</div>
						</div>
						<div
							key={`tab-section-${index}`}
							className="mb-4 flex flex-col items-start rounded-md"
						>
							{section.data.map((string, stringIndex) => (
								<StringRow
									key={`row-${stringIndex}-section-${index}`}
									string={string}
									stringIndex={stringIndex}
									startNoteIndex={section.startNoteIndex}
									onIncrement={incrementNotesNumber}
									onToggle={handleCellClick}
									handleSwitchNotes={handleSwitchNotes}
									noteOnePosition={noteOnePositon}
									setNoteOnePosition={setNoteOnePosition}
								/>
							))}
						</div>
					</div>
				))}
			</div>
			<div>
				<Button variant="deep" onClick={() => handleNewLineClick(tab)}>
					<span className="text-xl font-serif-text">+</span>
				</Button>
			</div>
		</div>
	);
}
