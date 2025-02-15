"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateCurrentTabs } from "@/db/crud/UpdateTab";
import { PositionContext } from "@/contexts/PositionContext";

const STRINGS = 6;
const DEFAULT_NOTE = "-";
const OPEN_STRING = "0";
const MUTED_STRING = "X";
const MAX_COLS = 48;

export default function GuitarTabCreator() {
	const { position } = useContext(PositionContext);

	const [NOTES, setNOTES] = useState(48);
	const [tab, setTab] = useState(
		Array(STRINGS)
			.fill(null)
			.map(() => Array(NOTES).fill(DEFAULT_NOTE)) as string[][],
	);
	// const StoredTabs = useLiveQuery(async () => {
	// 	return await db.TabInfo.toArray();
	// });
	// console.log(StoredTabs);

	// if (!StoredTabs) {
	// 	try {
	// 		const id = db.TabInfo.add({
	// 			// id: Date.now(),
	// 			tabName: "alezd",
	// 			tabs: Array(STRINGS)
	// 				.fill(null)
	// 				.map(() => Array(MAX_COLS).fill(DEFAULT_NOTE)),
	// 			position: "0",
	// 		});
	// 		console.log(id);
	// 	} catch (error) {
	// 		console.log(`Failed to add Unnamed: ${error}`);
	// 	}
	// }

	const handleCellClick = (string: number, note: number) => {
		const newTab = tab.map((row, i) =>
			row.map((cell, j) =>
				i === string && j === note
					? cell === DEFAULT_NOTE
						? OPEN_STRING
						: cell === OPEN_STRING
							? MUTED_STRING
							: DEFAULT_NOTE
					: cell,
			),
		);
		setTab(newTab);
		updateCurrentTabs(newTab, position);
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
				.map(() => Array(NOTES).fill(DEFAULT_NOTE)),
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
						<div key={i} id="row" className="flex">
							{string.map((note, j) => (
								<div
									key={j}
									className={`border-r-2 last:border-none w-8 h-8 flex items-center justify-center cursor-grabbing text-foreground z-10 text-lg font-serifText [&:nth-child(6n)]:border-tab border-tabsubtle`}
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
					variant={"outline"}
					onClick={(e) => {
						e.preventDefault();
						handleAddNotesClick(12);
					}}
					className="w-8 h-full ml-2 py-12 text-base font-serifText"
				>
					+
				</Button>
			</div>
			<div className="flex gap-4">
				<Button
					onClick={clearTab}
					variant={"deep"}
					className="text-xl font-normal font-serifText py-6 px-4"
				>
					Clear Tab
				</Button>
			</div>
		</div>
	);
}
