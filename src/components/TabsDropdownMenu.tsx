import { Plus } from "lucide-react";
import { useContext, useState } from "react";

import addTab from "@/db/crud/AddTab";
import UpdateTabById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import deleteTabById from "@/db/crud/DeleteTab";

import { TabsContext } from "@/contexts/TabsContext";
import { NameContext } from "@/contexts/NameContext";

import { TabInfo } from "@/db/db";
import { Link } from "react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
			if (e.key === "Escape") {
				onCancel();
			}
		}}
	/>
);

// Reusable component for sheet actions menu
const SheetActionsMenu = ({
	position,
	onRename,
	onMoveDown,
	onDelete,
}: {
	position: string;
	onRename: () => void;
	onMoveDown: () => void;
	onDelete: () => void;
}) => (
	<>
		<DropdownMenuItem
			className="group flex h-7 select-none items-center text-tab outline-none data-[disabled]:pointer-events-none focus:bg-foreground/10"
			onClick={onRename}
			key={`Rename-${position}`}
		>
			Rename
		</DropdownMenuItem>
		<DropdownMenuItem
			className="group flex h-7 select-none items-center text-tab outline-none data-[disabled]:pointer-events-none focus:bg-foreground/10"
			onClick={() => console.log("Duplicate")}
			key={`Duplicate-${position}`}
		>
			Duplicate
		</DropdownMenuItem>
		<DropdownMenuItem
			className="group flex h-7 select-none items-center text-tab outline-none data-[disabled]:pointer-events-none focus:bg-foreground/10"
			onClick={onMoveDown}
			key={`Move-${position}`}
		>
			Move Down
		</DropdownMenuItem>
		<DropdownMenuSeparator className="bg-tab" />
		<DropdownMenuItem
			className="group cursor-pointer flex h-6 select-none items-center leading-none text-destructive-foreground outline-none data-[disabled]:pointer-events-none focus:bg-destructive/10 focus:text-destructive pt-0"
			onClick={onDelete}
			key={`Delete-${position}`}
		>
			Delete
		</DropdownMenuItem>
	</>
);

export default function TabsDropdownMenu() {
	const { tabName: tabName } = useContext(NameContext);
	const tabs = useContext(TabsContext);
	const [id, setId] = useState("");
	const [editingName, setEditingName] = useState<string | null>(null);

	const handleRenameSubmit = (oldName: string, newName: string) => {
		if (newName && newName !== oldName) {
			UpdateTabById(id, newName);
		}
		setId("");
		setEditingName(null);
	};

	const handleMoveSubmit = (oldPosition: string) => {
		const newPosition = parseInt(oldPosition) + 1;
		// Check if the new position is valid (i.e., it exists in the tabs array)
		if (newPosition >= tabs.length) return; // Prevent moving beyond the last tab
		tabs.map((tab: TabInfo) => {
			if (tab.position === oldPosition) {
				updateTabPositionById(oldPosition, newPosition.toString());
			}
			return;
		});
	};

	return (
		<>
			{editingName ? (
				<RenameInput
					initialValue={editingName}
					onRename={(newName) =>
						handleRenameSubmit(editingName, newName)
					}
					onCancel={() => setEditingName(null)}
				/>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger className="appearance-none border-none inline-flex items-center justify-center rounded-md text-tab transition-all text-xl font-serifText gap-2">
						<button aria-label="Customise options">
							{tabName || "Unnamed"}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent
							className="flex flex-col p-0 m-0 bg-background/80 backdrop-blur-sm shadow-lg ml-10 z-40 font-serifText text-xl"
							sideOffset={4}
						>
							<DropdownMenuLabel>
								<div className="flex justify-between w-full relative items-center rounded-sm text-tab gap-8 text-xl">
									Your tabs
									<Plus
										className="w-4 h-4 cursor-pointer"
										onClick={() => addTab({})}
									/>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="h-[0.5px] bg-tab" />
							{tabs.map((tab: TabInfo) => (
								<Link
									to={`/sheet/${tab.position}`}
									key={tab.position}
								>
									<DropdownMenuSub key={tab.position}>
										<DropdownMenuSubTrigger className="group relative flex h-6 select-none items-center pl-2 pr-2 outline-none data-[disabled]:pointer-events-none my-1 last:my-0 gap-9 text-xl data-[state=open]:bg-foreground/10 text-tab bg-background focus:bg-foreground/10 focus:text-tab">
											{tab.tabName}
											<div className="ml-auto focus:text-tab/50 group-data-[highlighted]:text-tab/50"></div>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent
												className="z-50 bg-background text-foreground shadow-lg border border-tab font-serifText p-0"
												sideOffset={6}
												key={tab.position}
											>
												<SheetActionsMenu
													position={tab.position}
													onRename={() => {
														setId(tab.position);
														setEditingName(
															tab.tabName
														);
													}}
													onMoveDown={() =>
														handleMoveSubmit(
															tab.position
														)
													}
													onDelete={() =>
														deleteTabById(
															tab.position
														)
													}
												/>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								</Link>
							))}
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			)}
		</>
	);
}
