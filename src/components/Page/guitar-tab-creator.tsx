import { CopyPlus, LayoutList, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { NOTES_PER_BAR, NOTES_PER_SECTION } from "@/constants/guitar-tab";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { cn } from "@/lib/utils";
import { NoteCellProps, StringRowProps } from "@/types/guitar-tab";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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

/* Line hierarchy on the tab paper: a hairline between cells, a slightly
   darker tick on every beat (4 sixteenths), a barline every bar, and a full
   ink line closing the section. Computed per cell so the weights never
   depend on CSS cascade order. */
const cellLineClass = (absoluteNoteIndex: number) => {
	const positionInSection = absoluteNoteIndex % NOTES_PER_SECTION;
	const isSectionEnd = positionInSection === NOTES_PER_SECTION - 1;
	const isBarline = positionInSection === NOTES_PER_BAR - 1;
	const isBeat = (positionInSection + 1) % (NOTES_PER_BAR / 4) === 0;
	if (isSectionEnd) return "border-r-2 border-tab";
	if (isBarline) return "border-r-2 border-tab/70";
	if (isBeat) return "border-tab/45";
	return "border-tabsubtle";
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
			className={cn(
				"font-tab flex aspect-square w-[max(16px,calc((100cqw-28px)/32))] shrink-0 cursor-pointer items-center justify-center border-r text-[clamp(12px,1.9cqw,22px)] font-medium text-tab select-none hover:bg-primary/15 data-[value='-']:text-tab/30 data-[value='X']:text-tab/50",
				cellLineClass(absoluteNoteIndex),
			)}
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
		<div className="relative flex">
			<p className="font-tab w-6 shrink-0 self-center text-center text-[11px] leading-none text-muted-foreground/80">
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
		<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-tab"></div>
	</div>
);

export default function GuitarTabCreator({
	editingSections,
	toggleEditingSections,
}: {
	editingSections: boolean;
	toggleEditingSections: () => void;
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
		<div className="flex flex-col">
			<div
				className={cn(
					"@container relative rounded-xl transition-colors",
					editingSections &&
						"bg-primary/[0.015] outline-1 outline-dashed outline-offset-8 outline-primary/35",
				)}
			>
				{editingSections && (
					<div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
						<div className="pointer-events-auto flex -translate-y-1/2 items-center gap-2 rounded-full border bg-popover py-1 pr-1 pl-3.5 shadow-md">
							<LayoutList className="size-3.5 text-primary" />
							<span className="text-[13px] font-medium">Editing sections</span>
							<span className="text-[13px] text-muted-foreground">
								· {sections.length}{" "}
								{sections.length === 1 ? "section" : "sections"}
							</span>
							<Button
								size="xs"
								className="ml-1 rounded-full"
								onClick={() => toggleEditingSections()}
							>
								Done
							</Button>
						</div>
					</div>
				)}
				<div
					className={cn("overflow-x-auto py-3 pl-1", editingSections && "pt-7")}
				>
					{sections.map((section, index) => (
						<div
							key={`tab-section-${index}`}
							className="group/highlight relative mb-5 last:mb-1"
						>
							{editingSections && (
								<>
									{/* Soft highlight following the pointer */}
									<div className="absolute -inset-2 rounded-lg border border-primary/25 bg-primary/[0.045] opacity-0 transition-opacity duration-100 group-hover/highlight:opacity-100" />

									{/* Actions pinned to the section's top-right corner */}
									<div className="absolute -top-4 right-0 z-10 flex items-center gap-0.5 rounded-lg border bg-popover p-0.5 opacity-0 shadow-md transition-opacity duration-100 group-hover/highlight:opacity-100">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon-xs"
													aria-label="Duplicate section"
													onClick={() => handleDuplicateSection(section)}
												>
													<CopyPlus />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Duplicate section</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="icon-xs"
													aria-label="Remove section"
													className="text-danger hover:bg-danger/10 hover:text-danger"
													onClick={() => handleRemoveSection(section)}
												>
													<Trash2 />
												</Button>
											</TooltipTrigger>
											<TooltipContent>Remove section</TooltipContent>
										</Tooltip>
									</div>
								</>
							)}
							<div className={cn(editingSections && "pointer-events-none")}>
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
				<div className="mt-3 flex justify-center">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground"
						onClick={() => handleAddSection()}
					>
						<Plus />
						<span>Add section</span>
					</Button>
				</div>
			</div>
		</div>
	);
}
