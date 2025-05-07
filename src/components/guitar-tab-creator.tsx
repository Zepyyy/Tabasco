"use client";

import { useGuitarTab } from "@/hooks/useGuitarTab";
import { NoteCellProps, StringRowProps } from "@/types/guitar-tab";

// Reusable component for a single note cell
const NoteCell = ({
	note,
	stringIndex,
	noteIndex,
	onIncrement,
	onToggle,
}: NoteCellProps) => (
	<div
		className={`border-r-2 last:border-none w-8 h-8 flex items-center justify-center cursor-grabbing font-bold text-foreground z-10 text-xl font-serifText [&:nth-child(6n)]:border-tab border-tabsubtle data-[value="-"]:text-tab/30 data-[value="X"]:text-tab/50`}
		onClick={() => onIncrement(stringIndex, noteIndex)}
		onContextMenu={(e) => {
			e.preventDefault();
			onToggle(stringIndex, noteIndex);
		}}
		id="note"
		data-value={note}
	>
		{note}
	</div>
);

// Reusable component for a string of notes
const StringRow = ({
	string,
	stringIndex,
	onIncrement,
	onToggle,
}: StringRowProps) => (
	<div key={stringIndex} id="row" className="flex">
		{string.map((note, noteIndex) => (
			<NoteCell
				key={noteIndex}
				note={note}
				stringIndex={stringIndex}
				noteIndex={noteIndex}
				onIncrement={onIncrement}
				onToggle={onToggle}
			/>
		))}
	</div>
);

// Loading state component
const LoadingState = () => (
	<div className="flex items-center justify-center p-8">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tab"></div>
	</div>
);

// Error state component
const ErrorState = ({ error }: { error: Error }) => (
	<div className="flex items-center justify-center p-8 text-destructive">
		<p>Error: {error.message}</p>
	</div>
);

export default function GuitarTabCreator() {
	const { tab, isLoading, error, handleCellClick, incrementNotesNumber } =
		useGuitarTab();

	if (isLoading) {
		return <LoadingState />;
	}

	if (error) {
		return <ErrorState error={error} />;
	}

	return (
		<div className="container p-4">
			<div className="mb-4 flex flex-col items-center rounded-md">
				{tab.map((string, stringIndex) => (
					<StringRow
						key={stringIndex}
						string={string}
						stringIndex={stringIndex}
						onIncrement={incrementNotesNumber}
						onToggle={handleCellClick}
					/>
				))}
			</div>
		</div>
	);
}
