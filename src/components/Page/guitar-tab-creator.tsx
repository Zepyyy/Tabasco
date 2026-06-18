"use client";

import { CopyPlus, Plus, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { NOTES_PER_SECTION } from "@/constants/guitar-tab";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { NoteCellProps, StringRowProps } from "@/types/guitar-tab";
import { Button } from "../ui/button";

/**
 * NoteCell component - Renders an individual note cell in the guitar tab
 * @param note - The note value to display
 * @param stringIndex - The index of the string this note belongs to
 * @param noteIndex - The position of this note in the string
 * @param onIncrement - Function to handle incrementing note value
 * @param onToggle - Function to handle toggling note states
 * @param absoluteNoteIndex - The absolute index of the note in the entire tab
 */

const label = (index: number) => {
	const labels = ["e", "B", "G", "D", "A", "E"];
	return labels[index];
};

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
			className="border-r-2 last:border-none w-4 h-4 sm:w-6 sm:h-6 xl:w-8 xl:h-8 flex items-center justify-center hover:bg-primary/15 dark:hover:bg-primary/20 cursor-pointer font-bold text-foreground z-10 sm:text-md xl:text-xl font-serif-text nth-[6n]:border-tab border-tabsubtle data-[value='-']:text-tab/30 data-[value='X']:text-tab/50 select-none"
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
		<div id="row" className="flex relative">
			<p className="text-xs absolute top-1/2 -left-2 -translate-1/2">
				{label(stringIndex)}
			</p>
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

export default function GuitarTabCreator({
	editingSections,
}: {
	editingSections: boolean;
}) {
	const {
		tab,
		isLoading,
		handleCellClick,
		incrementNotesNumber,
		handleAddSection,
		handleDuplicateSection,
		handleRemoveSection,
		handleSwitchNotes,
	} = useGuitarTab();

	const [sectionsCount, setSectionsCount] = useState(1);
	const [noteOnePositon, setNoteOnePosition] = useState({
		position: -1,
		string: -1,
	});

	// This effect updates the sections count based on the tab's length
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
		<div className="container flex flex-col items-center min-w-full">
			<div className="w-full overflow-x-scroll">
				{sections.map((section, index) => (
					<div className="flex items-center ml-4" key={index}>
						<div
							key={`tab-section-${index}`}
							className="mb-4 flex flex-col items-start rounded-md relative group/highlight"
						>
							{editingSections && (
								<>
									{/* Section highlight on hover */}
									<div className="absolute top-0 left-0 w-full h-full transition-colors duration-50 group-hover/highlight:bg-primary/35 opacity-50 rounded group-hover/highlight:border ease-in-out" />

									{/* Buttons on hover while in editing mode */}
									<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15">
										<div className="flex justify-center items-center gap-4">
											<Button
												variant="destructive"
												onClick={() => handleRemoveSection(section)}
												key={`delete-section-${index}`}
												className="flex group-hover/highlight:opacity-100 opacity-25"
											>
												<X strokeWidth={3} />
												<span className="ml-0.5">Remove section</span>
											</Button>
											<Button
												variant="outline-fill"
												onClick={() => handleDuplicateSection(section)}
												key={`duplicate-section-${index}`}
												className="flex group-hover/highlight:opacity-100 opacity-25"
											>
												<CopyPlus strokeWidth={3} />
												<span className="ml-0.5">Duplicate section</span>
											</Button>
										</div>
									</div>
								</>
							)}
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
			<div className="flex gap-2 mt-4">
				<Button variant="outline" size={"lg"} onClick={() => handleAddSection()}>
                    <Plus />
                    <span>Add section</span>
				</Button>
			</div>
		</div>
	);
}
