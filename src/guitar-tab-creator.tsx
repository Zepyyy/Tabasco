"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
const STRINGS = 6;
const DEFAULT_NOTE = "-";
const OPEN_STRING = "0";
const MUTED_STRING = "X";
const MAX_COLS = 48;

export default function GuitarTabCreator() {
	const [NOTES, setNOTES] = useState(24);

	const [tab, setTab] = useState<string[][]>(
		Array(STRINGS)
			.fill(null)
			.map(() => Array(NOTES).fill(DEFAULT_NOTE))
	);

	const handleCellClick = (string: number, note: number) => {
		const newTab = tab.map((row, i) =>
			row.map((cell, j) =>
				i === string && j === note
					? cell === DEFAULT_NOTE
						? OPEN_STRING
						: cell === OPEN_STRING
						? MUTED_STRING
						: DEFAULT_NOTE
					: cell
			)
		);
		setTab(newTab);
		console.log(string);
	};

	const incrementNotesNumber = (string: number, note: number) => {
		const newTab = [...tab];
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
					nextValue > 24 ? DEFAULT_NOTE : nextValue.toString();
				break;
			}
		}
		setTab(newTab);
	};

	const clearTab = () => {
		setTab(
			Array(STRINGS)
				.fill(null)
				.map(() => Array(NOTES).fill(DEFAULT_NOTE))
		);
	};

	const handleAddNotesClick = (amount: number = 1) => {
		switch (true) {
			case NOTES + amount > MAX_COLS:
				amount = MAX_COLS - NOTES;
				break;
			case NOTES + amount < 1:
				amount = 1;
				break;
		}
		setNOTES(NOTES + amount);
		setTab((prevTab) => {
			return prevTab.map((row) => [
				...row,
				...Array(amount).fill(DEFAULT_NOTE),
			]);
		});
	};

	return (
		<div className="container p-4">
			<div className="mb-4 flex flex-row items-center">
				<div className="rounded-md">
					{tab.map((string, i) => (
						<div key={i} className="flex" id="row">
							{string.map((note, j) => (
								<div
									key={j}
									className="border-r-2 last:border-none [&:nth-child(6n)]:border-tab border-tabsubtle w-8 h-8 flex items-center justify-center cursor-grabbing text-foreground z-10"
									onClick={() => incrementNotesNumber(i, j)}
									onContextMenu={(e) => {
										e.preventDefault();
										handleCellClick(i, j);
									}}
									id="note"
									data-value={note}
								>
									{note}
								</div>
							))}
						</div>
					))}
				</div>
				<Button
					variant={"default"}
					onClick={(e) => {
						e.preventDefault();
						handleAddNotesClick(6);
					}}
					className="w-8 h-full ml-2 py-12 hover:bg-primary hover:tesxt-primary-foreground"
				>
					+
				</Button>
			</div>
			<div className="flex gap-4">
				<Button
					variant={"default"}
					onClick={clearTab}
					className="hover:opacity-50 hover:bg-primary hover:text-primary-foreground"
				>
					Clear Tab
				</Button>
			</div>
		</div>
	);
}
