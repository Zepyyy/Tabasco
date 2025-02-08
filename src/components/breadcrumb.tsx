import { ChevronDownIcon, Plus } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NameContext } from "@/contexts/NameContext";
import { useContext, useState } from "react";

interface Sheet {
	tabName: string;
	position: number;
}

// [{"tabName":"Second","position":1},{"tabName":"First","position":0},{"tabName":"Third","position":2}]

const defaultSheets = [
	{ tabName: "First", position: 0 },
	{ tabName: "Second", position: 1 },
	{ tabName: "Third", position: 2 },
];

// Reusable component for the rename input
const RenameInput = ({
	initialValue,
	onRename,
	onCancel,
}: {
	initialValue: string;
	onRename: (newName: string) => void;
	onCancel: () => void;
}) => (
	<input
		className="bg-background text-foreground px-2 py-1 rounded-md w-full border border-tab/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
		type="text"
		defaultValue={initialValue}
		autoFocus
		onClick={(e) => e.stopPropagation()}
		onBlur={(e) => onRename(e.target.value)}
		onKeyDown={(e) => {
			e.stopPropagation();
			if (e.key === "Enter") onRename(e.currentTarget.value);
			if (e.key === "Escape") onCancel();
		}}
	/>
);

// Reusable component for sheet actions menu
const SheetActionsMenu = ({
	// sheet,
	onRename,
	onMoveDown,
}: {
	sheet: Sheet;
	onRename: () => void;
	onMoveDown: () => void;
}) => (
	<DropdownMenuContent
		side="right"
		sideOffset={2}
		alignOffset={-5}
		className="min-w-[160px] bg-background border border-tab/20 rounded-md shadow-lg p-1 text-sm"
	>
		<DropdownMenuItem
			className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary rounded-sm transition-colors"
			onClick={onRename}
		>
			Rename
		</DropdownMenuItem>
		<DropdownMenuItem
			className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary rounded-sm transition-colors"
			onClick={() => console.log("Duplicate")}
		>
			Duplicate
		</DropdownMenuItem>
		<DropdownMenuItem
			className="px-3 py-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary rounded-sm transition-colors"
			onClick={onMoveDown}
		>
			Move Down
		</DropdownMenuItem>
		<DropdownMenuSeparator className="my-1 h-px bg-tab/10" />
		<DropdownMenuItem
			className="px-3 py-1.5 cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-sm transition-colors"
			onClick={() => console.log("Delete")}
		>
			Delete
		</DropdownMenuItem>
	</DropdownMenuContent>
);

export default function BreadCrumbs() {
	// const tabName = useContext(NameContext);
	const [editingName, setEditingName] = useState<string | null>(null);
	const [sheets, setSheets] = useState(() =>
		JSON.parse(localStorage.getItem("sheets") || JSON.stringify(defaultSheets)),
	);
	const { tabName: tabName } = useContext(NameContext);

	const handleRenameSubmit = (oldName: string, newName: string) => {
		if (newName && newName !== oldName) {
			const updatedSheets = sheets.map((sheet: Sheet) =>
				sheet.tabName === oldName ? { ...sheet, tabName: newName } : sheet,
			);
			localStorage.setItem("sheets", JSON.stringify(updatedSheets));
			setSheets(updatedSheets);
		}
		setEditingName(null);
	};

	const handleMoveSubmit = (oldPosition: number) => {
		const newPosition = oldPosition + 1;

		// Check if the new position is valid (i.e., it exists in the sheets array)
		if (newPosition >= sheets.length) return; // Prevent moving beyond the last sheet

		const updatedSheets = sheets.map((sheet: Sheet) => {
			if (sheet.position === oldPosition) {
				return { ...sheet, position: newPosition };
			}
			if (sheet.position === newPosition) {
				return { ...sheet, position: oldPosition };
			}
			return sheet;
		});

		localStorage.setItem("sheets", JSON.stringify(updatedSheets));
		setSheets(updatedSheets);
	};

	const sortedSheets = sheets.sort(
		(a: { position: number }, b: { position: number }) =>
			a.position - b.position,
	);

	return (
		<Breadcrumb className="w-full absolute top-0 left-0 pt-12 pl-12 z-20">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">...</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{editingName ? (
						<RenameInput
							initialValue={editingName}
							onRename={(newName) => handleRenameSubmit(editingName, newName)}
							onCancel={() => setEditingName(null)}
						/>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 z-40 ">
								{tabName || "Unnamed"}
								<ChevronDownIcon />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="bg-background border border-tab rounded-md"
							>
								<div className="flex justify-between w-full relative items-center gap-2 rounded-sm px-2 py-1.5 text-sm focus:bg-accent focus:text-accent-foreground">
									<p className="text-tab">{tabName || "Unnamed"}</p>
									<Plus
										className="w-4 h-4 text-tab cursor-pointer"
										onClick={() => console.log("Create new")}
									/>
								</div>
								<DropdownMenuSeparator className="bg-tab" />

								{sortedSheets.map((sheet: Sheet) => (
									<DropdownMenuItem key={sheet.position}>
										<div className="flex justify-between w-full ">
											<div>{sheet.tabName}</div>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger />
												<SheetActionsMenu
													sheet={sheet}
													onRename={() => setEditingName(sheet.tabName)}
													onMoveDown={() => handleMoveSubmit(sheet.position)}
												/>
											</DropdownMenuSub>
										</div>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
