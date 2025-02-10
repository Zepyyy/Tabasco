import { DropdownMenu } from "radix-ui";
import { ChevronDownIcon, Ellipsis, Plus } from "lucide-react";
import { useContext, useState } from "react";
import { NameContext } from "@/contexts/NameContext";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

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
	sheet,
	onRename,
	onMoveDown,
	onDelete,
}: {
	sheet: Sheet;
	onRename: () => void;
	onMoveDown: () => void;
	onDelete: () => void;
}) => (
	<>
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={onRename}
			key={`Rename-${sheet.position}`}
		>
			Rename
		</DropdownMenu.Item>
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={() => console.log("Duplicate")}
			key={`Duplicate-${sheet.position}`}
		>
			Duplicate
		</DropdownMenu.Item>
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={onMoveDown}
			key={`Move-${sheet.position}`}
		>
			Move Down
		</DropdownMenu.Item>
		<DropdownMenu.Separator className="h-[0.5px] bg-tab" />
		<DropdownMenu.Item
			className="group relative flex h-6 select-none items-center pl-3 pr-4 leading-none text-destructive-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-destructive/10"
			onClick={onDelete}
			key={`Delete-${sheet.position}`}
		>
			Delete
		</DropdownMenu.Item>
	</>
);

export default function BreadCrumbs() {
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

	const handleDelete = (position: number) => {
		const updatedSheets = sheets
			.filter((sheet: Sheet) => sheet.position !== position)
			.map((sheet: Sheet, index: number) => ({
				...sheet,
				position: index,
			}));

		localStorage.setItem("sheets", JSON.stringify(updatedSheets));
		setSheets(updatedSheets);
	};

	const handleAddSheet = () => {
		const newSheet = {
			tabName: `Sheet ${sheets.length + 1}`,
			position: sheets.length,
		};
		const updatedSheets = [...sheets, newSheet];
		localStorage.setItem("sheets", JSON.stringify(updatedSheets));
		setSheets(updatedSheets);
	};

	const sortedSheets = sheets.sort(
		(a: { position: number }, b: { position: number }) =>
			a.position - b.position,
	);

	return (
		<Breadcrumb className="w-full absolute top-0 left-0 pt-12 pl-12 z-20 text-xl font-serifTitle">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<p className="text-xl font-serifTitle">...</p>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator>
					<p className="text-xl font-serifTitle">/</p>
				</BreadcrumbSeparator>
				<BreadcrumbItem>
					{editingName ? (
						<RenameInput
							initialValue={editingName}
							onRename={(newName) => handleRenameSubmit(editingName, newName)}
							onCancel={() => setEditingName(null)}
						/>
					) : (
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild>
								<button
									className="appearance-none green-400 border-none inline-flex items-center justify-center rounded-md text-tab transition-all text-xl font-serifTitle gap-2"
									aria-label="Customise options"
								>
									{tabName || "Unnamed"}
									<ChevronDownIcon size={24} />
								</button>
							</DropdownMenu.Trigger>

							<DropdownMenu.Portal>
								<DropdownMenu.Content
									className="ml-10 bg-background border border-tab rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-40 text-lg font-serifText"
									sideOffset={4}
								>
									<DropdownMenu.Item className="group relative flex h-7 select-none items-center leading-none text-tab min-w-44 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10">
										<div className="flex justify-between w-full relative items-center pl-2 pr-2 rounded-sm text-tab gap-9">
											{tabName || "Unnamed"}
											<Plus
												className="w-4 h-4 cursor-pointer"
												onClick={handleAddSheet}
											/>
										</div>
									</DropdownMenu.Item>
									<DropdownMenu.Separator className="h-[0.5px] bg-tab" />
									{sortedSheets.map((sheet: Sheet) => (
										<DropdownMenu.Sub key={sheet.position}>
											<DropdownMenu.SubTrigger className="group relative flex h-6 select-none items-center pl-2 pr-2 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10 my-1 last:my-0 gap-9">
												{sheet.tabName}
												<div className="ml-auto group-data-[highlighted]:text-tab/50">
													<Ellipsis size={20} />
												</div>
											</DropdownMenu.SubTrigger>
											<DropdownMenu.Portal>
												<DropdownMenu.SubContent
													className="bg-background border border-tab rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-40 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade text-lg font-serifText"
													sideOffset={6}
													key={sheet.position}
												>
													<SheetActionsMenu
														sheet={sheet}
														onRename={() => setEditingName(sheet.tabName)}
														onMoveDown={() => handleMoveSubmit(sheet.position)}
														onDelete={() => handleDelete(sheet.position)}
													/>
												</DropdownMenu.SubContent>
											</DropdownMenu.Portal>
										</DropdownMenu.Sub>
									))}
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					)}
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
